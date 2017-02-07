---
layout: page
permalink: /troubleshooting/
---

### 2016-10-25
* Problem using local import paths for importing CSV files
* **Solved**: Updating `neo4j.conf` file (Source: [http://neo4j.com/docs/operations-manual/current/deployment/file-locations/](http://neo4j.com/docs/operations-manual/current/deployment/file-locations/))
* Installed via apt-get (Ubuntu) go to folder `/etc/neo4j/neo4j.conf`
* Installed via Homebrew (MacOS) go to folder `/usr/local/Cellar/neo4j/3.0.6/`
* Installed manually (MacOS) go to folder `~/Documents/Neo4j`
* Change in the config file the import path to your local repository:

```bash
# OLD
# dbms.directories.import=import
# NEW
dbms.directories.import=/Users/Nicho/GitHub/IVE/data/
```

***

### 2016-10-21
* Upgraded from v3.0.4 to v3.0.6 (MacOS), installation via official website
* Error occurred in Bolt-connection in `server.js`
* All graph data got deleted and the certification was running out
* **Solved**: Deleted line in `/Users/Nicho/.neo4j/known_hosts` for resetting the certification
