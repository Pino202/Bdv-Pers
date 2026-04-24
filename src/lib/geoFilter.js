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

// Returns a 2-letter country code string (e.g. "VE"), or null on any failure.
// null always means fail-open (let the user through).
export async function getCountryCode() {
  try {
    const cached = sessionStorage.getItem(GEO_CACHE_KEY);
    if (cached) {
      const { cc, ts } = JSON.parse(cached);
      if (Date.now() - ts < GEO_CACHE_TTL) return cc;
    }
  } catch { /* sessionStorage unavailable */ }

  // ipapi.co: HTTPS native, free tier, returns plain-text country code ("VE")
  try {
    const res = await fetch('https://ipapi.co/country/', {
      signal: AbortSignal.timeout(4000),
    });
    const text = (await res.text()).trim();
    // Valid country codes are exactly 2 uppercase letters
    if (/^[A-Z]{2}$/.test(text)) {
      try {
        sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify({ cc: text, ts: Date.now() }));
      } catch { /* ignore */ }
      return text;
    }
  } catch { /* try fallback */ }

  // Fallback: ipwho.is — also HTTPS native and free
  try {
    const res = await fetch('https://ipwho.is/?fields=country_code', {
      signal: AbortSignal.timeout(4000),
    });
    const { country_code } = await res.json();
    if (typeof country_code === 'string' && /^[A-Z]{2}$/.test(country_code)) {
      try {
        sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify({ cc: country_code, ts: Date.now() }));
      } catch { /* ignore */ }
      return country_code;
    }
  } catch { /* fall through */ }

  return null; // fail-open: both APIs failed → let user through
}

export async function shouldShowLanding() {
  if (import.meta.env.VITE_GEO_FILTER !== 'true') return false;
  if (isBot() || hasGoogleAdsClick()) return true;
  const cc = await getCountryCode();
  // null = API failure → fail-open (don't block Venezuelan users by mistake)
  return cc !== null && cc !== 'VE';
}
