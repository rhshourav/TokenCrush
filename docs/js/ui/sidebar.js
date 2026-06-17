import { state } from '../core/state.js';
import { escH, escAttr, estTok, fmtBytes } from '../core/helpers.js';
import { getLanguage, getLangBadgeClass, getLangIcon } from '../languages/index.js';
import { deleteFile, deleteFolder, toggleFolder, isDescendantFolder, addFile } from '../core/engine.js';

export function renderFileList() {
  const list = document.getElementById('fileList');
  if (!list) return;
  list.innerHTML = '';

  const filter = state.fileFilter;
  const rootFolders = [...state.folders.entries()].filter(([, f]) => f.parentId === null);
  const rootFiles = [...state.files.entries()].filter(([, f]) => f.folderId === null);

  for (const [id] of rootFolders) {
    renderFolderNode(list, id, 0, filter);
  }

  for (const [id, f] of rootFiles) {
    if (filter && !f.name.toLowerCase().includes(filter)) continue;
    list.appendChild(createFileElement(id, f, 0, id === state.activeFileId));
  }
}

function renderFolderNode(parent, folderId, depth, filter) {
  const folder = state.folders.get(folderId);
  if (!folder) return;

  const hasChildren = hasFolderContent(folderId, filter);
  if (filter && !hasChildren) return;

  const el = document.createElement('div');
  el.className = 'folder-item' + (folder.collapsed ? ' collapsed' : '');
  el.style.setProperty('--depth', depth);
  el.onclick = () => { toggleFolder(folderId); renderFileList(); };

  const count = countFolderFiles(folderId);
  el.innerHTML = `
    <span class="folder-icon">${folder.collapsed ? '📁' : '📂'}</span>
    <span class="folder-name">${escH(folder.name)}</span>
    <span class="folder-count">${count}</span>
    <button class="folder-del" title="Delete folder">&times;</button>
  `;

  el.querySelector('.folder-del').onclick = (e) => {
    e.stopPropagation();
    deleteFolder(folderId);
    renderFileList();
  };

  parent.appendChild(el);

  if (!folder.collapsed) {
    const children = [...state.folders.entries()].filter(([, f]) => f.parentId === folderId);
    for (const [childId] of children) {
      renderFolderNode(parent, childId, depth + 1, filter);
    }

    const files = [...state.files.entries()].filter(([, f]) => f.folderId === folderId);
    for (const [id, f] of files) {
      if (filter && !f.name.toLowerCase().includes(filter)) continue;
      parent.appendChild(createFileElement(id, f, depth + 1, id === state.activeFileId));
    }
  }
}

function hasFolderContent(folderId, filter) {
  const children = [...state.folders.values()].filter(f => f.parentId === folderId);
  for (const child of children) {
    if (hasFolderContent(state.folders.entries().next().value?.[0], filter)) return true;
  }
  const files = [...state.files.values()].filter(f => f.folderId === folderId);
  for (const f of files) {
    if (!filter || f.name.toLowerCase().includes(filter)) return true;
  }
  return false;
}

function countFolderFiles(folderId) {
  let count = 0;
  for (const [, f] of state.files) {
    if (f.folderId === folderId) count++;
  }
  for (const [id] of state.folders) {
    if (state.folders.get(id)?.parentId === folderId) {
      count += countFolderFiles(id);
    }
  }
  return count;
}

function createFileElement(id, f, depth, isActive) {
  const el = document.createElement('div');
  el.className = 'file-item' + (isActive ? ' active' : '') + (f.compressed ? ' compressed' : '');
  el.style.setProperty('--depth', depth);

  const lang = getLanguage(f.name);
  const icon = lang ? lang.icon : '📄';
  const lines = f.content.split('\n').length;
  const tokens = estTok(f.content);

  el.innerHTML = `
    <span class="fi-status ${f.compressed ? 'done' : ''}"></span>
    <span class="fi-icon">${icon}</span>
    <span class="fi-name">${escH(f.name)}</span>
    <span class="fi-lines">${lines}L</span>
    <span class="fi-tok">${tokens}t</span>
    <button class="fi-del" title="Remove file">&times;</button>
  `;

  el.onclick = (e) => {
    if (e.target.closest('.fi-del')) return;
    state.activeFileId = id;
    renderFileList();
    if (typeof window.selectFile === 'function') window.selectFile(id);
  };

  el.querySelector('.fi-del').onclick = (e) => {
    e.stopPropagation();
    deleteFile(id);
    if (state.activeFileId === id) {
      state.activeFileId = null;
      if (typeof window.showEditorEmpty === 'function') window.showEditorEmpty();
    }
    renderFileList();
  };

  return el;
}

export function updateFileCount() {
  const n = state.files.size;
  const badge = document.getElementById('fileCountBadge');
  const btn = document.getElementById('compressAllBtn');
  if (badge) badge.textContent = n === 0 ? 'No files loaded' : `${n} file${n === 1 ? '' : 's'} loaded`;
  if (btn) btn.disabled = n === 0;
}

export function filterFiles(q) {
  state.fileFilter = q.toLowerCase();
  renderFileList();
}
