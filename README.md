# srTokens

npm package: `string-range-tokens`

Turn any string into a letter-per-index token array, then rebuild words, paths or URLs from index ranges.

Zero dependencies, plain ESM, works in Node 18+ and the browser. Ships a JavaScript implementation, a TypeScript implementation and type definitions.

## Install

```bash
npm i string-range-tokens
```

Or copy `src/index.js` (or `src/index.ts`) into your project. No build step.

## JavaScript and TypeScript

```js
// JavaScript (types come for free via index.d.ts)
import { toTokens, sub } from 'string-range-tokens';
```

```ts
// TypeScript
import { toTokens, sub, type Range } from 'string-range-tokens';

const ranges: Range[] = [[26, 31]];
sub(toTokens('https://api.example.com/v1/users'), 23, 25, ...ranges);
```

The TypeScript source lives in `src/index.ts` and is also exported as `string-range-tokens/ts` for runtimes that run TS directly (Deno, Bun, Node with type stripping).


### CDN: jsdelivr

```js
  import { toTokens, sub, build, plan, scatter, gather } from 'https://cdn.jsdelivr.net/npm/string-range-tokens@1.0.0/src/index.js';

```

## Usage

```js
import { toTokens, sub, build, plan, scatter, gather } from 'string-range-tokens';

const t = toTokens('https://api.example.com/v1/users');

sub(t, 0, 4);                 // "https"
sub(t, 23, 25, [26, 31]);     // "/v1/users"
sub(t, -5, -1);               // "users"
build(t, [0, 4], [23, 25]);   // "https/v1"
```



### API

| Function | What it does |
| --- | --- |
| `toTokens(str)` | String to array of single characters (unicode safe) |
| `sub(tokens, start, end, ...[s, e])` | Join inclusive ranges. Negative indexes count from the end. `[i]` picks one token |
| `build(tokens, ...[s, e])` | Same, ranges only. No ranges returns the whole string |
| `plan(tokens, target)` | Finds ranges that rebuild `target` from the tokens |
| `scatter(str, seed)` | Seeded shuffle, returns `{ pool, key }` |
| `gather(pool, key)` | Rebuilds the string from `scatter` output |

### Build a word from a pool of letters

```js
const pool = toTokens('the quick brown fox');
const ranges = plan(pool, 'brew');
build(pool, ...ranges); // "brew"
```

### Scatter and gather

```js
const { pool, key } = scatter('/api/orders', 7);
gather(pool, key); // "/api/orders"
```

## Use cases

- Assemble API paths and keys from shared token pools
- Pick substrings by position without regex
- Tiny string templating from a fixed alphabet
- Teaching and puzzles around indexing and recursion

## Security note

This is string assembly, not encryption. Anything shipped to a browser can be read by the user. Never hide real secrets or API keys with it. Keep them server side (Netlify Functions, Workers, etc).

## Test

```bash
npm test
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT, see [LICENSE](LICENSE).



