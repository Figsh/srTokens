/**
 * srTokens
 * Split a string into one-token-per-index arrays, then rebuild it
 * (or any part of it) from index ranges. Zero dependencies, ESM,
 * works in Node and the browser.
 */

/** Convert a string into an array of single characters (unicode safe). */
export function toTokens(str) {
  if (typeof str !== 'string') throw new TypeError('Expected a string');
  return Array.from(str);
}

function norm(tokens, i) {
  return i < 0 ? tokens.length + i : i;
}

function pick(tokens, start, end) {
  const s = norm(tokens, start);
  const e = norm(tokens, end);
  if (!Number.isInteger(s) || !Number.isInteger(e)) {
    throw new TypeError('Range bounds must be integers');
  }
  if (s < 0 || e >= tokens.length || s > e) {
    throw new RangeError(`Invalid range [${start}, ${end}] for length ${tokens.length}`);
  }
  return tokens.slice(s, e + 1).join('');
}

/**
 * Join pieces of the token array.
 * sub(tokens, start, end, [s2, e2], [s3, e3], ...)
 * Ranges are inclusive. Negative indexes count from the end.
 * A single number in a pair list, like [4], picks one token.
 */
export function sub(tokens, start, end, ...more) {
  if (!Array.isArray(tokens)) throw new TypeError('tokens must be an array');
  let out = pick(tokens, start, end);
  for (const r of more) {
    if (!Array.isArray(r)) throw new TypeError('Extra ranges must be [start, end] pairs');
    out += pick(tokens, r[0], r.length > 1 ? r[1] : r[0]);
  }
  return out;
}

/** Build a string from any number of [start, end] ranges. No ranges returns everything. */
export function build(tokens, ...ranges) {
  if (!Array.isArray(tokens)) throw new TypeError('tokens must be an array');
  if (ranges.length === 0) return tokens.join('');
  return ranges.map((r) => pick(tokens, r[0], r.length > 1 ? r[1] : r[0])).join('');
}

/**
 * Find ranges that rebuild `target` from the tokens (longest match first).
 * Returns an array of [start, end] pairs, or throws if a character is missing.
 */
export function plan(tokens, target) {
  const want = toTokens(target);
  const ranges = [];
  let i = 0;
  while (i < want.length) {
    let bestStart = -1;
    let bestLen = 0;
    for (let s = 0; s < tokens.length; s++) {
      let l = 0;
      while (i + l < want.length && s + l < tokens.length && tokens[s + l] === want[i + l]) l++;
      if (l > bestLen) {
        bestLen = l;
        bestStart = s;
      }
    }
    if (bestLen === 0) throw new Error(`Character "${want[i]}" not found in tokens`);
    ranges.push([bestStart, bestStart + bestLen - 1]);
    i += bestLen;
  }
  return ranges;
}

/* Small seeded PRNG so scatter is repeatable. */
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Shuffle a string's tokens with a seed.
 * Returns { pool, key }. Keep both to rebuild with gather().
 */
export function scatter(str, seed = 1) {
  const tokens = toTokens(str);
  const key = tokens.map((_, i) => i);
  const rand = mulberry32(seed);
  for (let i = key.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [key[i], key[j]] = [key[j], key[i]];
  }
  return { pool: key.map((k) => tokens[k]), key };
}

/** Rebuild the original string from scatter() output. */
export function gather(pool, key) {
  if (pool.length !== key.length) throw new RangeError('pool and key length differ');
  const out = new Array(pool.length);
  key.forEach((k, j) => {
    out[k] = pool[j];
  });
  return out.join('');
}

export default { toTokens, sub, build, plan, scatter, gather };
