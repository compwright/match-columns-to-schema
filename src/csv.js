const { Observable, ReplaySubject } = require('rxjs');
const { parse } = require('papaparse');

module.exports = stream => {
  const dataSource = Observable.create(observer => {
    let row = 0;
    parse(stream, {
      skipEmptyLines: true,
      step: ({ data }) => {
        observer.next({ index: row++, values: data });
      },
      error: error => observer.error(error),
      complete: () => observer.complete()
    });
  });

  const columns = new ReplaySubject();
  dataSource
    .take(1)
    .map(({ values }) => Observable.of(...values))
    .mergeAll() // flatten array
    .map((name, column) => ({ name, column })) // include 0-based column index
    .subscribe(columns);

  const rows = new ReplaySubject();
  dataSource.skip(1).subscribe(rows);

  return { columns, rows };
};
