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

const uniqueColumns = ga4.browserUniqueColumns;

publish("browser", {
  type: "incremental",
  schema: functions.baseSchema("ga4"),
  description: "Browser dimension",
  uniqueKey: uniqueColumns,
  bigquery: {
    clusterBy: ["browser_id"]
  },
  tags: ['ga4']
  }).query(ctx => 
  `WITH source AS
  (SELECT DISTINCT
    ${uniqueColumns}
  FROM ${ctx.ref("ga4_events")}
  ${ctx.when(ctx.incremental(), `WHERE table_suffix BETWEEN '${ga4.incrementalSuffixStart()}' and '${ga4.incrementalSuffixEnd()}'` )}
  )
SELECT GENERATE_UUID() as browser_id, source.*, CURRENT_TIMESTAMP() as created_ts FROM source
  ${ctx.when(ctx.incremental(), `
  WHERE NOT EXISTS(
    SELECT * FROM ${ctx.self()} target WHERE
    ${sql.multiColumnEqualsClause('source', 'target', uniqueColumns)}
  )
  ` )}
  `);
