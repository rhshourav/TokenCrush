import { registerPass } from './registry.js';

function stripWhitespaceHTML(code) {
  return code
    .replace(/\n\s*/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/>\s+</g, '><')
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*:\s*/g, ':')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s*,\s*/g, ',');
}

function stripWhitespaceCSS(code) {
  return code
    .replace(/\n/g, '')
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*:\s*/g, ':')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s*,\s*/g, ',')
    .replace(/;}/g, '}')
    .replace(/\s{2,}/g, ' ');
}

function stripWhitespaceJS(code) {
  let result = '';
  let i = 0;
  const len = code.length;

  while (i < len) {
    if (code[i] === '"' || code[i] === "'" || code[i] === '`') {
      const q = code[i];
      result += code[i++];
      while (i < len && code[i] !== q) {
        if (code[i] === '\\') { result += code[i++]; }
        if (i < len) result += code[i++];
      }
      if (i < len) result += code[i++];
    } else if (code[i] === '/' && code[i + 1] === '/') {
      while (i < len && code[i] !== '\n') i++;
    } else if (code[i] === '/' && code[i + 1] === '*') {
      i += 2;
      while (i < len && !(code[i] === '*' && code[i + 1] === '/')) i++;
      i += 2;
    } else if (/\s/.test(code[i])) {
      while (i < len && /\s/.test(code[i])) i++;
      result += ' ';
    } else {
      result += code[i++];
    }
  }

  return result
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s*,\s*/g, ',')
    .replace(/\s*\(\s*/g, '(')
    .replace(/\s*\)\s*/g, ')')
    .replace(/\s*\[\s*/g, '[')
    .replace(/\s*\]\s*/g, ']')
    .replace(/\s*=\s*/g, '=')
    .replace(/\s*==\s*/g, '==')
    .replace(/\s*===\s*/g, '===')
    .replace(/\s*!=\s*/g, '!=')
    .replace(/\s*!==\s*/g, '!==')
    .replace(/\s*<=\s*/g, '<=')
    .replace(/\s*>=\s*/g, '>=')
    .replace(/\s*<\s*/g, '<')
    .replace(/\s*>\s*/g, '>')
    .replace(/\s*\+\s*/g, '+')
    .replace(/\s*-\s*/g, '-')
    .replace(/\s*\*\s*/g, '*')
    .replace(/\s*\/\s*/g, '/')
    .replace(/\s*%\s*/g, '%')
    .replace(/\s*&&\s*/g, '&&')
    .replace(/\s*\|\|\s*/g, '||')
    .replace(/\s*!\s*/g, '!')
    .replace(/\s*,\s*/g, ',')
    .replace(/ ;/g, ';')
    .replace(/{ /g, '{')
    .replace(/ }/g, '}')
    .replace(/ \)/g, ')')
    .replace(/\( /g, '(')
    .replace(/\n\s*\n/g, '\n')
    .replace(/^\s+|\s+$/g, '');
}

function stripWhitespaceC(code) {
  let result = '';
  let i = 0;
  const len = code.length;

  while (i < len) {
    if (code[i] === '"' || code[i] === "'") {
      const q = code[i];
      result += code[i++];
      while (i < len && code[i] !== q) {
        if (code[i] === '\\') { result += code[i++]; }
        if (i < len) result += code[i++];
      }
      if (i < len) result += code[i++];
    } else if (code[i] === '/' && code[i + 1] === '/') {
      while (i < len && code[i] !== '\n') i++;
    } else if (code[i] === '/' && code[i + 1] === '*') {
      i += 2;
      while (i < len && !(code[i] === '*' && code[i + 1] === '/')) i++;
      i += 2;
    } else if (code[i] === '#') {
      while (i < len && code[i] !== '\n') result += code[i++];
    } else if (/\s/.test(code[i])) {
      while (i < len && /\s/.test(code[i])) i++;
      result += ' ';
    } else {
      result += code[i++];
    }
  }

  return result
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s*,\s*/g, ',')
    .replace(/\s*\(\s*/g, '(')
    .replace(/\s*\)\s*/g, ')')
    .replace(/\s*\*\s*/g, '*')
    .replace(/\s*=\s*/g, '=')
    .replace(/\s*==\s*/g, '==')
    .replace(/\s*!=\s*/g, '!=')
    .replace(/\s*<=\s*/g, '<=')
    .replace(/\s*>=\s*/g, '>=')
    .replace(/\s*<\s*/g, '<')
    .replace(/\s*>\s*/g, '>')
    .replace(/\s*&&\s*/g, '&&')
    .replace(/\s*\|\|\s*/g, '||')
    .replace(/\s*!\s*/g, '!')
    .replace(/ ;/g, ';')
    .replace(/{ /g, '{')
    .replace(/ }/g, '}')
    .replace(/ \)/g, ')')
    .replace(/\( /g, '(')
    .replace(/\n\s*\n/g, '\n')
    .replace(/^\s+|\s+$/g, '');
}

function stripWhitespaceGeneric(code) {
  return code
    .replace(/\n\s*/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/^\s+|\s+$/g, '');
}

registerPass('Whitespace', {
  name: 'Whitespace',
  description: 'Strip unnecessary whitespace',
  order: 2,
  run(code, lang) {
    switch (lang) {
      case 'html': return stripWhitespaceHTML(code);
      case 'css': return stripWhitespaceCSS(code);
      case 'c':
      case 'cpp':
      case 'c-cpp':
      case 'js': return stripWhitespaceJS(code);
      case 'py': return stripWhitespaceJS(code);
      default: return stripWhitespaceGeneric(code);
    }
  }
});
