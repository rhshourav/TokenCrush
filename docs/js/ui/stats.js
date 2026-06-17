const STATS_API = 'https://tokencrush-stats.rhshourav02.workers.dev';
const STORAGE_KEY = 'tokencrush-stats';

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}
function saveLocal(stats) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(stats)); } catch {}
}

let cachedStats = { visitors: 0, filesCompressed: 0 };

async function fetchStats() {
  try {
    const res = await fetch(`${STATS_API}/api/stats`);
    if (res.ok) {
      cachedStats = await res.json();
      saveLocal(cachedStats);
      renderStats(cachedStats);
    }
  } catch {
    // Fallback to localStorage
    cachedStats = loadLocal();
    renderStats(cachedStats);
  }
}

export function initStats() {
  cachedStats = loadLocal();
  renderStats(cachedStats);
  fetchStats();
  notifyVisit();
}

async function notifyVisit() {
  try {
    const res = await fetch(`${STATS_API}/api/stats/visit`, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      cachedStats.visitors = data.visitors;
      saveLocal(cachedStats);
      renderStats(cachedStats);
    }
  } catch {
    // Local fallback: increment on each page load
    cachedStats.visitors = (cachedStats.visitors || 0) + 1;
    saveLocal(cachedStats);
    renderStats(cachedStats);
  }
}

export async function trackFileCompressed(count) {
  renderStats(cachedStats);
  try {
    const res = await fetch(`${STATS_API}/api/stats/compress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count })
    });
    if (res.ok) {
      const data = await res.json();
      cachedStats.filesCompressed = data.filesCompressed;
      saveLocal(cachedStats);
      renderStats(cachedStats);
    }
  } catch {
    // Local fallback
    cachedStats.filesCompressed = (cachedStats.filesCompressed || 0) + count;
    saveLocal(cachedStats);
    renderStats(cachedStats);
  }
}

function renderStats(stats) {
  const vc = document.getElementById('visitorCount');
  const fc = document.getElementById('filesCompressedCount');
  if (vc) vc.textContent = (stats.visitors || 0).toLocaleString();
  if (fc) fc.textContent = (stats.filesCompressed || 0).toLocaleString();
}
