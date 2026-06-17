const passes = new Map();

export function registerPass(id, config) {
  passes.set(id, {
    id,
    name: config.name || id,
    description: config.description || '',
    enabled: config.enabled ?? true,
    run: config.run,
    requiresLang: config.requiresLang || null,
    order: config.order || 0,
    ...config
  });
}

export function getPass(id) {
  return passes.get(id) || null;
}

export function getAllPasses() {
  return [...passes.values()].sort((a, b) => a.order - b.order);
}

export function getEnabledPasses() {
  return getAllPasses().filter(p => p.enabled);
}

export function runPasses(code, lang, options = {}) {
  let result = code;
  const ctxMap = [];

  for (const pass of getAllPasses()) {
    if (!pass.enabled) continue;
    if (pass.requiresLang && pass.requiresLang !== lang) continue;
    if (options[`skip${pass.id}`]) continue;

    const out = pass.run(result, lang, options);
    if (typeof out === 'string') {
      result = out;
    } else if (out && out.code) {
      result = out.code;
      if (out.ctxMap) ctxMap.push(...out.ctxMap);
    }
  }

  return { code: result, ctxMap };
}

export function setPassEnabled(id, enabled) {
  const pass = passes.get(id);
  if (pass) pass.enabled = enabled;
}
