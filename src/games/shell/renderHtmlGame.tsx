import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cache } from "react";
import HtmlGameFrame from "./HtmlGameFrame";

/**
 * Server-side loader for the self-contained HTML assessments.
 *
 * Each assessment ships as `index.html` plus a sibling script. Both are read
 * at request time, the script is inlined (the folder is not served statically,
 * so a relative <script src> would 404), a dark-theme bridge is injected, and
 * the result goes into a sandboxed iframe via srcDoc.
 *
 * Reads are memoised per request with React `cache`, and the files live under
 * src/ so they are never exposed as public URLs.
 */

const ASSESSMENT_ROOT = "src/games/html-assessments";

/** Prevents an inlined script from terminating its own <script> block. */
function escapeInlineScript(script: string): string {
  return script.replaceAll("</script", "<\\/script");
}

/**
 * The site renders dark-only. This makes the framed document agree, before
 * first paint, without giving it access to the parent document.
 */
const THEME_BRIDGE = `
<style>
  html, body { color-scheme: dark; }
</style>
<script>
  (function () {
    function apply(theme) {
      var t = theme === "light" ? "light" : "dark";
      document.documentElement.dataset.theme = t;
      document.documentElement.style.colorScheme = t;
      document.documentElement.classList.toggle("dark", t === "dark");
      if (document.body) document.body.classList.toggle("dark", t === "dark");
    }
    apply("dark");
    document.addEventListener("DOMContentLoaded", function () { apply("dark"); });
    window.addEventListener("message", function (event) {
      if (event.data && event.data.type === "blync-theme") apply(event.data.theme);
    });
  })();
</script>
`;

/**
 * The assessments each hardcode a localStorage key. They now share one origin
 * (see the sandbox note in HtmlGameFrame), so the keys are rewritten per folder
 * to stop two assessments overwriting each other's saved progress.
 */
const STORAGE_KEYS = ["cm_debug_state_native", "cm_acc_theme"];

function namespaceStorageKeys(script: string, folder: string): string {
  return STORAGE_KEYS.reduce(
    (acc, key) => acc.replaceAll(key, `blync_${folder.replace(/[^a-z0-9]+/gi, "_")}_${key}`),
    script
  );
}

const readAssessment = cache((folder: string, scriptFile: string) => {
  const base = join(process.cwd(), ASSESSMENT_ROOT, folder);
  const html = readFileSync(join(base, "index.html"), "utf8");
  const script = namespaceStorageKeys(readFileSync(join(base, scriptFile), "utf8"), folder);

  return html
    .replace(
      new RegExp(`<script\\s+src=["']${scriptFile}["']\\s*(?:defer\\s*)?></script>`),
      `<script>${escapeInlineScript(script)}</script>`
    )
    .replace("</head>", `${THEME_BRIDGE}</head>`);
});

/** Single-file assessments (no sibling script to inline). */
const readSingleFile = cache((relativePath: string) => {
  const html = readFileSync(join(process.cwd(), ASSESSMENT_ROOT, relativePath), "utf8");
  return html.replace("</head>", `${THEME_BRIDGE}</head>`);
});

export interface HtmlGameProps {
  /** Folder under src/games/html-assessments, or a path for single-file rounds. */
  folder: string;
  /** Sibling script to inline. Omit for single-file assessments. */
  scriptFile?: string;
  title: string;
  allow?: string;
}

export default function HtmlGame({ folder, scriptFile, title, allow }: HtmlGameProps) {
  const srcDoc = scriptFile ? readAssessment(folder, scriptFile) : readSingleFile(folder);

  return (
    <div className="min-h-screen bg-background pt-16 sm:pt-20 lg:pt-24">
      <HtmlGameFrame srcDoc={srcDoc} title={title} allow={allow} />
    </div>
  );
}
