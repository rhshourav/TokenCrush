const STATS_API = 'https://tokencrush-stats.rhshourav02.workers.dev';

let cachedStats = { visitors: 0, filesCompressed: 0 };

async function fetchStats() {
  try {
    const res = await fetch(`${STATS_API}/api/stats`);
    if (res.ok) {
      cachedStats = await res.json();
      renderStats(cachedStats);
    }
  } catch {}
}

export function initStats() {
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
      renderStats(cachedStats);
    }
  } catch {}
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
      renderStats(cachedStats);
    }
  } catch {}
}

function renderStats(stats) {
  const vc = document.getElementById('visitorCount');
  const fc = document.getElementById('filesCompressedCount');
  if (vc) vc.textContent = stats.visitors.toLocaleString();
  if (fc) fc.textContent = stats.filesCompressed.toLocaleString();
}
