const ColumnToSchemaMatcher = require('../src');
const schema = require('./schema');

// 1. Take 100 entries from each column
// 2. Validate the entries against each schema field
// 3. Exclude column matches where < 95% of entries pass validation, unless 100% blank
// 4. Take column similarity score against each column name and alias name
// 5. Rank by similarity score
// 6. Pick the top-ranked unique column match for each schema field

const matcher = new ColumnToSchemaMatcher(process.stdin);

matcher
  .match(schema)
  .toArray()
  .subscribe(matchedColumns => {
    console.log('Matched columns to schema:');
    console.log(JSON.stringify(matchedColumns, null, 2));

    console.log('\nFirst three rows of data matched to schema:');
    matcher
      .read(matchedColumns)
      .take(3)
      .toArray()
      .subscribe(rows => console.log(JSON.stringify(rows, null, 2)));
  });
