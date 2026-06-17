const languages = new Map();

export function registerLanguage(id, config) {
  languages.set(id, {
    id,
    name: config.name || id,
    extensions: config.extensions || [],
    icon: config.icon || '📄',
    badgeClass: config.badgeClass || 'lang-other',
    commentStyle: config.commentStyle || null,
    whitespaceRules: config.whitespaceRules || 'generic',
    supportsIdRenaming: config.supportsIdRenaming ?? false,
    reservedWords: config.reservedWords || new Set(),
    preprocessor: config.preprocessor || null,
    ...config
  });
}

export function getLanguage(name) {
  const ext = name.split('.').pop().toLowerCase();
  for (const [, lang] of languages) {
    if (lang.extensions.includes(ext)) return lang;
  }
  return languages.get('other') || null;
}

export function getLanguageById(id) {
  return languages.get(id) || null;
}

export function getAllLanguages() {
  return [...languages.values()];
}

export function isCompressible(name) {
  const ext = name.split('.').pop().toLowerCase();
  for (const [, lang] of languages) {
    if (lang.extensions.includes(ext)) return true;
  }
  return false;
}

export function getLangBadgeClass(lang) {
  const l = typeof lang === 'string' ? languages.get(lang) : lang;
  return l ? l.badgeClass : 'lang-other';
}

export function getLangIcon(lang) {
  const l = typeof lang === 'string' ? languages.get(lang) : lang;
  return l ? l.icon : '📄';
}
