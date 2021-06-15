import csvObservable from './csv';
import { matchColumnsToSchema, readSchemaColumns } from './matcher';

class ColumnToSchemaMatcher {
  constructor (csvStream) {
    Object.assign(this, csvObservable(csvStream));
  }

  match (schema) {
    return matchColumnsToSchema({
      schema,
      rows: this.rows,
      columns: this.columns
    });
  }

  read (matchedColumns) {
    const matchedIndexes = matchedColumns.map(({ index }) => index);

    return this.columns
      .map(({ name, column }) => ({ column: name, index: column }))
      .filter(({ index }) => !matchedIndexes.includes(index))
      .toArray()
      .mergeMap(columns =>
        readSchemaColumns({
          columns,
          rows: this.rows,
          matchedColumns
        })
      );
  }
}

export default ColumnToSchemaMatcher;
