import type { Currency } from '../types';

const CACHE_HOURS = 12;
const cacheKey = (base: Currency) => `sobra-rates-${base}`;

interface CachedRates {
  fetchedAt: number;
  rates: Record<string, number>;
}

const readCache = (base: Currency): CachedRates | null => {
  try {
    const raw = localStorage.getItem(cacheKey(base));
    return raw ? (JSON.parse(raw) as CachedRates) : null;
  } catch {
    return null;
  }
};

// Returns how many units of `base` one unit of `from` is worth, or null when offline with no cache
export const getRate = async (from: Currency, base: Currency): Promise<number | null> => {
  if (from === base) return 1;
  const cached = readCache(base);
  const fresh = cached && Date.now() - cached.fetchedAt < CACHE_HOURS * 3600 * 1000;
  let rates = cached?.rates;

  if (!fresh) {
    try {
      const response = await fetch(`https://open.er-api.com/v6/latest/${base}`);
      const body = (await response.json()) as { result: string; rates?: Record<string, number> };
      if (body.result === 'success' && body.rates) {
        rates = body.rates;
        localStorage.setItem(cacheKey(base), JSON.stringify({ fetchedAt: Date.now(), rates }));
      }
    } catch {
      // offline: fall back to the last known rates
    }
  }

  const perBase = rates?.[from];
  return perBase ? 1 / perBase : null;
};
