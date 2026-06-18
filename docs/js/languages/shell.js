import { registerLanguage } from './registry.js';

registerLanguage('shell', {
  name: 'Shell',
  extensions: ['sh', 'bash', 'zsh'],
  icon: '🖥️',
  badgeClass: 'lang-shell',
  supportsIdRenaming: false,
  commentStyle: { line: '#', block: null },
  whitespaceRules: 'generic',
  reservedWords: new Set([
    'if', 'then', 'else', 'elif', 'fi', 'case', 'esac', 'for', 'while', 'until',
    'do', 'done', 'in', 'function', 'return', 'exit', 'export', 'source', 'local',
    'declare', 'typeset', 'readonly', 'unset', 'shift', 'set', 'trap', 'exec',
    'eval', 'echo', 'printf', 'read', 'test', 'select', 'time', 'coproc'
  ])
});

registerLanguage('powershell', {
  name: 'PowerShell',
  extensions: ['ps1', 'psm1', 'psd1'],
  icon: '💠',
  badgeClass: 'lang-ps1',
  supportsIdRenaming: false,
  commentStyle: { line: '#', block: null },
  whitespaceRules: 'generic',
  reservedWords: new Set([
    'begin', 'break', 'catch', 'class', 'continue', 'data', 'define', 'do',
    'dynamicparam', 'else', 'elseif', 'end', 'exit', 'filter', 'finally',
    'for', 'foreach', 'from', 'function', 'if', 'in', 'param', 'process',
    'return', 'switch', 'throw', 'trap', 'try', 'until', 'using', 'while',
    'workflow', 'hidden', 'static', 'enum', 'struct', 'interface'
  ])
});
