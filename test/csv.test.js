import { ReplaySubject } from 'rxjs';
import csvObservable from '../src/csv';

test('is a function', () => {
  expect(typeof csvObservable).toBe('function');
});

test('returns "rows" and a "columns" observables', () => {
  const o = csvObservable(process.stdin);
  expect(o.rows).toBeInstanceOf(ReplaySubject);
  expect(o.columns).toBeInstanceOf(ReplaySubject);
  process.stdin.pause();
});
