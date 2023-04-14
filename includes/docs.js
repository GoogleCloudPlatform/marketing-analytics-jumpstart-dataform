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

const TRAFFIC_SOURCE_MEDIUM = {
  traffic_source_medium: `Traffic source medium`
};

const TRAFFIC_SOURCE_NAME = {
  traffic_source_name: `Name of traffic source`
};


const ga4_events = {
  ...TRAFFIC_SOURCE_MEDIUM,
  ...TRAFFIC_SOURCE_NAME,
};
module.exports = {
  ga4_events
}