import { registerLanguage } from './registry.js';

registerLanguage('html', {
  name: 'HTML',
  extensions: ['html', 'htm'],
  icon: '🌐',
  badgeClass: 'lang-html',
  supportsIdRenaming: false,
  commentStyle: 'html',
  whitespaceRules: 'html'
});
