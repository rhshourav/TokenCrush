import { registerLanguage } from './registry.js';

registerLanguage('js', {
  name: 'JavaScript',
  extensions: ['js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs'],
  icon: '📜',
  badgeClass: 'lang-js',
  supportsIdRenaming: true,
  commentStyle: 'c-style',
  whitespaceRules: 'c-style'
});
