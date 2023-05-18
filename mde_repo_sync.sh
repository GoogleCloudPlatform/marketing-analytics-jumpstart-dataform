#!/bin/bash

# Copyright 2023 Google LLC
# 
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
#     https://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Constants
readonly CURR_DIR="$(pwd)"
readonly SOURCE="$1"
readonly DESTINATION="$2"
readonly SYNC_BRANCH="sync-$(date +"%Y%m%d-%H%M%S")"

if [[ ! -d "${SOURCE}" ]]; then
  echo "Source directory ${SOURCE} does not exist."
  exit 1
fi

if [[ ! -d "${DESTINATION}" ]]; then
  echo "Destination directory ${DESTINATION} does not exist."
  exit 1
fi

if [[ -f "patch.file" ]]; then
  echo "patch.file already exists. Delete or move patch.file."
  exit 1
fi

echo "Destination ${DESTINATION}"
echo "Source ${SOURCE}"
echo "Sync Branch ${SYNC_BRANCH}"

echo "
================================================================================
Preparing ${DESTINATION} repo.
"

cd "${DESTINATION}"
  
echo "Stashing any uncommited changes prior to pull."
git stash -m "Sync script: Stashing any uncommitted changes prior to pull."
# Pull latest changes to main
git switch main
echo "Pulling latest changes from remote repo."
git pull
# Switch to new feature branch to write changes
git switch -c "${SYNC_BRANCH}"
cd "${CURR_DIR}"
  
echo "
================================================================================
Preparing ${SOURCE} repo.
"

cd "${SOURCE}"

echo "Stashing any uncommited changes prior to pull."
git stash -m "Sync script: Stashing any uncommitted changes prior to pull."
git switch main
echo "Pulling latest changes from remote repo."
git pull
cd "${CURR_DIR}"

echo "
================================================================================
Generating diff file.
"

diff --new-file -ru "${DESTINATION}" "${SOURCE}" --exclude="patch.file" --exclude="dataform.json" --exclude=".git" --exclude=".gitignore" > patch.file

# Check if patch.file is empty; if so remove file and exit program
if [[ ! -s "patch.file" ]]; then
  echo "No changes detected. Exiting program."
  rm patch.file
  exit 0
fi

echo "
================================================================================
Patching diff file.
"
patch -p1 -E -u -d "${DESTINATION}" < patch.file

echo "
================================================================================
Cleaning Up patch.file
"
cd "${CURR_DIR}"
rm patch.file

echo "
================================================================================
Sync Process Complete.

To make these updates available in your destination repo you need to
commit the changes, push them and merge to the right branch, typically "main".

It is recommended you review changes prior to committing.
"