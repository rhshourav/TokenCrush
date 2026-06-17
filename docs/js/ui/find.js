let findMatches = [];
let findIndex = 0;

export function openFindBar() {
  const bar = document.getElementById('findBar');
  if (bar) bar.classList.add('show');
  const input = document.getElementById('findInput');
  if (input) input.focus();
}

export function closeFindBar() {
  const bar = document.getElementById('findBar');
  if (bar) bar.classList.remove('show');
  findMatches = [];
  findIndex = 0;
  updateFindInfo();
}

export function doFind() {
  const input = document.getElementById('findInput');
  const ta = document.getElementById('codeEditor');
  if (!input || !ta) return;

  const query = input.value;
  if (!query) {
    findMatches = [];
    findIndex = 0;
    updateFindInfo();
    return;
  }

  const text = ta.value;
  findMatches = [];
  let idx = 0;
  while (true) {
    idx = text.indexOf(query, idx);
    if (idx === -1) break;
    findMatches.push(idx);
    idx += query.length;
  }

  findIndex = findMatches.length > 0 ? 0 : -1;
  updateFindInfo();

  if (findMatches.length > 0) {
    highlightFocus(0);
  }
}

export function findNext() {
  if (findMatches.length === 0) return;
  findIndex = (findIndex + 1) % findMatches.length;
  highlightFocus(findIndex);
  updateFindInfo();
}

export function findPrev() {
  if (findMatches.length === 0) return;
  findIndex = (findIndex - 1 + findMatches.length) % findMatches.length;
  highlightFocus(findIndex);
  updateFindInfo();
}

function highlightFocus(idx) {
  const ta = document.getElementById('codeEditor');
  const input = document.getElementById('findInput');
  if (!ta || !input || idx < 0 || idx >= findMatches.length) return;

  const start = findMatches[idx];
  const len = input.value.length;
  ta.focus();
  ta.setSelectionRange(start, start + len);
}

function updateFindInfo() {
  const info = document.getElementById('findInfo');
  if (info) {
    info.textContent = findMatches.length > 0 ? `${findIndex + 1}/${findMatches.length}` : '0/0';
  }
}

export function doReplace() {
  const ta = document.getElementById('codeEditor');
  const replaceInput = document.getElementById('replaceInput');
  const findInput = document.getElementById('findInput');
  if (!ta || !replaceInput || !findInput || findIndex < 0) return;

  const query = findInput.value;
  const replacement = replaceInput.value;
  if (!query) return;

  const start = findMatches[findIndex];
  ta.value = ta.value.substring(0, start) + replacement + ta.value.substring(start + query.length);
  doFind();
}

export function doReplaceAll() {
  const ta = document.getElementById('codeEditor');
  const replaceInput = document.getElementById('replaceInput');
  const findInput = document.getElementById('findInput');
  if (!ta || !replaceInput || !findInput) return;

  const query = findInput.value;
  const replacement = replaceInput.value;
  if (!query) return;

  ta.value = ta.value.split(query).join(replacement);
  doFind();
}
