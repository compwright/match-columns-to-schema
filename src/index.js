const csvObservable = require('./csv');
const { matchColumnsToSchema, readSchemaColumns } = require('./matcher');

class ColumnToSchemaMatcher {
  constructor(csvStream) {
    Object.assign(this, csvObservable(csvStream));
  }

  match(schema) {
    return matchColumnsToSchema({
      schema,
      rows: this.rows,
      columns: this.columns
    });
  }

  read(matchedColumns) {
    return readSchemaColumns({
      matchedColumns,
      rows: this.rows
    });
  }
}

module.exports = ColumnToSchemaMatcher;
