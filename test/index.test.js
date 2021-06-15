import fs from 'fs';
import path from 'path';
import ColumnToSchemaMatcher from '../src';

describe('.constructor', () => {
  test('is a class constructor', () => {
    expect(typeof ColumnToSchemaMatcher).toBe('function');
    const m = new ColumnToSchemaMatcher(process.stdin);
    expect(m).toBeInstanceOf(ColumnToSchemaMatcher);
    process.stdin.pause();
  });

  test('expects a readable stream', () => {
    expect(() => new ColumnToSchemaMatcher()).toThrow({
      name: 'TypeError',
      message: 'Cannot read property \'readable\' of undefined'
    });
  });
});

describe('.match', () => {
  test('is a function', () => {
    const m = new ColumnToSchemaMatcher(process.stdin);
    expect(typeof m.match).toBe('function');
    process.stdin.pause();
  });

  test('matches columns to a schema', async () => {
    const stream = fs.createReadStream(path.resolve(__dirname, '../demo/list.csv'));
    const schema = require('../demo/schema');
    const m = new ColumnToSchemaMatcher(stream);
    const matchedColumns = await m.match(schema).toArray().toPromise();
    expect(matchedColumns).toEqual(require('./columns.json'));
  });
});

describe('.read', () => {
  test('is a function', () => {
    const m = new ColumnToSchemaMatcher(process.stdin);
    expect(typeof m.read).toBe('function');
    process.stdin.pause();
  });

  test('reads matched row data', async () => {
    const stream = fs.createReadStream(path.resolve(__dirname, '../demo/list.csv'));
    const matchedColumns = require('./columns.json');
    const m = new ColumnToSchemaMatcher(stream);
    const rows = await m.read(matchedColumns).take(3).toArray().toPromise();
    expect(rows).toEqual(require('./rows.json'));
  });
});
