const assert = require('assert');
const fs = require('fs');
const path = require('path');
const ColumnToSchemaMatcher = require('../src');

describe('ColumnToSchemaMatcher', () => {
  describe('.constructor', () => {
    it('is a class constructor', () => {
      assert.strictEqual(typeof ColumnToSchemaMatcher, 'function');
      const m = new ColumnToSchemaMatcher(process.stdin);
      assert.ok(m instanceof ColumnToSchemaMatcher);
    });

    it('expects a readable stream', () => {
      assert.throws(() => new ColumnToSchemaMatcher(), {
        name: 'TypeError',
        message: `Cannot read property 'readable' of undefined`
      });
    });
  });

  describe('.match', () => {
    it('is a function', () => {
      const m = new ColumnToSchemaMatcher(process.stdin);
      assert.strictEqual(typeof m.match, 'function');
    });

    it('matches columns to a schema', async () => {
      const stream = fs.createReadStream(path.resolve(__dirname, '../demo/list.csv'));
      const schema = require('../demo/schema');
      const expect = require('./columns.json');
      const m = new ColumnToSchemaMatcher(stream);
      const matchedColumns = await m.match(schema).toArray().toPromise();
      assert.deepStrictEqual(matchedColumns, expect);
    });
  });

  describe('.read', () => {
    it('is a function', () => {
      const m = new ColumnToSchemaMatcher(process.stdin);
      assert.strictEqual(typeof m.read, 'function');
    });

    it('reads matched row data', async () => {
      const stream = fs.createReadStream(path.resolve(__dirname, '../demo/list.csv'));
      const matchedColumns = require('./columns.json');
      const expect = require('./rows.json');
      const m = new ColumnToSchemaMatcher(stream);
      const rows = await m.read(matchedColumns).take(3).toArray().toPromise();
      assert.deepStrictEqual(rows, expect);
    });
  });
});
