# Marketing Data Engine Processing

## Overview
This Dataform project processes various marketing data sources and creates a Marketing Data Store (MDS) to be used in several use cases:
* Retain historical marketing data
* Create high performance dashboards
* Perform Data Analytics
* Train ML models

## MDS structure
### Domains
There are currently two domains, Ads domain and GA4 domain. Only GA4 domain is fully functional. 
Ads domain contains initial scripts to process Ads BigQuery Data Transfers, but is not tested.

All assets are tagged with domain-specific tags - "ga4" or "ads".

### Environments
This project is structured to support multiple environments, typically "dev", "stage" and "prod".

### Datasets
Every domain consists of two or more BigQuery datasets. 

"Base" dataset contains views into the source data that are used to process the source data and tables to store the processed data. 
These datasets are named as "marketing_<domain>_base_<env>", e.g., marketing_ga4_base_dev.

"Product" dataset(s) contain only views into the base datasets. These datasets are named as "marketing_<domain>_v<version_number>_<env>", 
e.g., marketing_g4_v1_dev.

Consumers of the domain data should only access data through the product views. This will help with maintaining stable "data interfaces"
across releases of the MDS.

## Configuration
Source datasets and destination datasets are controled by the values in [dataform.json](/dataform.json) file.

### Source datasets
Variables:
* `ga4_export_project` - GA4 project
* `ga4_export_datase` - GA4 dataset
* `ga4_export_table_suffix` - typically `_*`
* `ga4_incremental_processing_days_back` - number of days to look back when processing incremental data. Default is 3.
    
* `ads_export_data` - an array of datasets where Ads data is exported. See the file for the exact syntax.
* `ads_metrics_lookback_days` - number of days to query and load from the Ads Data Transfer Service landing tables to the fact tables for Ads Performance and Ads Conversions. Default is 365.

### Destination datasets
Destination datasets are created in the project specified by `defaultDatabase`.
Environment in the dataset name is defined by `env` variable.
    
## Repo Sync Process

The shell script `mde_repo_sync.sh` is provided in the root directory to assist in synchronizing changes from this repository to your own.
    
It assumes that you have a local directory in your development environment for both repos.

Due to limitations on how the patch process works, it is required that both directories are located in the same parent directory and that relative paths are passed to the script.
    
### Usage
In a Linux command line, execute the script by entering:
`bash mde_repo_sync.sh . ../<destination>`
    
The script is designed to run in the source directory. Destination is the directory of the repository where you want to synchronize changes.

The script will perform the following steps:

**Destination Repo Prep**
1. Stash any uncommitted changes in the current branch of the destination repo
1. Switch to the main branch of the destination repo
1. Pull any changes from the remote of the destination repo
1. Create a new branch named `sync-YYYYMMDD-HHMMSS` based on the execution time that is a copy of the main branch
    
**Source Repo Prep**
1. Stash any uncommitted changes in the current branch of the source repo
1. Switch to the main branch of the source repo
1. Pull any changes from the remote of the source repo
    
**Diff & Patch Changes**
1. Execute a diff command between the two local directories.
    The diff will ignore changes in `dataform.json`, `.gitignore` and the `.git` directory.
1. Write the changes to a file named `patch.file`.
    **Note**: The process will fail ff patch.file already exists. You will need to delete or move the existing file.
1. Patch changes to the destination directory.
1. Delete `patch.file`
    
### Completing the Synchronization
Once the patch is completed, the changes will be uncommitted in the destination directory. You will need to do the following:

1. In the destination directory, add changes using `git add .`
1. Commit the changes to the `sync-YYYYMMDD-HHMMSS` branch using `git commit -m "Meaningful message"`.
1. Push changes to the remote or merge the changes to the main branch using your preferred deployment process.
1. Delete the `sync-YYYYMMDD-HHMMSS` branch when the changes have been merged.
    

#### Example 
Assuming you have a directory structure of:
 - ~/marketing-data-engine-dataform (this repo)
 - ~/our-marketing-data-engine-dataform (a copy of this repo containing your personalized dataform environment)

If you want to synchronize changes from `marketing-data-engine-dataform` to `our-marketing-data-engine-dataform`, you would execute the following:
    
    cd ~/marketing-data-engine-dataform
    bash mde_repo_sync.sh . ../our-marketing-data-engine-dataform
    




