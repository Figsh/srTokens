/**
 * srTokens (TypeScript implementation)
 * Same behavior as index.js. Zero dependencies.
 */

export type Range = [start: number, end?: number];

export interface Scattered {
  pool: string[];
  key: number[];
}

export function toTokens(str: string): string[] {
  if (typeof str !== 'string') throw new TypeError('Expected a string');
  return Array.from(str);
}

function norm(tokens: string[], i: number): number {
  return i < 0 ? tokens.length + i : i;
}

function pick(tokens: string[], start: number, end: number): string {
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

export function sub(tokens: string[], start: number, end: number, ...more: Range[]): string {
  if (!Array.isArray(tokens)) throw new TypeError('tokens must be an array');
  let out = pick(tokens, start, end);
  for (const r of more) {
    if (!Array.isArray(r)) throw new TypeError('Extra ranges must be [start, end] pairs');
    out += pick(tokens, r[0], r.length > 1 ? (r[1] as number) : r[0]);
  }
  return out;
}

export function build(tokens: string[], ...ranges: Range[]): string {
  if (!Array.isArray(tokens)) throw new TypeError('tokens must be an array');
  if (ranges.length === 0) return tokens.join('');
  return ranges.map((r) => pick(tokens, r[0], r.length > 1 ? (r[1] as number) : r[0])).join('');
}

export function plan(tokens: string[], target: string): [number, number][] {
  const want = toTokens(target);
  const ranges: [number, number][] = [];
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

function mulberry32(a: number): () => number {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function scatter(str: string, seed = 1): Scattered {
  const tokens = toTokens(str);
  const key = tokens.map((_, i) => i);
  const rand = mulberry32(seed);
  for (let i = key.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [key[i], key[j]] = [key[j], key[i]];
  }
  return { pool: key.map((k) => tokens[k]), key };
}

export function gather(pool: string[], key: number[]): string {
  if (pool.length !== key.length) throw new RangeError('pool and key length differ');
  const out: string[] = new Array(pool.length);
  key.forEach((k, j) => {
    out[k] = pool[j];
  });
  return out.join('');
}

export default { toTokens, sub, build, plan, scatter, gather };
