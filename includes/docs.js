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

const ga4_events_columns = {
  traffic_source_medium: "Traffic source medium",
  traffic_source_name: "Name of traffic source",
};

const ga4_pseudo_users_columns = {
  pseudo_user_id: "ID for the Pseudonymous namespace",
  stream_id: "Data-stream ID",
  device_category: "Category of the device (mobile, tablet, desktop)"
}

const ga4_pseudo_user_privacy_info_columns = {
  ads_personalization_allowed: "If a user is eligible for ads personalization, isAdsPersonalizationAllowed returns true. If a user is not eligible for ads personalization, isAdsPersonalizationAllowed returns false.",
  ads_tracking_limited: "The device Limit Ad Tracking setting. Possible values include: true, false, and (not set)"
}

module.exports = {ga4_events_columns, ga4_pseudo_users_columns, ga4_pseudo_user_privacy_info_columns};