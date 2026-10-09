export type Range = [start: number, end?: number];

export interface Scattered {
  pool: string[];
  key: number[];
}

/** Convert a string into an array of single characters (unicode safe). */
export function toTokens(str: string): string[];

/** Join inclusive ranges. Negative indexes count from the end. */
export function sub(tokens: string[], start: number, end: number, ...more: Range[]): string;

/** Build a string from [start, end] ranges. No ranges returns everything. */
export function build(tokens: string[], ...ranges: Range[]): string;

/** Find ranges that rebuild `target` from the tokens. */
export function plan(tokens: string[], target: string): [number, number][];

/** Seeded shuffle. Keep `pool` and `key` to rebuild with gather(). */
export function scatter(str: string, seed?: number): Scattered;

/** Rebuild the original string from scatter() output. */
export function gather(pool: string[], key: number[]): string;

declare const _default: {
  toTokens: typeof toTokens;
  sub: typeof sub;
  build: typeof build;
  plan: typeof plan;
  scatter: typeof scatter;
  gather: typeof gather;
};
export default _default;
