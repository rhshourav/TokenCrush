import { registerPass } from './registry.js';

function stripCStyleComments(code) {
  let result = '';
  let i = 0;
  const len = code.length;

  while (i < len) {
    if (code[i] === '"' || code[i] === "'" || code[i] === '`') {
      const quote = code[i];
      result += code[i++];
      while (i < len && code[i] !== quote) {
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
    } else if (code[i] === '#' && (i === 0 || code[i - 1] === '\n')) {
      while (i < len && code[i] !== '\n') i++;
    } else {
      result += code[i++];
    }
  }
  return result;
}

function stripHTMLComments(code) {
  return code.replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
}

function stripPythonComments(code) {
  let result = '';
  let i = 0;
  const len = code.length;

  while (i < len) {
    if (code[i] === '"' || code[i] === "'") {
      const q = code[i];
      const triple = code.slice(i, i + 3);
      if (triple === q.repeat(3)) {
        result += triple;
        i += 3;
        while (i < len && code.slice(i, i + 3) !== triple) { result += code[i++]; }
        if (i < len) { result += triple; i += 3; }
      } else {
        result += code[i++];
        while (i < len && code[i] !== q) {
          if (code[i] === '\\') { result += code[i++]; }
          if (i < len) result += code[i++];
        }
        if (i < len) result += code[i++];
      }
    } else if (code[i] === '#') {
      while (i < len && code[i] !== '\n') i++;
    } else {
      result += code[i++];
    }
  }
  return result;
}

function stripCSSComments(code) {
  return code.replace(/\/\*[\s\S]*?\*\//g, '');
}

registerPass('Comments', {
  name: 'Comments',
  description: 'Strip comments from code',
  order: 1,
  run(code, lang) {
    switch (lang) {
      case 'c':
      case 'cpp':
      case 'c-cpp':
      case 'js':
        return stripCStyleComments(code);
      case 'html':
        return stripHTMLComments(code);
      case 'py':
        return stripPythonComments(code);
      case 'css':
        return stripCSSComments(code);
      default:
        return code;
    }
  }
});
