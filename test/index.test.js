import test from 'node:test';
import assert from 'node:assert/strict';
import { toTokens, sub, build, plan, scatter, gather } from '../src/index.js';

const url = 'https://api.example.com/v1/users';
const t = toTokens(url);

test('toTokens handles unicode', () => {
  assert.deepEqual(toTokens('a😳b'), ['a', '😳', 'b']);
  assert.throws(() => toTokens(5), TypeError);
});

test('sub single and chained ranges', () => {
  assert.equal(sub(t, 0, 4), 'https');
  assert.equal(sub(t, 23, 25, [26, 31]), '/v1/users');
  assert.equal(sub(t, 0, 4, [5, 7], [8, 18]), 'https://api.example');
});

test('sub negative indexes and single picks', () => {
  assert.equal(sub(t, -5, -1), 'users');
  assert.equal(sub(t, 0, 0, [1], [2]), 'htt');
});

test('sub range errors', () => {
  assert.throws(() => sub(t, 5, 2), RangeError);
  assert.throws(() => sub(t, 0, 999), RangeError);
});

test('build', () => {
  assert.equal(build(t), url);
  assert.equal(build(t, [0, 4], [23, 25]), 'https/v1');
});

test('plan rebuilds a target', () => {
  const r = plan(t, 'api/users');
  assert.equal(build(t, ...r), 'api/users');
  assert.throws(() => plan(t, 'Z'), Error);
});

test('scatter and gather round trip', () => {
  const { pool, key } = scatter(url, 42);
  assert.notEqual(pool.join(''), url);
  assert.equal(gather(pool, key), url);
  assert.deepEqual(scatter(url, 42), scatter(url, 42));
});