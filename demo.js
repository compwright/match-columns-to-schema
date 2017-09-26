const csvObservable = require('./csv')
const { matchColumnsToSchema, readSchemaColumns } = require('./matcher')
const schema = require('./schema')

const source = csvObservable(process.stdin);

const result = {
    columns: [],
    rows: []
}

// 1. Take 100 entries from each column
// 2. Validate the entries against each schema field
// 3. Exclude column matches where < 95% of entries pass validation, unless 100% blank
// 4. Take column similarity score against each column name and alias name
// 5. Rank by similarity score
// 6. Pick the top-ranked unique column match for each schema field

matchColumnsToSchema({ schema, ...source }).toArray().subscribe((columns) => {
    console.log('Matched columns to schema:')
    console.log(JSON.stringify(columns, null, 2))
    //readSchemaColumns({ matchedColumns: columns, ...source }).subscribe(...)
})
