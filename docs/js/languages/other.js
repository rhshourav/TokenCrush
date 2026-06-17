import { registerLanguage } from './registry.js';

registerLanguage('other', {
  name: 'Other',
  extensions: ['json', 'md', 'txt', 'yaml', 'yml', 'toml', 'xml', 'vue', 'svelte'],
  icon: '📄',
  badgeClass: 'lang-other',
  supportsIdRenaming: false,
  commentStyle: null,
  whitespaceRules: 'generic'
});
