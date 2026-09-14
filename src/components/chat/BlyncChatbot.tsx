"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Globe,
  Lock,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
  timestamp: string;
  isStreaming?: boolean;
  searchedWeb?: boolean;
  suggestions?: string[];
}

const STARTER_QUESTIONS = [
  "What is the Capgemini Game Round?",
  "Which 26+ games are on Blync?",
  "What is included in Blync Pro (₹49)?",
  "Tips to solve the Switch Challenge",
  "Accenture vs Capgemini round differences",
];

export default function BlyncChatbot() {
  const { data: session } = authClient.useSession();
  const user = session?.user as { name?: string | null; email?: string; isPro?: boolean } | undefined;

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-msg",
      role: "bot",
      text: "Hello! I am **BlyncBot**, your cognitive test and placement assistant.\n\nAsk me anything about **Blync games**, **Blync Pro (₹49/mo)**, or recruitment assessment rounds for **Capgemini, Accenture, TCS, Cognizant, Infosys & Wipro**.",
      timestamp: "Just now",
      suggestions: [
        "How does Capgemini Game Round work?",
        "What games are on Blync?",
        "What's included in Blync Pro for ₹49?",
      ],
    },
  ]);

  // Personalize welcome message when authenticated user is detected
  useEffect(() => {
    if (user?.name) {
      const firstName = user.name.split(" ")[0];
      setMessages((prev) => {
        if (prev.length === 1 && prev[0].id === "welcome-msg") {
          return [
            {
              id: "welcome-msg",
              role: "bot",
              text: `Hey ${firstName}! 👋 I am **BlyncBot**, your personalized cognitive & placement mentor.\n\n${
                user.isPro
                  ? "🌟 **Blync Pro is Active** — You have full access to all 26+ games, official test timers, and solution guides!\n\n"
                  : "Ready to prepare for **Capgemini, Accenture, TCS & Cognizant** rounds? Let's get you placed!\n\n"
              }Ask me anything about game strategies, test patterns, or winning shortcuts.`,
              timestamp: "Just now",
              suggestions: user.isPro
                ? [
                    "How to eliminate wrong branches in Switch Challenge?",
                    "Capgemini 4-game test pattern breakdown",
                    "Digit Challenge speed calculation tricks",
                  ]
                : [
                    "How does the Capgemini Game Round work?",
                    "What is included in Blync Pro for ₹49?",
                    "Switch Challenge winning tips",
                  ],
            },
          ];
        }
        return prev;
      });
    }
  }, [user?.name, user?.isPro]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Resizable state
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 420, height: 580 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const cleanupResizeRef = useRef<(() => void) | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      cleanupResizeRef.current?.();
      abortControllerRef.current?.abort();
    };
  }, []);

  // Resize drag handler
  const startResize = (clientX: number, clientY: number, direction: "nw" | "n" | "w") => {
    cleanupResizeRef.current?.();
    setIsResizing(true);
    const startX = clientX;
    const startY = clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const handleMove = (currentX: number, currentY: number) => {
      const deltaX = startX - currentX; // dragging left increases width
      const deltaY = startY - currentY; // dragging up increases height

      const maxW = typeof window !== "undefined" ? Math.min(window.innerWidth - 32, 900) : 800;
      const maxH = typeof window !== "undefined" ? Math.min(window.innerHeight - 48, 900) : 800;

      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction === "nw" || direction === "w") {
        newWidth = Math.max(340, Math.min(maxW, startWidth + deltaX));
      }
      if (direction === "nw" || direction === "n") {
        newHeight = Math.max(420, Math.min(maxH, startHeight + deltaY));
      }

      setSize({ width: newWidth, height: newHeight });
      setIsMaximized(false);
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    const stopResize = () => {
      setIsResizing(false);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stopResize);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", stopResize);
      cleanupResizeRef.current = null;
    };

    cleanupResizeRef.current = stopResize;

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stopResize);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", stopResize);
  };

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom(false);
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "bot",
        text: "Chat cleared. What placement or game question can I help you with?",
        timestamp: "Just now",
        suggestions: STARTER_QUESTIONS.slice(0, 3),
      },
    ]);
  };

  const handleOptimizePrompt = async () => {
    const raw = input.trim();
    if (!raw || isOptimizing) return;

    setIsOptimizing(true);
    try {
      const res = await fetch("/api/chat/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: raw }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.optimizedPrompt) {
          setInput(data.optimizedPrompt);
        }
      }
    } catch (err) {
      console.error("Optimize failed:", err);
    } finally {
      setIsOptimizing(false);
      inputRef.current?.focus();
    }
  };

  const handleSend = async (queryToSend?: string) => {
    const messageText = (queryToSend || input).trim();
    if (!messageText || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const botMsgId = `bot-${Date.now() + 1}`;

    const userMessage: ChatMessage = {
      id: userMsgId,
      role: "user",
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const tempBotMessage: ChatMessage = {
      id: botMsgId,
      role: "bot",
      text: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMessage, tempBotMessage]);
    setInput("");
    setIsLoading(true);

    try {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const history = messages.slice(-6).map((m) => ({
        role: m.role === "user" ? ("user" as const) : ("assistant" as const),
        text: m.text,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          message: messageText,
          history,
        }),
      });

      if (!response.ok) {
        let serverError = "";
        try {
          const errData = await response.json();
          serverError = errData.error;
        } catch {
          // ignore
        }
        throw new Error(serverError || `Chat error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No reader available");

      let accumulated = "";
      let searchedWeb = false;
      let finalSuggestions: string[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;

          try {
            const data = JSON.parse(trimmed.slice(6));

            if (data.searchedWeb) {
              searchedWeb = true;
            }

            if (data.text) {
              accumulated += data.text;
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === botMsgId
                    ? { ...msg, text: accumulated, isStreaming: true, searchedWeb }
                    : msg
                )
              );
            }

            if (data.done) {
              finalSuggestions = data.suggestions || [];
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === botMsgId
                    ? {
                        ...msg,
                        text: accumulated,
                        isStreaming: false,
                        searchedWeb,
                        suggestions: finalSuggestions,
                      }
                    : msg
                )
              );
            }
          } catch {
            // Ignore incomplete frames
          }
        }
      }
    } catch (error: any) {
      if (error?.name === "AbortError") {
        return;
      }
      console.error("Chat error:", error);
      const friendlyError = error?.message?.startsWith("Chat error:")
        ? "BlyncBot is momentarily busy. Please try asking again in a few seconds."
        : error?.message || "Unable to reach the assistant right now. Please check your connection or try again.";

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMsgId
            ? {
                ...msg,
                text: `⚠️ **${friendlyError}**\n\nYou can also read our complete [Placement Game Guides & Rules](/rules) or practice directly at [/games/cognitive](/games/cognitive).`,
                isStreaming: false,
                suggestions: [
                  "How does the Capgemini Game Round work?",
                  "What is included in Blync Pro (₹49)?",
                  "Switch Challenge winning tips",
                ],
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* ─── MINIMAL FLOATING BUBBLE BUTTON ─── */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Assistant"
            className="group relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700/80 shadow-lg shadow-black/40 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none"
          >
            {/* Minimal Bot/Message Icon */}
            <MessageSquare className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-zinc-200 group-hover:text-white transition-colors" />

            {/* Subtle Tooltip */}
            <div className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 hidden sm:group-hover:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 shadow-md whitespace-nowrap pointer-events-none">
              <span>Blync AI</span>
            </div>
          </button>
        )}
      </div>

      {/* ─── RESIZABLE MINIMAL CHAT MODAL ─── */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Blync AI Chat Window"
          data-lenis-prevent
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          style={
            isMaximized
              ? { width: "min(92vw, 840px)", height: "min(88vh, 850px)" }
              : {
                  width: `min(calc(100vw - 32px), ${size.width}px)`,
                  height: `min(calc(100vh - 48px), ${size.height}px)`,
                }
          }
          className={cn(
            "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden overscroll-contain animate-in fade-in slide-in-from-bottom-3 duration-150 transition-[width,height] ease-out",
            isResizing && "select-none transition-none"
          )}
        >
          {/* ─── RESIZE HANDLES ─── */}
          {/* Top-Left Corner Drag Handle */}
          <div
            onMouseDown={(e) => startResize(e.clientX, e.clientY, "nw")}
            onTouchStart={(e) => e.touches[0] && startResize(e.touches[0].clientX, e.touches[0].clientY, "nw")}
            title="Drag to resize"
            className="absolute top-0 left-0 w-6 h-6 cursor-nwse-resize z-30 flex items-center justify-center group"
          >
            <div className="w-2.5 h-2.5 border-t-2 border-l-2 border-zinc-600 group-hover:border-zinc-300 transition-colors rounded-tl-sm" />
          </div>

          {/* Top Edge Drag Bar */}
          <div
            onMouseDown={(e) => startResize(e.clientX, e.clientY, "n")}
            onTouchStart={(e) => e.touches[0] && startResize(e.touches[0].clientX, e.touches[0].clientY, "n")}
            title="Drag to resize height"
            className="absolute top-0 left-6 right-20 h-2 cursor-ns-resize z-20 hover:bg-zinc-700/20"
          />

          {/* Left Edge Drag Bar */}
          <div
            onMouseDown={(e) => startResize(e.clientX, e.clientY, "w")}
            onTouchStart={(e) => e.touches[0] && startResize(e.touches[0].clientX, e.touches[0].clientY, "w")}
            title="Drag to resize width"
            className="absolute top-6 bottom-4 left-0 w-2 cursor-ew-resize z-20 hover:bg-zinc-700/20"
          />

          {/* ─── HEADER ─── */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/40">
            <div className="flex items-center gap-2.5 pl-2">
              <div className="relative flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <div className="absolute w-4 h-4 rounded-full bg-emerald-500/20 animate-ping" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-semibold text-zinc-100 tracking-tight">
                    Blync AI
                  </h3>
                  {user?.isPro ? (
                    <span className="text-[10px] font-semibold text-amber-400 px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/30">
                      PRO MENTOR
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20">
                      Online
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-400">
                  {user?.name ? `Personalized for ${user.name.split(" ")[0]}` : "Placement & Games Guide"}
                </p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                title="Clear chat"
                className="p-1.5 text-zinc-400 hover:text-zinc-100 rounded-md hover:bg-zinc-800 transition-colors"
                aria-label="Clear chat"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                title={isMaximized ? "Restore size" : "Maximize"}
                className="p-1.5 text-zinc-400 hover:text-zinc-100 rounded-md hover:bg-zinc-800 transition-colors hidden sm:block"
                aria-label={isMaximized ? "Restore size" : "Maximize"}
              >
                {isMaximized ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 text-zinc-400 hover:text-zinc-100 rounded-md hover:bg-zinc-800 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ─── MESSAGES BODY ─── */}
          <div
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-3.5 text-xs sm:text-sm scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex flex-col gap-1 max-w-[88%]",
                  msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                )}
              >
                {/* Message Bubble */}
                <div
                  className={cn(
                    "relative px-3.5 py-2.5 rounded-xl leading-relaxed text-xs sm:text-sm",
                    msg.role === "user"
                      ? "bg-zinc-800 text-zinc-100 border border-zinc-700/60 rounded-tr-sm"
                      : "bg-zinc-900/90 text-zinc-200 border border-zinc-800 rounded-tl-sm"
                  )}
                >
                  {/* Web search tag if applicable */}
                  {msg.searchedWeb && (
                    <div className="flex items-center gap-1 text-[10px] text-zinc-400 mb-1.5 font-medium bg-zinc-800/80 border border-zinc-700/60 px-1.5 py-0.5 rounded w-fit">
                      <Globe className="w-3 h-3 text-zinc-400" />
                      <span>Web verified</span>
                    </div>
                  )}

                  {/* Markdown content */}
                  <div className="prose prose-invert prose-xs sm:prose-sm max-w-none text-zinc-200 break-words font-sans space-y-1.5 [&_p]:my-0.5 [&_ul]:my-1 [&_ul]:pl-4 [&_li]:my-0.5 [&_strong]:text-zinc-100 [&_code]:bg-zinc-950 [&_code]:border [&_code]:border-zinc-800 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-zinc-300">
                    <ReactMarkdown
                      components={{
                        a: (props: any) => (
                          <a
                            {...props}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-100 underline underline-offset-2 hover:text-white font-medium"
                          />
                        ),
                      } as any}
                    >
                      {msg.text || (msg.isStreaming ? "Thinking..." : "")}
                    </ReactMarkdown>

                    {msg.isStreaming && (
                      <span className="inline-block w-1.5 h-3.5 ml-1 bg-zinc-400 animate-pulse align-middle" />
                    )}
                  </div>

                  {/* Copy action */}
                  {msg.role === "bot" && !msg.isStreaming && msg.text && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="absolute top-2 right-2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>

                {/* Timestamp */}
                <span className="text-[10px] text-zinc-500 px-1">
                  {msg.timestamp}
                </span>

                {/* Contextual Suggestions Chips */}
                {msg.role === "bot" &&
                  !msg.isStreaming &&
                  msg.suggestions &&
                  msg.suggestions.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {msg.suggestions.map((sug, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(sug)}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 border border-zinc-800 hover:border-zinc-700 transition-colors text-left"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* ─── INITIAL QUICK QUESTIONS ─── */}
          {messages.length === 1 && !isLoading && (
            <div
              data-lenis-prevent
              onWheel={(e) => e.stopPropagation()}
              className="px-3.5 py-2 border-t border-zinc-850 bg-zinc-900/20"
            >
              <p className="text-[10px] text-zinc-400 mb-1.5 font-medium">
                Suggested questions:
              </p>
              <div className="flex flex-wrap gap-1">
                {STARTER_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 border border-zinc-800 hover:border-zinc-700 transition-colors text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ─── MINIMAL FOOTER & INPUT BAR ─── */}
          <div className="p-3 border-t border-zinc-800 bg-zinc-950">
            <div className="flex flex-col rounded-xl bg-zinc-900/90 border border-zinc-800 focus-within:border-zinc-700 transition-colors p-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Capgemini games, test patterns, or Blync..."
                rows={2}
                disabled={isLoading}
                className="w-full bg-transparent text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none scrollbar-none leading-relaxed"
              />

              {/* Minimal Action Bar */}
              <div className="flex items-center justify-between pt-1.5 border-t border-zinc-800/80 mt-1">
                {/* Minimal Optimize Button */}
                <button
                  type="button"
                  onClick={handleOptimizePrompt}
                  disabled={!input.trim() || isOptimizing || isLoading}
                  title="Refine question for precise placement answer"
                  className={cn(
                    "flex items-center gap-1 text-xs px-2 py-0.5 rounded-md transition-colors font-medium",
                    input.trim()
                      ? "text-zinc-200 bg-zinc-800 hover:bg-zinc-750 hover:text-white border border-zinc-700/80"
                      : "text-zinc-500 bg-zinc-900/50 cursor-not-allowed border border-transparent"
                  )}
                >
                  <Sparkles
                    className={cn(
                      "w-3 h-3 text-zinc-300",
                      isOptimizing && "animate-spin"
                    )}
                  />
                  <span>{isOptimizing ? "Refining..." : "Optimize"}</span>
                </button>

                {/* Pricing link & Send */}
                <div className="flex items-center gap-2">
                  <Link
                    href="/pricing"
                    className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Pro ₹49</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isLoading}
                    className={cn(
                      "flex items-center justify-center w-7 h-7 rounded-lg transition-colors",
                      input.trim() && !isLoading
                        ? "bg-zinc-100 text-zinc-900 hover:bg-white"
                        : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    )}
                    aria-label="Send message"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Micro disclaimer */}
            <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-1.5 px-0.5">
              <span>Blync placement intelligence</span>
              <span>Accurate & grounded</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
