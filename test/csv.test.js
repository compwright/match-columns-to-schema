const assert = require('assert');
const csvObservable = require('../src/csv');

describe('csv observable', () => {
  it('is a function', () => {
    assert.strictEqual(typeof csvObservable, 'function');
  });

  it('returns "rows" and a "columns" observables', () => {
    const o = csvObservable(process.stdin);
    assert.ok(o.rows);
    assert.ok(o.columns);
  });
});
