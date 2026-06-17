import { registerLanguage } from './registry.js';

registerLanguage('py', {
  name: 'Python',
  extensions: ['py', 'python'],
  icon: '🐍',
  badgeClass: 'lang-py',
  supportsIdRenaming: true,
  commentStyle: 'python',
  whitespaceRules: 'python'
});
