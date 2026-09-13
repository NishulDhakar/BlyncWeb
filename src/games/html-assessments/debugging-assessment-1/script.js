"use strict";
// ===== Data =====
const QUESTIONS = [{ "id": 1, "title": "Fix the BST Search Logic", "concept": "Binary Search Tree", "difficulty": "HARD", "statement": "A binary search tree stores distinct integer keys. The supplied function should return true when a target key exists in the tree and false otherwise. The implementation contains one or more logic errors.", "task": "Review the supplied implementation, identify the traversal/comparison errors, fix only the faulty logic, and validate it against the test cases.", "constraints": "1 \u2264 number of nodes \u2264 10^5; keys are distinct; values fit in 32-bit signed integers.", "tests": [["Tree: 8, 3, 10, 1, 6, 14, 4, 7, 13 | target = 7", "true"], ["Tree: 8, 3, 10, 1, 6, 14, 4, 7, 13 | target = 9", "false"]], "code": "#include <bits/stdc++.h>\nusing namespace std;\n\nstruct Node {\n    int val;\n    Node *left, *right;\n    Node(int x) : val(x), left(nullptr), right(nullptr) {}\n};\n\nbool searchBST(Node* root, int target) {\n    if (root == nullptr) return false;\n    if (root->val == target) return true;\n\n    if (target < root->val)\n        return searchBST(root->right, target); // BUG\n    return searchBST(root->left, target);      // BUG\n}\n\nint main() {\n    Node* root = new Node(8);\n    root->left = new Node(3);\n    root->right = new Node(10);\n    root->left->left = new Node(1);\n    root->left->right = new Node(6);\n    root->left->right->left = new Node(4);\n    root->left->right->right = new Node(7);\n    root->right->right = new Node(14);\n    root->right->right->left = new Node(13);\n\n    cout << boolalpha << searchBST(root, 7);\n}" }, { "id": 2, "title": "Debug Graph BFS Traversal", "concept": "Graph + BFS", "difficulty": "HARD", "statement": "Given an undirected graph, the function must perform BFS from a source vertex and count how many vertices are reachable. The starter implementation contains traversal-state errors.", "task": "Find and fix the bug(s) affecting queue processing and visited-state handling without replacing the algorithm with a different approach.", "constraints": "1 \u2264 V \u2264 10^5; 0 \u2264 E \u2264 2\u00d710^5; vertices are numbered 0 to V-1.", "tests": [["V=6, edges=(0,1),(0,2),(1,3),(2,4),(4,5), source=0", "6"], ["V=5, edges=(0,1),(1,2),(3,4), source=0", "3"]], "code": "#include <bits/stdc++.h>\nusing namespace std;\n\nint reachableCount(int V, vector<vector<int>>& adj, int src) {\n    vector<int> visited(V, 0);\n    queue<int> q;\n    q.push(src);\n\n    int count = 0;\n\n    while (!q.empty()) {\n        int u = q.front();\n        q.pop();\n\n        for (int v : adj[u]) {\n            if (!visited[v]) {\n                q.push(v);\n                visited[v] = 0; // BUG\n            }\n        }\n        count++;\n    }\n    return count;\n}\n\nint main() {\n    int V = 6;\n    vector<vector<int>> adj(V);\n    auto addEdge = [&](int a, int b) {\n        adj[a].push_back(b);\n        adj[b].push_back(a);\n    };\n\n    addEdge(0,1); addEdge(0,2); addEdge(1,3);\n    addEdge(2,4); addEdge(4,5);\n\n    cout << reachableCount(V, adj, 0);\n}" }, { "id": 3, "title": "Fix the Grid Path DP", "concept": "2D Dynamic Programming", "difficulty": "HARD", "statement": "A robot starts at the top-left of a grid and can move only right or down. Cells marked 1 are blocked. Return the number of valid paths to the bottom-right cell.", "task": "Debug the existing 2D DP implementation. Correct its initialization and boundary/blocked-cell handling while keeping the O(R\u00d7C) approach.", "constraints": "1 \u2264 rows, cols \u2264 500; grid values are 0 (open) or 1 (blocked).", "tests": [["grid = [[0,0,0],[0,1,0],[0,0,0]]", "2"], ["grid = [[0,1],[0,0]]", "1"]], "code": "#include <bits/stdc++.h>\nusing namespace std;\n\nlong long countPaths(vector<vector<int>>& grid) {\n    int r = grid.size(), c = grid[0].size();\n    vector<vector<long long>> dp(r, vector<long long>(c, 0));\n\n    dp[0][0] = 1;\n\n    for (int i = 0; i < r; ++i) {\n        for (int j = 0; j < c; ++j) {\n            if (grid[i][j] == 1) {\n                dp[i][j] = 1; // BUG\n                continue;\n            }\n\n            if (i > 0) dp[i][j] += dp[i-1][j];\n            if (j > 0) dp[i][j] += dp[i][j-1];\n        }\n    }\n    return dp[r-1][c-1];\n}\n\nint main() {\n    vector<vector<int>> grid = {\n        {0,0,0},\n        {0,1,0},\n        {0,0,0}\n    };\n    cout << countPaths(grid);\n}" }, { "id": 4, "title": "Debug Range Query Logic", "concept": "Prefix Sum + Arrays", "difficulty": "MEDIUM-HARD", "statement": "Given an integer array and multiple inclusive range queries [L,R], return the sum for every query using prefix sums. The starter code has an indexing error.", "task": "Fix the prefix construction/query boundary logic. Do not replace the prefix-sum approach with O(N) work per query.", "constraints": "1 \u2264 N,Q \u2264 2\u00d710^5; -10^9 \u2264 A[i] \u2264 10^9; 0 \u2264 L \u2264 R < N.", "tests": [["A=[2,4,1,7,3], query=[1,3]", "12"], ["A=[5,-2,6,1], query=[0,2]", "9"]], "code": "#include <bits/stdc++.h>\nusing namespace std;\n\nlong long rangeSum(vector<int>& a, int L, int R) {\n    int n = a.size();\n    vector<long long> pref(n, 0);\n\n    pref[0] = a[0];\n    for (int i = 1; i < n; ++i)\n        pref[i] = pref[i-1] + a[i];\n\n    if (L == 0) return pref[R];\n    return pref[R] - pref[L]; // BUG\n}\n\nint main() {\n    vector<int> a = {2,4,1,7,3};\n    cout << rangeSum(a, 1, 3);\n}" }, { "id": 5, "title": "Fix Shortest Path Implementation", "concept": "Graph + Priority Queue", "difficulty": "HARD", "statement": "Given a weighted graph with non-negative edge weights, compute the shortest distance from a source to a destination using Dijkstra's algorithm. The supplied implementation contains a relaxation/priority-queue bug.", "task": "Identify and fix the incorrect distance-update or stale-state logic. Preserve Dijkstra's priority-queue approach.", "constraints": "1 \u2264 V \u2264 10^5; 0 \u2264 E \u2264 2\u00d710^5; edge weights are non-negative.", "tests": [["Edges: 0-1(4), 0-2(1), 2-1(2), 1-3(1), 2-3(5); 0\u21923", "4"], ["Edges: 0-1(7), 0-2(2), 2-1(1), 1-3(3); 0\u21923", "6"]], "code": "#include <bits/stdc++.h>\nusing namespace std;\n\nint shortestPath(int V, vector<vector<pair<int,int>>>& adj, int src, int dest) {\n    const int INF = 1e9;\n    vector<int> dist(V, INF);\n    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;\n\n    dist[src] = 0;\n    pq.push({0, src});\n\n    while (!pq.empty()) {\n        auto [d, u] = pq.top();\n        pq.pop();\n\n        if (d != dist[u]) continue;\n\n        for (auto [v, w] : adj[u]) {\n            if (d + w < dist[v]) {\n                dist[v] = d; // BUG\n                pq.push({dist[v], v});\n            }\n        }\n    }\n    return dist[dest] == INF ? -1 : dist[dest];\n}\n\nint main() {\n    int V = 4;\n    vector<vector<pair<int,int>>> adj(V);\n    auto add = [&](int u,int v,int w) {\n        adj[u].push_back({v,w});\n        adj[v].push_back({u,w});\n    };\n\n    add(0,1,4); add(0,2,1); add(2,1,2);\n    add(1,3,1); add(2,3,5);\n\n    cout << shortestPath(V, adj, 0, 3);\n}" }];
const TOTAL = QUESTIONS.length;
const LIMIT = 20 * 60;
const SUBMIT_CHECKS = [
    /target\s*<\s*root->val[\s\S]*return\s*searchBST\(root->left/,
    /visited\[v\]\s*=\s*1/,
    /grid\[i\]\[j\]\s*==\s*1[\s\S]*dp\[i\]\[j\]\s*=\s*0/,
    /pref\[R\]\s*-\s*pref\[L-1\]/,
    /dist\[v\]\s*=\s*d\s*\+\s*w/
];
const EXT_BY_LANG = { 'C': 'c', 'C++': 'cpp', 'Java': 'java', 'Python': 'py' };
// ===== Mutable app state =====
let active = 0;
let remaining = Array(TOTAL).fill(LIMIT);
let started = Array(TOTAL).fill(false);
let expired = Array(TOTAL).fill(false);
let solved = Array(TOTAL).fill(false);
let manualLocked = Array(TOTAL).fill(false);
let codes = QUESTIONS.map(q => q.code);
let lastTick = Date.now();
// ===== DOM helpers =====
function $(id) {
    const el = document.getElementById(id);
    if (!el)
        throw new Error(`Element #${id} not found`);
    return el;
}
function $input(id) { return $(id); }
function $textarea(id) { return $(id); }
function $select(id) { return $(id); }
function $button(id) { return $(id); }
function fmt(s) {
    s = Math.max(0, Math.floor(s));
    return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
}
function startQuestion(i) {
    if (manualLocked[i] || solved[i])
        return;
    active = i;
    started[i] = true;
    lastTick = Date.now();
    render();
}
function toggleQuestionLock(i) {
    manualLocked[i] = !manualLocked[i];
    if (manualLocked[i]) {
        started[i] = false;
    }
    else {
        // Unlock = fresh 20-minute attempt.
        remaining[i] = LIMIT;
        expired[i] = false;
        started[i] = false;
    }
    saveState();
    if (active === i)
        render();
    else
        renderNav();
}
setInterval(() => {
    if (!started[active] || manualLocked[active] || expired[active] || solved[active])
        return;
    const now = Date.now();
    const delta = Math.floor((now - lastTick) / 1000);
    if (delta > 0) {
        remaining[active] -= delta;
        lastTick += delta * 1000;
        if (remaining[active] <= 0) {
            // Time over: reset this question to 20:00 and lock it.
            remaining[active] = LIMIT;
            started[active] = false;
            manualLocked[active] = true;
            expired[active] = false;
        }
        renderTimer();
        renderNav();
        saveState();
    }
}, 250);
function renderTimer() {
    const t = $("timer");
    const strong = t.querySelector("strong");
    if (strong)
        strong.textContent = fmt(remaining[active]);
    t.classList.toggle("warning", remaining[active] <= 300 && remaining[active] > 60);
    t.classList.toggle("danger", remaining[active] <= 60);
}
function renderNav() {
    $("qnav").innerHTML = QUESTIONS.map((q, i) => {
        const locked = manualLocked[i];
        const status = solved[i] ? "SOLVED" : locked ? "LOCKED" : i === active ? "ACTIVE" : "READY";
        const icon = locked ? "\uD83D\uDD12" : "\uD83D\uDD13";
        return `<div class="qrow"><button type="button" class="qbtn ${i === active ? 'active ' : ''}${solved[i] ? 'done ' : ''}${locked ? 'locked' : ''}" data-i="${i}"><span class="qnum">${String(i + 1).padStart(2, '0')}</span><span><b>${q.title}</b><span class="qmeta">${q.concept}</span></span><span class="status">${status}</span></button><button type="button" class="lockbtn ${locked ? 'is-locked' : 'is-unlocked'}" data-lock="${i}" title="${locked ? 'Unlock question' : 'Lock question'}">${icon}</button></div>`;
    }).join('');
    document.querySelectorAll('.qbtn').forEach(b => {
        b.addEventListener('click', () => startQuestion(Number(b.dataset.i)));
    });
    document.querySelectorAll('.lockbtn').forEach(b => {
        b.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleQuestionLock(Number(b.dataset.lock));
        });
    });
    const done = solved.filter(Boolean).length;
    $("progText").textContent = `${done} / ${TOTAL}`;
    $("progBar").style.width = `${Math.round(done / TOTAL * 100)}%`;
}
function render() {
    const q = QUESTIONS[active];
    $("qtag").textContent = `QUESTION ${String(active + 1).padStart(2, '0')}`;
    $("title").textContent = q.title;
    $("difficulty").textContent = q.difficulty;
    $("statement").textContent = q.statement;
    $("task").textContent = q.task;
    $("constraints").textContent = q.constraints;
    $("tests").innerHTML = q.tests.map((t, i) => `<div class="test"><b>TEST ${i + 1}</b><br>${t[0]}<br><span style="color:#7d8b9e">Expected:</span> ${t[1]}</div>`).join('');
    const lang = $select("language").value;
    $("filename").textContent = `challenge${active + 1}.${EXT_BY_LANG[lang] || 'cpp'}`;
    $textarea("code").value = codes[active];
    const locked = manualLocked[active] || solved[active];
    $textarea("code").disabled = locked;
    $button("submit").disabled = locked;
    $button("run").disabled = locked;
    $button("prev").disabled = active === 0;
    updateLines();
    renderTimer();
    renderNav();
    $("stateText").textContent = manualLocked[active]
        ? "QUESTION LOCKED \u2022 UNLOCK TO START"
        : solved[active] ? "SOLUTION ACCEPTED" : "IN PROGRESS";
}
function updateLines() {
    const n = $textarea("code").value.split('\n').length;
    $("lines").textContent = Array.from({ length: n }, (_, i) => String(i + 1)).join('\n');
}
$textarea("code").addEventListener('input', () => {
    codes[active] = $textarea("code").value;
    updateLines();
    saveState();
});
$textarea("code").addEventListener('scroll', () => {
    $("lines").scrollTop = $textarea("code").scrollTop;
});
function runCode() {
    if (manualLocked[active] || solved[active])
        return;
    const code = $textarea("code").value;
    const out = $("output");
    out.className = "output show";
    const normalized = code.replace(/\s+/g, ' ');
    const ok = !!SUBMIT_CHECKS[active] && SUBMIT_CHECKS[active].test(normalized);
    out.innerHTML = ok
        ? '<span class="ok">TEST RUN COMPLETE</span><br>Sample cases: <span class="ok">PASSED</span><br><span class="info">The submitted logic matches the simulator\'s validation rule.</span>'
        : '<span class="err">TEST RUN COMPLETE</span><br>Sample cases: <span class="err">FAILED</span><br><span class="info">Review the implementation and validate the faulty logic.</span>';
}
$("run").addEventListener('click', runCode);
function showSubmissionResult(passed) {
    const q = QUESTIONS[active];
    const total = q.tests.length;
    const passedCount = passed ? total : 0;
    $("resultTitle").textContent = passed ? 'Accepted' : 'Wrong Answer';
    $("resultTitle").style.color = passed ? 'var(--green)' : 'var(--danger)';
    $("resultSummary").textContent = `${passedCount} / ${total} test cases passed`;
    $("resultTests").innerHTML = q.tests.map((t, i) => {
        const tp = passed;
        return `<div class="test"><b>TEST ${i + 1}</b> <span style="float:right" class="${tp ? 'ok' : 'err'}">${tp ? 'PASSED' : 'FAILED'}</span><br>${t[0]}<br><span style="color:#7d8b9e">Expected:</span> ${t[1]}</div>`;
    }).join('');
    const isLast = active === TOTAL - 1;
    $button("resultClose").textContent = passed ? (isLast ? 'Continue' : 'Continue to Next') : 'Try Again';
    $("resultModal").dataset.passed = passed ? '1' : '0';
    $("resultModal").classList.add('show');
}
$("submit").addEventListener('click', () => {
    if (manualLocked[active] || solved[active])
        return;
    const code = $textarea("code").value.replace(/\s+/g, ' ');
    const passed = SUBMIT_CHECKS[active].test(code);
    codes[active] = $textarea("code").value;
    saveState();
    showSubmissionResult(passed);
});
$("resultClose").addEventListener('click', () => {
    const passed = $("resultModal").dataset.passed === '1';
    $("resultModal").classList.remove('show');
    if (!passed)
        return;
    solved[active] = true;
    saveState();
    if (active < TOTAL - 1) {
        startQuestion(active + 1);
    }
    else {
        $("solvedStat").textContent = String(solved.filter(Boolean).length);
        $("unsolvedStat").textContent = String(TOTAL - solved.filter(Boolean).length - expired.filter(Boolean).length);
        $("expiredStat").textContent = String(expired.filter(Boolean).length);
        $("modal").classList.add('show');
    }
});
$("prev").addEventListener('click', () => {
    if (active > 0 && !manualLocked[active - 1])
        startQuestion(active - 1);
});
$select("language").addEventListener('change', () => {
    const lang = $select("language").value;
    $("filename").textContent = `challenge${active + 1}.${EXT_BY_LANG[lang] || 'cpp'}`;
});
$("cancel").addEventListener('click', () => $("modal").classList.remove('show'));
$("final").addEventListener('click', () => {
    $("modal").classList.remove('show');
    document.querySelectorAll('button').forEach(b => b.disabled = true);
    $textarea("code").disabled = true;
    $("title").textContent = 'Assessment Submitted';
    $("qtag").textContent = 'COMPLETED';
    $("difficulty").textContent = 'FINAL';
    $("statement").textContent = 'Your Campusmonk debugging assessment has been submitted.';
    $("task").textContent = `Solved: ${solved.filter(Boolean).length} / ${TOTAL} \u2022 Expired: ${expired.filter(Boolean).length} \u2022 Unsolved: ${TOTAL - solved.filter(Boolean).length - expired.filter(Boolean).length}`;
    $("constraints").textContent = 'Assessment locked after final submission.';
    $("tests").innerHTML = '';
    $("stateText").textContent = 'ASSESSMENT SUBMITTED';
    localStorage.removeItem('cm_debug_state_native');
});
function saveState() {
    try {
        const state = { active, remaining, started, expired, solved, codes, manualLocked };
        localStorage.setItem('cm_debug_state_native', JSON.stringify(state));
    }
    catch (e) { /* ignore quota/availability errors */ }
}
function restore() {
    var _a, _b, _c, _d, _e, _f;
    try {
        const raw = localStorage.getItem('cm_debug_state_native');
        if (!raw)
            return;
        const s = JSON.parse(raw);
        if (!s)
            return;
        active = (_a = s.active) !== null && _a !== void 0 ? _a : 0;
        remaining = (_b = s.remaining) !== null && _b !== void 0 ? _b : remaining;
        started = (_c = s.started) !== null && _c !== void 0 ? _c : started;
        expired = (_d = s.expired) !== null && _d !== void 0 ? _d : expired;
        solved = (_e = s.solved) !== null && _e !== void 0 ? _e : solved;
        codes = (_f = s.codes) !== null && _f !== void 0 ? _f : codes;
        manualLocked = Array.isArray(s.manualLocked) ? s.manualLocked : Array(TOTAL).fill(false);
    }
    catch (e) { /* ignore corrupt state */ }
}
restore();
if (!manualLocked[active] && !solved[active]) {
    started[active] = true;
    lastTick = Date.now();
}
render();
