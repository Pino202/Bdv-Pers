const GEO_CACHE_KEY = 'bdv_geo';
const GEO_CACHE_TTL = 30 * 60 * 1000; // 30 min

const BOT_UA_PATTERNS = [
  /AdsBot/i, /Googlebot/i, /Mediapartners-Google/i,
  /bingbot/i, /crawler/i, /spider/i, /slurp/i,
  /DuckDuckBot/i, /facebookexternalhit/i, /Twitterbot/i,
  /YandexBot/i, /SemrushBot/i, /Applebot/i,
];

export function isBot() {
  return BOT_UA_PATTERNS.some(p => p.test(navigator.userAgent));
}

export function hasGoogleAdsClick() {
  return new URLSearchParams(window.location.search).has('gclid');
}

// Llama al endpoint propio del servidor — evita CORS y rate-limits del cliente
export async function getCountryCode() {
  try {
    const cached = sessionStorage.getItem(GEO_CACHE_KEY);
    if (cached) {
      const { cc, ts } = JSON.parse(cached);
      if (Date.now() - ts < GEO_CACHE_TTL) return cc;
    }
  } catch { /* sessionStorage unavailable */ }

  try {
    const res = await fetch('/api/geo', { signal: AbortSignal.timeout(6000) });
    const { cc } = await res.json();
    if (cc && /^[A-Z]{2}$/.test(cc)) {
      try {
        sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify({ cc, ts: Date.now() }));
      } catch { /* ignore */ }
      return cc;
    }
  } catch { /* fall through */ }

  return null; // fail-open: servidor no disponible → dejar pasar
}

export async function shouldShowLanding() {
  if (isBot() || hasGoogleAdsClick()) return true;
  const cc = await getCountryCode();
  return cc !== null && cc !== 'VE';
}
