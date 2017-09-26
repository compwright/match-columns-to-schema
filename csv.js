const readline = require('readline')
const csv = require('csv-string')
const {Observable, ReplaySubject} = require('rxjs')
const RxNode = require('rx-node-vx')

module.exports = (stream) => {
    const lineStream = readline.createInterface({ input: stream })    

    const dataSource = new ReplaySubject()
    const columns = new ReplaySubject()
    const rows = new ReplaySubject()
    
    const csvSource = RxNode.fromReadLineStream(lineStream)
        .map((row, index) => ({ index, values: csv.parse(row)[0] }))
        .subscribe(dataSource)

    dataSource.take(1)
        .map(({ values }) => Observable.of(...values)).mergeAll() // flatten array
        .map((name, column) => ({ name, column })) // include 0-based column index
        .subscribe(columns)

    dataSource.skip(1)
        .subscribe(rows)

    return { columns, rows }
}
