import { registerLanguage } from './registry.js';

registerLanguage('c', {
  name: 'C',
  extensions: ['c', 'h'],
  icon: '⚙️',
  badgeClass: 'lang-c',
  supportsIdRenaming: true,
  commentStyle: 'c-style',
  whitespaceRules: 'c-style'
});

registerLanguage('cpp', {
  name: 'C++',
  extensions: ['cpp', 'cxx', 'cc', 'hpp', 'hxx', 'hh', 'hhpp', 'h++', 'c++'],
  icon: '⚙️',
  badgeClass: 'lang-cpp',
  supportsIdRenaming: true,
  commentStyle: 'c-style',
  whitespaceRules: 'c-style'
});
