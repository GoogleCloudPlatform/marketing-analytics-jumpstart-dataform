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
* `ads_metrics_lookback_days` - number of days to calculate Ad metrics in the dashboard reports. Default is 365.

### Destination datasets
Destination datasets are created in the project specified by `defaultDatabase`.
Environment in the dataset name is defined by `env` variable. 



