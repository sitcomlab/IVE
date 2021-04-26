---
layout: page
permalink: /troubleshooting/
---

### 2021-04-28
neo4j won't start. The logs contain an error like

```
2021-04-26 11:21:13.743+0000 ERROR Failed to start Neo4j: Starting Neo4j failed: Component 'org.neo4j.server.database.LifecycleManagingDatabase@2b830cff' was successfully initialized, but failed to start. Please see attached cause exception. Starting Neo4j failed: Component 'org.neo4
j.server.database.LifecycleManagingDatabase@2b830cff' was successfully initialized, but failed to start. Please see attached cause exception.                                                                                                                                               
org.neo4j.server.ServerStartupException: Starting Neo4j failed: Component 'org.neo4j.server.database.LifecycleManagingDatabase@2b830cff' was successfully initialized, but failed to start. Please see attached cause exception.                                                            
...
...
...
Caused by: java.lang.IllegalStateException: Index entered FAILED state while recovery waited for it to be fully populated
        at org.neo4j.kernel.impl.api.index.IndexingService.awaitOnline(IndexingService.java:348)
        at org.neo4j.kernel.impl.api.index.IndexingService.start(IndexingService.java:328)
        at org.neo4j.kernel.impl.storageengine.impl.recordstorage.RecordStorageEngine.start(RecordStorageEngine.java:430)
        at org.neo4j.kernel.lifecycle.LifeSupport$LifecycleInstance.start(LifeSupport.java:434)
        ... 18 more
```

Only a reboot fixed it.. ¯\\\_(ツ)\_/¯

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
