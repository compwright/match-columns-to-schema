import { max } from 'd3-array/dist/d3-array';
import { Observable, ReplaySubject } from 'rxjs';
import stringSimilarity from 'string-similarity';

export function matchColumnsToSchema ({ schema, columns, rows }) {
  // ReplaySubject observable for each column with up to 100 non-blank column values
  const columnsWithValues = new ReplaySubject();
  columns
    .mergeMap(column =>
      columnValues(rows, column.column, 100)
        .toArray()
        .map(values => ({ values, ...column }))
    )
    .subscribe(columnsWithValues);

  // Match each column against the schema
  const schemaFields = Object.entries(schema).map(
    ([field, { aliases, validator }]) => {
      return (
        (validator ? columnsWithValues : columns)
          .map(({ name, column, values }) => ({
            field,
            header: name,
            index: column,
            similarityScore: max(stricmpArray(name, [field].concat(aliases))),
            validationScore: validator
              ? validationScore(values, validator)
              : Infinity
          }))
          // exclude non-matches and validation score < 95%
          .filter(({ similarityScore }) => similarityScore > 0)
          .filter(({ validationScore }) => validationScore > 0.95)
          .toArray()
          .map(columns => ({
            field,
            columns: columns.sort((a, b) => {
              // Sort by similarityScore (descending), index (ascending)
              return b.similarityScore - a.similarityScore !== 0
                ? b.similarityScore - a.similarityScore
                : a.index - b.index;
            })
          }))
      );
    }
  );

  const picked = [];

  return Observable.merge(...schemaFields).map(({ columns }) => {
    // Map columns to schema fields 1:1
    for (const { field, header, index } of columns) {
      if (!picked.includes(index)) {
        return { field, header, index };
      }
    }
    return {};
  });
}

export function readSchemaColumns ({ columns, rows, matchedColumns, includeUnmatched = true }) {
  // rows<Observable>
  return rows.map(({ values, index }) => {
    // values<Array>

    const row = {
      $index: index
    };

    matchedColumns.forEach(({ field, index }) => {
      const value = values[index];
      if (value) row[field] = value; // exclude blank fields
    });

    if (includeUnmatched) {
      row.$unmatched = {};

      columns.forEach(({ column, index }) => {
        const value = values[index];
        if (value) row.$unmatched[column] = value;
      });
    }

    return row;
  });
}

// Get a dense array of column values for validation
function columnValues (rows, index, limit = Infinity) {
  const observer = rows.map(({ values }) => values[index]).filter(str => !!str);

  return limit < Infinity ? observer.take(limit) : observer;
}

// Percentage of column values that pass column validation
function validationScore (values, validator) {
  const validations = values.map(validator).map(Number);

  return validations.length > 0
    ? validations.reduce((sum, value) => sum + value) / validations.length
    : Infinity;
}

// Compare a string to an array of strings (case-insensitive)
const stricmpArray = (a, bs = []) =>
  bs
    .filter(b => b)
    .map(b =>
      stringSimilarity.compareTwoStrings(a.toLowerCase(), b.toLowerCase())
    );
