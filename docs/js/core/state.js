export const state = {
  files: new Map(),
  folders: new Map(),
  activeFileId: null,
  currentStrategy: 'none',
  compressionHistory: [],
  autoCompressTimer: null,
  fileFilter: ''
};
