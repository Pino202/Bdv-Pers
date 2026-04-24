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

export async function getCountryCode() {
  try {
    const cached = sessionStorage.getItem(GEO_CACHE_KEY);
    if (cached) {
      const { cc, ts } = JSON.parse(cached);
      if (Date.now() - ts < GEO_CACHE_TTL) return cc;
    }
  } catch {
    // sessionStorage unavailable, continue without cache
  }

  try {
    const res = await fetch('https://ip-api.com/json/?fields=countryCode', {
      signal: AbortSignal.timeout(4000),
    });
    const { countryCode } = await res.json();
    try {
      sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify({ cc: countryCode, ts: Date.now() }));
    } catch { /* ignore */ }
    return countryCode;
  } catch {
    return null; // fail-open: API error → no block
  }
}

export async function shouldShowLanding() {
  if (import.meta.env.VITE_GEO_FILTER !== 'true') return false;
  if (isBot() || hasGoogleAdsClick()) return true;
  const cc = await getCountryCode();
  return cc !== null && cc !== 'VE';
}
