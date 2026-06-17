import { state } from './state.js';
import { estTok } from './helpers.js';
import { getLanguage, isCompressible } from '../languages/index.js';
import { runPasses } from '../passes/index.js';

export function addFile(name, content, folderId = null) {
  const lang = getLanguage(name);
  const langId = lang ? lang.id : 'other';

  for (const [id, f] of state.files) {
    if (f.name === name && f.folderId === folderId) {
      f.content = content;
      f.compressed = null;
      f.ctxMap = [];
      f.pseudo = '';
      f.tokenIn = 0;
      f.tokenOut = 0;
      return id;
    }
  }

  const id = Math.random().toString(36).slice(2, 9);
  state.files.set(id, {
    name,
    content,
    lang: langId,
    folderId,
    compressed: null,
    ctxMap: [],
    pseudo: '',
    tokenIn: 0,
    tokenOut: 0
  });
  return id;
}

export function addFolder(name, parentId = null) {
  for (const [id, f] of state.folders) {
    if (f.name === name && f.parentId === parentId) return id;
  }

  const id = Math.random().toString(36).slice(2, 9);
  state.folders.set(id, { name, parentId, collapsed: false });
  return id;
}

export function deleteFile(id) {
  state.files.delete(id);
}

export function deleteFolder(folderId) {
  const toDelete = [folderId];
  for (const [id, f] of state.folders) {
    if (f.parentId === folderId) toDelete.push(id);
  }
  for (const fid of toDelete) {
    for (const [id, f] of state.files) {
      if (f.folderId === fid) state.files.delete(id);
    }
    state.folders.delete(fid);
  }
}

export function isDescendantFolder(folderId, ancestorId) {
  let current = state.folders.get(folderId);
  while (current) {
    if (current.parentId === ancestorId) return true;
    current = state.folders.get(current.parentId);
  }
  return false;
}

export function toggleFolder(folderId) {
  const f = state.folders.get(folderId);
  if (f) f.collapsed = !f.collapsed;
}

export function localCompress(content, lang) {
  return runPasses(content, lang);
}

export function compressFileById(id, showUI) {
  const f = state.files.get(id);
  if (!f) return null;

  const lang = f.lang;
  const { code, ctxMap } = localCompress(f.content, lang);

  f.compressed = code;
  f.ctxMap = ctxMap;
  f.tokenIn = estTok(f.content);
  f.tokenOut = estTok(code);

  state.compressionHistory.push({
    id,
    name: f.name,
    timestamp: Date.now(),
    tokenIn: f.tokenIn,
    tokenOut: f.tokenOut,
    compressed: code,
    ctxMap: ctxMap
  });

  if (state.compressionHistory.length > 50) {
    state.compressionHistory = state.compressionHistory.slice(-50);
  }

  return { code, ctxMap, tokenIn: f.tokenIn, tokenOut: f.tokenOut };
}

export function compressAllFiles(showProgress) {
  const results = [];
  for (const [id, f] of state.files) {
    const result = compressFileById(id, showProgress);
    results.push({ id, name: f.name, ...result });
  }
  return results;
}

export function clearAll() {
  state.files.clear();
  state.folders.clear();
  state.activeFileId = null;
  state.compressionHistory = [];
}
