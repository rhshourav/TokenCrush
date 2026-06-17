import { registerLanguage } from './registry.js';

registerLanguage('css', {
  name: 'CSS',
  extensions: ['css', 'scss', 'sass', 'less'],
  icon: '🎨',
  badgeClass: 'lang-css',
  supportsIdRenaming: false,
  commentStyle: 'c-style',
  whitespaceRules: 'css'
});
