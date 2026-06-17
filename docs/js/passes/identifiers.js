import { registerPass } from './registry.js';
import { MAX_RENAME_COUNT } from '../core/config.js';

const JS_RESERVED = new Set([
  'break','case','catch','class','const','continue','debugger','default','delete',
  'do','else','enum','export','extends','finally','for','function','if','import',
  'in','instanceof','let','new','return','static','super','switch','this','throw',
  'try','typeof','var','void','while','with','yield','async','await','of','from',
  'undefined','null','true','false','NaN','Infinity',
  'console','document','window','navigator','Math','JSON','Object','Array','String',
  'Number','Boolean','RegExp','Date','Promise','Map','Set','WeakMap','WeakSet',
  'Symbol','Proxy','Reflect','Error','TypeError','RangeError','SyntaxError',
  'parseInt','parseFloat','isNaN','isFinite','encodeURI','decodeURI',
  'encodeURIComponent','decodeURIComponent','fetch','setTimeout','setInterval',
  'clearTimeout','clearInterval','requestAnimationFrame','cancelAnimationFrame',
  'addEventListener','removeEventListener','querySelector','querySelectorAll',
  'getElementById','getElementsByClassName','getElementsByTagName',
  'createElement','createTextNode','appendChild','removeChild','insertBefore',
  'replaceChild','setAttribute','getAttribute','removeAttribute',
  'classList','className','innerHTML','outerHTML','textContent','nodeValue',
  'parentNode','childNodes','children','firstChild','lastChild','nextSibling',
  'previousSibling','nodeName','nodeType','appendChild','cloneNode',
  'hasChildNodes','normalize','isSameNode','isEqualNode',
  'push','pop','shift','unshift','splice','slice','concat','join','reverse',
  'sort','indexOf','lastIndexOf','includes','find','findIndex','filter','map',
  'forEach','reduce','reduceRight','some','every','Array.isArray','Array.from',
  'length','prototype','constructor','toString','valueOf','hasOwnProperty',
  'isPrototypeOf','propertyIsEnumerable','toLocaleString',
  'apply','call','bind','name','arguments','caller',
  'then','catch','finally','resolve','reject','all','race','allSettled','any',
  'thenable','Promise.resolve','Promise.reject','Promise.all','Promise.race',
  'min','max','abs','ceil','floor','round','random','pow','sqrt','log','sin',
  'cos','tan','atan','atan2','exp','PI','E','sign','trunc','hypot',
  'charCodeAt','charAt','substring','substr','trim','trimStart','trimEnd',
  'startsWith','endsWith','repeat','padStart','padEnd','toLowerCase','toUpperCase',
  'localeCompare','match','matchAll','replace','replaceAll','search','split',
  'fromCharCode','fromCodePoint','raw','normalize',
  'parse','stringify','keys','values','entries','assign','freeze','seal',
  'preventExtensions','isFrozen','isSealed','isExtensible','create','defineProperty',
  'defineProperties','getOwnPropertyDescriptor','getOwnPropertyDescriptors',
  'getOwnPropertyNames','getPrototypeOf','setPrototypeOf','hasOwn',
  'now','ISOString','toJSON','dateString','timeString','toDateString','toTimeString',
  'getDate','getDay','getFullYear','getHours','getMilliseconds','getMinutes',
  'getMonth','getSeconds','getTime','getTimezoneOffset','getUTCDate','getUTCDay',
  'getUTCFullYear','getUTCHours','getUTCMilliseconds','getUTCMinutes','getUTCMonth',
  'getUTCSeconds','getYear','setDate','setFullYear','setHours','setMilliseconds',
  'setMinutes','setMonth','setSeconds','setTime','setUTCDate','setUTCFullYear',
  'setUTCHours','setUTCMilliseconds','setUTCMinutes','setUTCMonth','setUTCSeconds',
  'setYear','toGMTString','toLocaleDateString','toLocaleTimeString','toUTCString',
  'Date.now','Date.parse','Date.UTC',
  'Response','Request','Headers','URL','URLSearchParams','FormData',
  'Blob','File','FileReader','AbortController','AbortSignal',
  'TextEncoder','TextDecoder','ReadableStream','WritableStream','TransformStream',
  'crypto','SubtleCrypto','CryptoKey',
  'localStorage','sessionStorage','location','history','navigator',
  'alert','confirm','prompt','print','close','open','focus','blur',
  'self','top','parent','frames','opener',
  'atob','btoa',
  'requestAnimationFrame','cancelAnimationFrame',
  'IntersectionObserver','MutationObserver','ResizeObserver',
  'XMLHttpRequest','ActiveXObject',
  'eval','isFinite','isNaN',
  'Worker','SharedWorker','ServiceWorker','WebSocket',
  'MessageChannel','MessagePort','BroadcastChannel',
  'performance','chrome','opr','InstallTrigger',
  'Sidebar','statusbar','toolbar','menubar','locationbar',
  'scrollbars','personalbar','directories','modal',
  'external','screen','innerWidth','innerHeight','outerWidth','outerHeight',
  'pageXOffset','pageYOffset','screenX','screenY','screenLeft','screenTop',
  'visualViewport','devicePixelRatio',
  'caches','crossOriginIsolated','crypto','indexedDB','isSecureContext',
  'origin','performance','scheduler','trustedTypes','webkitRequestFileSystem',
  'webkitResolveLocalFileSystemURL','speechSynthesis',
  'onload','onerror','onabort','onprogress','ontimeout',
  'DOMException','InvalidStateError','HierarchyRequestError',
  'WrongDocumentError','NoModificationAllowedError','NotFoundError',
  'NotSupportedError','InUseAttributeError','InvalidStateError',
  'NamespaceError','InvalidAccessError','TypeMismatchError',
  'SecurityError','NetworkError','AbortError','QuotaExceededError',
  'TimeoutError','DataCloneError',
]);

const C_CPP_RESERVED = new Set([
  'auto','break','case','char','const','continue','default','do','double','else',
  'enum','extern','float','for','goto','if','inline','int','long','register',
  'restrict','return','short','signed','sizeof','static','struct','switch',
  'typedef','union','unsigned','void','volatile','while','_Bool','_Complex',
  '_Imaginary','alignas','alignof','atomic_bool','atomic_char','atomic_schar',
  'atomic_uchar','atomic_short','atomic_ushort','atomic_int','atomic_uint',
  'atomic_long','atomic_ulong','atomic_llong','atomic_ullong','atomic_char16_t',
  'atomic_char32_t','atomic_wchar_t','atomic_int_least8_t','atomic_uint_least8_t',
  'atomic_int_least16_t','atomic_uint_least16_t','atomic_int_least32_t',
  'atomic_uint_least32_t','atomic_int_least64_t','atomic_uint_least64_t',
  'atomic_int_fast8_t','atomic_uint_fast8_t','atomic_int_fast16_t',
  'atomic_uint_fast16_t','atomic_int_fast32_t','atomic_uint_fast32_t',
  'atomic_int_fast64_t','atomic_uint_fast64_t','atomic_intptr_t','atomic_uintptr_t',
  'atomic_size_t','atomic_ptrdiff_t','atomic_intmax_t','atomic_uintmax_t',
  'bool','complex','imaginary','nullptr','constexpr','static_assert',
  'thread_local','char8_t','char16_t','char32_t','wchar_t',
  'class','concept','const_cast','consteval','co_await','co_return','co_yield',
  'delete','dynamic_cast','explicit','export','friend','mutable','namespace',
  'new','noexcept','operator','private','protected','public','reinterpret_cast',
  'requires','static_assert','static_cast','template','this','throw','try',
  'typeid','typename','using','virtual','volatile','wchar_t','override','final',
  'NULL','EOF','stdin','stdout','stderr',
  'size_t','ptrdiff_t','intptr_t','uintptr_t','intmax_t','uintmax_t',
  'int8_t','int16_t','int32_t','int64_t',
  'uint8_t','uint16_t','uint32_t','uint64_t',
  'int_least8_t','int_least16_t','int_least32_t','int_least64_t',
  'uint_least8_t','uint_least16_t','uint_least32_t','uint_least64_t',
  'int_fast8_t','int_fast16_t','int_fast32_t','int_fast64_t',
  'uint_fast8_t','uint_fast16_t','uint_fast32_t','uint_fast64_t',
  'INT8_MIN','INT8_MAX','UINT8_MAX',
  'INT16_MIN','INT16_MAX','UINT16_MAX',
  'INT32_MIN','INT32_MAX','UINT32_MAX',
  'INT64_MIN','INT64_MAX','UINT64_MAX',
  'INT_MIN','INT_MAX','UINT_MAX',
  'LONG_MIN','LONG_MAX','ULONG_MAX',
  'LLONG_MIN','LLONG_MAX','ULLONG_MAX',
  'SIZE_MAX','PTRDIFF_MIN','PTRDIFF_MAX',
  'CHAR_MIN','CHAR_MAX','UCHAR_MAX','SCHAR_MAX','SCHAR_MIN',
  'SHRT_MIN','SHRT_MAX','USHRT_MAX',
  'FLT_MIN','FLT_MAX','DBL_MIN','DBL_MAX','LDBL_MIN','LDBL_MAX',
  'FLT_EPSILON','DBL_EPSILON','LDBL_EPSILON',
  'FLT_DIG','FLT_MANT_DIG','FLT_MIN_EXP','FLT_MAX_EXP',
  'DBL_DIG','DBL_MANT_DIG','DBL_MIN_EXP','DBL_MAX_EXP',
  'MATH_ERRNO','MATH_ERREXCEPT','math_errhandling',
  'NAN','INFINITY','HUGE_VAL','HUGE_VALF','HUGE_VALL',
  'FP_NORMAL','FP_SUBNORMAL','FP_ZERO','FP_INFINITE','FP_NAN',
  'stdio','stdlib','string','math','ctype','time','assert','errno','signal',
  'stdarg','stddef','limits','float','setjmp','locale','stdint','inttypes',
  'stdbool','complex','fenv','uchar','stdalign','stdnoreturn','threads',
  'atomic','tgmath','wchar','wctype',
  'printf','fprintf','sprintf','snprintf','scanf','fscanf','sscanf',
  'fopen','fclose','fread','fwrite','fgets','fputs','fseek','ftell','rewind',
  'fflush','feof','ferror','perror','remove','rename','tmpfile','tmpnam',
  'getchar','putchar','gets','puts','ungetc',
  'malloc','calloc','realloc','free','abort','exit','atexit','at_quick_exit',
  'system','getenv','atoi','atof','atol','strtol','strtoul','strtod','strtof',
  'rand','srand','abs','labs','div','ldiv',
  'memcpy','memmove','memset','memcmp','memchr',
  'strcpy','strncpy','strcat','strncat','strcmp','strncmp','strcoll','strchr',
  'strrchr','strstr','strtok','strlen','strerror',
  'sin','cos','tan','asin','acos','atan','atan2',
  'sinh','cosh','tanh','asinh','acosh','atanh',
  'exp','log','log10','log2','pow','sqrt','cbrt',
  'ceil','floor','round','trunc','fmod','remainder','remquo',
  'copysign','nan','nextafter','nexttoward',
  'fdim','fmax','fmin','fma',
  'fabs','hypot',
  'time','clock','difftime','mktime','gmtime','localtime','strftime','asctime',
  'ctime','CLOCKS_PER_SEC',
  'TMP_MAX','FILENAME_MAX','FOPEN_MAX','BUFSIZ','EOF','SEEK_SET','SEEK_CUR',
  'SEEK_END','BUFSIZ','_IOFBF','_IOLBF','_IONBF',
  'EXIT_FAILURE','EXIT_SUCCESS',
  'RAND_MAX','MB_LEN_MAX',
  'SIG_DFL','SIG_ERR','SIG_IGN','SIGABRT','SIGFPE','SIGILL','SIGINT',
  'SIGSEGV','SIGTERM',
  'NULL','offsetof',
  'vector','string','map','unordered_map','set','unordered_set',
  'list','deque','queue','stack','array','pair','tuple',
  'shared_ptr','unique_ptr','weak_ptr','make_shared','make_unique',
  'cout','cin','cerr','clog','endl','flush',
  'iostream','fstream','sstream','iomanip',
  'algorithm','functional','numeric','iterator','memory',
  'exception','runtime_error','logic_error','invalid_argument','out_of_range',
  'overflow_error','underflow_error','range_error','domain_error',
  'length_error','bad_alloc','bad_cast','bad_typeid','bad_exception',
  'nullptr_t','size_t','ptrdiff_t','max_align_t',
  'auto','register','static','extern','mutable','thread_local',
  'volatile','const','constexpr','consteval','constinit',
  'inline','virtual','explicit','friend',
  'public','private','protected',
  'class','struct','union','enum','typedef','using','namespace',
  'new','delete','sizeof','alignof','alignas','decltype','typeid','noexcept',
  'static_cast','dynamic_cast','const_cast','reinterpret_cast',
  'true','false','this',
  'override','final',
  'co_await','co_return','co_yield','requires','concept',
  'import','module','export',
]);

const PYTHON_RESERVED = new Set([
  'False','None','True','and','as','assert','async','await','break','class',
  'continue','def','del','elif','else','except','finally','for','from','global',
  'if','import','in','is','lambda','nonlocal','not','or','pass','raise','return',
  'try','while','with','yield',
  'print','input','open','range','len','int','float','str','list','dict','set',
  'tuple','bool','type','object','super','property','staticmethod','classmethod',
  'abs','all','any','bin','chr','dir','divmod','enumerate','eval','exec','filter',
  'format','frozenset','getattr','globals','hasattr','hash','hex','id','isinstance',
  'issubclass','iter','locals','map','max','min','next','oct','ord','pow','repr',
  'reversed','round','setattr','slice','sorted','sum','vars','zip',
  'Exception','ValueError','TypeError','KeyError','IndexError','AttributeError',
  'ImportError','StopIteration','RuntimeError','OSError','IOError','FileNotFoundError',
  'ZeroDivisionError','MemoryError','RecursionError','NotImplementedError',
  'ArithmeticError','AssertionError','LookupError','EncodingWarning',
  'DeprecationWarning','PendingDeprecationWarning','RuntimeWarning',
  'SyntaxWarning','UserWarning','FutureWarning','ImportWarning',
  'UnicodeWarning','BytesWarning','ResourceWarning',
  '__name__','__main__','__init__','__new__','__del__','__repr__','__str__',
  '__bytes__','__format__','__lt__','__le__','__eq__','__ne__','__gt__','__ge__',
  '__hash__','__bool__','__getattr__','__getattribute__','__setattr__',
  '__delattr__','__get__','__set__','__delete__','__call__','__len__','__length_hint__',
  '__getitem__','__setitem__','__delitem__','__missing__','__iter__','__next__',
  '__reversed__','__contains__','__add__','__sub__','__mul__','__truediv__',
  '__floordiv__','__mod__','__divmod__','__pow__','__lshift__','__rshift__',
  '__and__','__xor__','__or__','__neg__','__pos__','__abs__','__invert__',
  '__complex__','__int__','__float__','__round__','__trunc__','__floor__','__ceil__',
  '__enter__','__exit__','__await__','__aenter__','__aexit__',
  'self','cls',
]);

function generateAlias(index) {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let result = '_';
  let i = index;
  result += chars[i % 26];
  i = Math.floor(i / 26);
  while (i > 0) {
    i--;
    result += chars[i % 26];
  }
  return result;
}

registerPass('Identifiers', {
  name: 'Identifiers',
  description: 'Rename long identifiers to shorter aliases',
  order: 3,
  requiresLang: null,
  run(code, lang, options) {
    const reservedSets = {
      js: JS_RESERVED,
      c: C_CPP_RESERVED,
      cpp: C_CPP_RESERVED,
      'c-cpp': C_CPP_RESERVED,
      py: PYTHON_RESERVED,
    };
    const reserved = reservedSets[lang] || JS_RESERVED;

    const identifierRegex = /\b([a-zA-Z_][a-zA-Z0-9_$]*)\b/g;
    const freq = new Map();
    let match;

    while ((match = identifierRegex.exec(code)) !== null) {
      const word = match[1];
      if (word.length < 5) continue;
      if (reserved.has(word)) continue;
      if (word.startsWith('_')) continue;
      freq.set(word, (freq.get(word) || 0) + 1);
    }

    const sorted = [...freq.entries()]
      .sort((a, b) => (b[1] * b[0].length) - (a[1] * a[0].length))
      .slice(0, MAX_RENAME_COUNT);

    const ctxMap = [];
    let aliasIdx = 0;

    for (const [from, count] of sorted) {
      const to = generateAlias(aliasIdx++);
      const regex = new RegExp(`\\b${from}\\b`, 'g');
      code = code.replace(regex, to);
      ctxMap.push({ from, to, count });
    }

    return { code, ctxMap };
  }
});
