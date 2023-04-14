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

function buildViewUnion(columns, system, table_prefix, lookback_days){
    var output = "";

    var tables = constants.settings[system];

    tables.forEach( function (table_ref, index) {
        var table_name = "`" + table_ref["project"] + "`." + table_ref["dataset"] + ".`" + table_prefix + table_ref["table_suffix"] + "`"
        if ( index > 0 ) {
            output = output.concat("\n  UNION ALL\n")
        }
        output = output.concat("  SELECT DISTINCT\n    ", columns, "\n  FROM ", table_name)
        if ( typeof lookback_days !== "undefined" ){
            output = output.concat("\n  WHERE _PARTITIONTIME > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL ", lookback_days, " DAY) ")
        }
    });

    return output;
}

function baseSchema(domain) {
    return dataform.projectConfig.defaultSchema + "_" + domain + "_base_" + dataform.projectConfig.vars.env;
}

function productSchema(domain) {
    return dataform.projectConfig.defaultSchema + "_" + domain + "_v1_" + dataform.projectConfig.vars.env;
}

module.exports = {buildViewUnion,baseSchema, productSchema};