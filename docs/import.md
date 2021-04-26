---
layout: page
permalink: /import/
---

#### Overview
1. [For Users](#for-users)
    - [CREATOR](#CREATOR)
2. [For Admins](#for-admins)
    - [Cypher queries](#cypher-queries)
    - [Neo4J data directory](#neo4j-data-directory)
3. [For Developers](#for-developers)
    - [CSV files](#csv-files)
    - [REST-API](#rest-api)

***

The IVE provides different import functionalities to get your data into the system.

<img src="{{ site.baseurl }}/images/import.svg" alt="import options" class="picture" />


# For Users
The [CREATOR]({{ site.baseurl }}/creator/) is the recommended way to create new entries or manage you existing entries.

TODO: document how to encode videos.

---

# For Admins
To restore existing data into a fresh installation, media files and database content need to be set up separately:

## Media files
* If you have imported the CSV files of available scenarios from step 1.2.1. you have to download the required media files
* All content for the IVE (videos, thumbnails and overlay images, etc.) is available on the university cloud storage [Sciebo](https://www.sciebo.de). Please create an account, if you don't have one yet.
* Then create in your repository the following folders:
    * `public/videos`
    * `public/images`
    * `public/thumbnails`
    * `public/objects`
* After that, ask a local team member of the Situated Computing Lab to get access to the online folders of the cloud storage. You can decide which material of the available scenarios you want to download or to download them all. **Attention: Please check out the file sizes of the folders before you actually download them!**

## Neo4j data directory
When restoring a backup or working with docker, it might be easiest to copy the whole neo4j data directory over from an existing installation 
This is located at `/var/lib/neo4j/data` or in neo4j docker at `/data`.

Note: The database needs to be stopped before copying!

## Cypher queries
This option is on the database-level and a direct way to your data via the browser interface of Neo4j. It also provides graph-visualizations and more.

Open <https://localhost:7474> to access the graphical user interface with the built in neo4j-shell.
- If you want to see your full graph, type in the following cypher query:
    ```sql
    MATCH (n) RETURN (n);
    ```

- For inserting your data manually, please find the cypher queries below.

If you want to see all queries, which are used in the IVE, checkout the repository folder [`queries/*`](https://github.com/sitcomlab/IVE/tree/master/queries)

---

# For Developers
To restore existing data into a fresh installation, media files and database content need to be set up separately. See [Media files](#media-files).

## CSV files
The source repo contains an example graph database encoded as CSV in `data/`.
To import this, use the script `node setup.js`.
This is the simplest approach for debugging.

TODO: How to export such CSV files?

### prerequisites
- You need node.js installed, see [here]({{ site.baseurl }}/install/#nodejs).
- You need environment variables or a `.env` file for configuration.
- If you want to import the data from the CSV files of `IVE/data/*`, you need to setup the import-path for Neo4j.
    Open the config file `sudo nano /etc/neo4j/neo4j.conf` and set the directory to the path of your local repository, e.g.:
    ```
    dbms.directories.import=/home/sitcom/IVE/data/
    ```


## REST-API
The [REST API]({{ site.baseurl }}/expansion/#rest-api) can be used as well for data imports.
