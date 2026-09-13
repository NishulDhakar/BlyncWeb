"use strict";
// ===== Data =====
const QUESTIONS = [{ "id": 1, "title": "Fix the Linked List Reversal", "concept": "Linked List", "difficulty": "HARD", "statement": "Given the head of a singly linked list, the function should reverse the list in place and return the new head. The supplied implementation loses the rest of the list because pointers are reassigned in the wrong order.", "task": "Review the supplied implementation, identify the pointer-reassignment error, fix only the faulty logic, and validate it against the test cases.", "constraints": "0 \u2264 number of nodes \u2264 10^5; node values fit in 32-bit signed integers.", "tests": [["List: 1 -> 2 -> 3 -> 4 -> 5", "5 4 3 2 1"], ["List: 10 -> 20", "20 10"]], "code": "#include <bits/stdc++.h>\nusing namespace std;\n\nstruct Node {\n    int val;\n    Node *next;\n    Node(int x) : val(x), next(nullptr) {}\n};\n\nNode* reverseList(Node* head) {\n    Node* prev = nullptr;\n    Node* curr = head;\n\n    while (curr != nullptr) {\n        curr->next = prev;   // BUG: overwrites curr->next before it is saved\n        prev = curr;\n        curr = curr->next;   // BUG: curr->next now points to prev, not the original next node\n    }\n    return prev;\n}\n\nvoid printList(Node* head) {\n    while (head) { cout << head->val << (head->next ? \" \" : \"\"); head = head->next; }\n}\n\nint main() {\n    Node* head = new Node(1);\n    head->next = new Node(2);\n    head->next->next = new Node(3);\n    head->next->next->next = new Node(4);\n    head->next->next->next->next = new Node(5);\n\n    Node* reversed = reverseList(head);\n    printList(reversed);\n}\n" }, { "id": 2, "title": "Debug the Balanced Parentheses Checker", "concept": "Stack", "difficulty": "MEDIUM-HARD", "statement": "Given a string containing only the characters ( ) [ ] { }, determine whether the brackets are balanced using a stack. The starter implementation always reports the string as balanced, even when brackets are left unmatched.", "task": "Find and fix the bug in the final validation step so the function correctly rejects strings with unmatched opening brackets.", "constraints": "0 \u2264 string length \u2264 10^5; the string contains only the characters ( ) [ ] { }.", "tests": [["s = {[()]}", "true"], ["s = (()", "false"], ["s = ]", "false"]], "code": "#include <bits/stdc++.h>\nusing namespace std;\n\nbool isBalanced(string s) {\n    stack<char> st;\n\n    for (char c : s) {\n        if (c == '(' || c == '[' || c == '{') {\n            st.push(c);\n        } else {\n            if (st.empty()) return false;\n            char top = st.top();\n            st.pop();\n            if (c == ')' && top != '(') return false;\n            if (c == ']' && top != '[') return false;\n            if (c == '}' && top != '{') return false;\n        }\n    }\n\n    return true; // BUG: ignores any brackets left unclosed on the stack\n}\n\nint main() {\n    cout << boolalpha << isBalanced(\"{[()]}\");\n}\n" }, { "id": 3, "title": "Fix Kadane's Maximum Subarray Sum", "concept": "Dynamic Programming (Kadane's Algorithm)", "difficulty": "HARD", "statement": "Given an integer array, return the sum of the contiguous subarray with the largest sum. The supplied implementation never extends the running sum with the current element, so it produces an incorrect maximum whenever extending the subarray would help.", "task": "Review the running-sum update inside the loop, fix the faulty logic, and validate it against the test cases.", "constraints": "1 \u2264 array length \u2264 10^5; -10^4 \u2264 A[i] \u2264 10^4.", "tests": [["A=[-2,1,-3,4,-1,2,1,-5,4]", "6"], ["A=[5,4,-1,7,8]", "23"]], "code": "#include <bits/stdc++.h>\nusing namespace std;\n\nint maxSubArray(vector<int>& nums) {\n    int maxSum = nums[0];\n    int curSum = nums[0];\n\n    for (int i = 1; i < (int)nums.size(); ++i) {\n        curSum = max(nums[i], curSum); // BUG: should extend the running sum with nums[i]\n        maxSum = max(maxSum, curSum);\n    }\n    return maxSum;\n}\n\nint main() {\n    vector<int> nums = {-2,1,-3,4,-1,2,1,-5,4};\n    cout << maxSubArray(nums);\n}\n" }, { "id": 4, "title": "Debug Merge Overlapping Intervals", "concept": "Arrays / Intervals", "difficulty": "HARD", "statement": "Given a list of intervals, merge all overlapping intervals and return how many intervals remain after merging. The starter implementation overwrites the end of the merged interval instead of extending it, so a shorter interval nested inside a longer one incorrectly shrinks the merged range.", "task": "Fix the merge step so the merged interval's end is always the maximum of the overlapping ends, then validate against the test cases.", "constraints": "1 \u2264 number of intervals \u2264 10^5; 0 \u2264 start \u2264 end \u2264 10^9.", "tests": [["intervals = [[1,3],[2,6],[8,10],[15,18]]", "3"], ["intervals = [[1,10],[2,3],[4,5]]", "1"]], "code": "#include <bits/stdc++.h>\nusing namespace std;\n\nint mergeIntervals(vector<vector<int>> intervals) {\n    sort(intervals.begin(), intervals.end());\n    vector<vector<int>> merged;\n\n    for (auto& iv : intervals) {\n        if (!merged.empty() && iv[0] <= merged.back()[1]) {\n            merged.back()[1] = iv[1]; // BUG: should be max(merged.back()[1], iv[1])\n        } else {\n            merged.push_back(iv);\n        }\n    }\n    return (int)merged.size();\n}\n\nint main() {\n    vector<vector<int>> intervals = {{1,3},{2,6},{8,10},{15,18}};\n    cout << mergeIntervals(intervals);\n}\n" }, { "id": 5, "title": "Fix Search in Rotated Sorted Array", "concept": "Binary Search", "difficulty": "HARD", "statement": "Given a rotated sorted array of distinct integers and a target value, return the index of the target, or -1 if it does not exist, using O(log N) binary search. The supplied implementation narrows the search space toward the wrong half when the target lies within the sorted left half.", "task": "Fix the branch that should shrink the search space toward the sorted left half without changing the overall binary-search approach.", "constraints": "1 \u2264 array length \u2264 10^5; all elements are distinct; -10^9 \u2264 nums[i], target \u2264 10^9.", "tests": [["nums=[4,5,6,7,0,1,2], target=0", "4"], ["nums=[4,5,6,7,0,1,2], target=3", "-1"]], "code": "#include <bits/stdc++.h>\nusing namespace std;\n\nint search(vector<int>& nums, int target) {\n    int lo = 0, hi = (int)nums.size() - 1;\n\n    while (lo <= hi) {\n        int mid = (lo + hi) / 2;\n        if (nums[mid] == target) return mid;\n\n        if (nums[lo] <= nums[mid]) {\n            if (nums[lo] <= target && target < nums[mid])\n                lo = mid + 1;      // BUG: target is in the sorted left half, should shrink toward it\n            else\n                lo = mid + 1;\n        } else {\n            if (nums[mid] < target && target <= nums[hi])\n                lo = mid + 1;\n            else\n                hi = mid - 1;\n        }\n    }\n    return -1;\n}\n\nint main() {\n    vector<int> nums = {4,5,6,7,0,1,2};\n    cout << search(nums, 0);\n}\n" }];
const TOTAL = QUESTIONS.length;
const LIMIT = 20 * 60;
const SUBMIT_CHECKS = [
    /Node\s*\*\s*next\s*=\s*curr->next[\s\S]*curr->next\s*=\s*prev[\s\S]*curr\s*=\s*next/,
    /return\s*st\.empty\(\)\s*;/,
    /curSum\s*=\s*max\(nums\[i\],\s*curSum\s*\+\s*nums\[i\]\)/,
    /merged\.back\(\)\[1\]\s*=\s*max\(merged\.back\(\)\[1\],\s*iv\[1\]\)/,
    /nums\[lo\]\s*<=\s*target\s*&&\s*target\s*<\s*nums\[mid\]\)\s*hi\s*=\s*mid\s*-\s*1/
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
