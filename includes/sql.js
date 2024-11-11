/*
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

//List of enumerated web browsers for session device metrics
const dashboardWebBrowsers = [
    "Android",
    "Chrome",
    "Edge",
    "Firefox",
    "Opera",
    "Safari",
    "Samsung"
];

function webBrowserCaseStatement(browsers,column){
    let result = "CASE";

    browsers.forEach(function(browser) {
        result = result.concat("\n\t\t\t" + `WHEN STARTS_WITH(UPPER(${column}),"${browser.toUpperCase()}") THEN '${browser}'`)
    })
    result = result.concat("\n\t\t\t" + "ELSE '<Other>'" + "\n\t\t" + "END")
    return result;

};
function multiColumnEqualsClause(sourceTable, targetTable, columns) {
    var result = "";
    columns.forEach(column => {
        if( result.length > 0) {
            result = result + ' AND ';
        }
        result = result + '\n  ' + sourceTable + '.' + column + '=' + targetTable + '.' + column;
    })
    return result;
}

function parseIsoWeekYear(date_column, date_format){
    const result = `CONCAT(EXTRACT(isoyear FROM PARSE_DATE("${date_format}",${date_column})),'-',EXTRACT(isoweek FROM PARSE_DATE("${date_format}",${date_column})))`;
    return result;
}

function isoYearWeekColumn(date_column){
    const result = `CONCAT(EXTRACT(ISOYEAR FROM ${date_column}), "-", EXTRACT(ISOWEEK FROM ${date_column}))`
    return result;

}

function percentChangeColumn(metric, granularity){
    const result = `((${metric} - (LAG(${metric}) OVER (ORDER BY ${granularity}))) / LAG(${metric}) OVER (ORDER BY ${granularity}))`
    return result;
}

function aggregatedVBBColumns(eventDateField, eventDateAlias, eventNameField, columns) {
    let result = `${eventDateField} AS ${eventDateAlias}`;
    for(const event_type in columns) {
        result = result + `,\n  COUNTIF(${eventNameField} = "${event_type}") AS ${columns[event_type]}`;
    }
    return result;
}

function selectFieldsFromRepeatedRecord(fieldName, columns, safe_cast_columns) {
    let result = "";
    const tmpAlias = `${fieldName}ta`;
    const doubleSpace = "  "
    columns.forEach(column => {
        if(result.length > 0) {
            result = result + ',\n';
        }
        result = result + `${doubleSpace}${doubleSpace}`;
        if(column in safe_cast_columns) {
            result = result + 'SAFE_CAST(';
        }
        result = result + `${tmpAlias}.${column}`;
        if(column in safe_cast_columns) {
            result = result + ` AS ${safe_cast_columns[column]})`;
        }
        result = result + ` AS ${column}`;
    })
    return 'ARRAY( SELECT STRUCT (\n' + result + `\n${doubleSpace}) FROM UNNEST(${fieldName}) AS ${tmpAlias} ) AS ${fieldName}`;
}

function selectMultiColumnFromFirstEntry(table_alias, sorting_column, sorting_order, columns) {
    let result = "";
    columns.forEach(column => {
        if( result.length > 0) {
            result = result + ',\n  ';
        }
        result = result + 'ARRAY_AGG('+table_alias+' ORDER BY '+sorting_column+' '+sorting_order+' LIMIT 1)[OFFSET(0)].'+column+' AS '+column;
    });
    return result;
}
module.exports = {multiColumnEqualsClause, parseIsoWeekYear,
isoYearWeekColumn, percentChangeColumn, dashboardWebBrowsers,
webBrowserCaseStatement, aggregatedVBBColumns,
selectFieldsFromRepeatedRecord, selectMultiColumnFromFirstEntry};
