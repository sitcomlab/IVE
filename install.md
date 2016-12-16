---
layout: page
permalink: /install/
---

### Overview

1. [Graph database](#graph-database)
    1. [Neo4j](#neo4j)
    2. [Import graph](#import-graph)
2. [IVE](#ive)
    1. [Git/GitHub](#gitgithub)
    2. [GitHub repository](#github-repository)
    3. [Nodejs](#nodejs)
    4. [Bower](#bower)
3. [Documentation](#documentation)

***

# 1. Graph database

### 1.1. Neo4j

* Go to [https://neo4j.com/download/](https://neo4j.com/download/) and download the latest community-version of Neo4j. If you are on Linux, like Ubuntu, make sure, that you have Java 8 installed, which is not included in Ubuntu 14.04 LTS or Debian 8 (Jessie).
* If you are on macOS you can alternatively use Homebrew ([http://brew.sh/index_de.html](http://brew.sh/index_de.html)) to install Neo4j:
* Install and run Neo4j
* Open the UI in webbrowser: [http://localhost:7474](http://localhost:7474)
* If you have installed it on a Ubuntu Server, you might need to open the port, so that you can access the UI on your host. Open the config file: `sudo nano /etc/neo4j/neo4j.conf` and change the following lines like this:

```
# HTTP Connector
dbms.connector.http.type=HTTP
dbms.connector.http.enabled=true
# To accept non-local HTTP connections, uncomment this line
dbms.connector.http.address=0.0.0.0:7474

# HTTPS Connector
dbms.connector.https.type=HTTP
dbms.connector.https.enabled=true
dbms.connector.https.encryption=TLS
# To accept non-local HTTPS connection, change 'localhost' to '0.0.0.0'
dbms.connector.https.address=localhost:7473
```

* Restart Neo4j with `sudo neo4j restart` and open the UI in webbrowser again. If you have access it for the first time, you need to create a username (`neo4j`) and password (`neo4j`) for your database.

### 1.2. Import graph

* If you want to import the data from the CSV files of `IVE/data/*`, you need to setup the import-path in Neo4j. Open the config file `sudo nano /etc/neo4j/neo4j.conf` and set the directory to the path of your local repository:

```
dbms.directories.import=/Users/sitcomlab/IVE/data/
```

* After this step, you need to define some CONSTRAINTS inside the database. Open the GUI in your webbrowser and execute the following Cypher commands (**one by one**) in the Neo4j-shell (for resetting, you can find the commands also in  `IVE/install/import.cypher`):

```
CREATE CONSTRAINT ON (scenario:Scenarios) ASSERT scenario.s_id IS UNIQUE;

CREATE CONSTRAINT ON (location:Locations) ASSERT location.l_id IS UNIQUE;

CREATE CONSTRAINT ON (video:Videos) ASSERT video.v_id IS UNIQUE;

CREATE CONSTRAINT ON (overlay:Overlays) ASSERT overlay.o_id IS UNIQUE;
```

* After this step, you can import the data from the CSV files. Run all Cypher commands (**one by one**) from the file `IVE/install/import.cypher`.

* Check if your data has been imported with the Cypher query:

```
MATCH (n) RETURN n;
```

***

# 2. IVE

### 2.1. Git/GitHub
* If you have Git already installed, you can use the CLI in your terminal.

* Install Git: [https://git-scm.com](https://git-scm.com)

* Install the GitHub client: [https://desktop.github.com](https://desktop.github.com)

### 2.2. GitHub repository

* Clone the repository to your local (run the command with `sudo`, if you don't have permission):

```
git clone https://github.com/sitcomlab/IVE.git
```

* **If you want to develop or extend the IVE, please make a fork as first and send after your implementation a pull-request!**

### 2.3. Nodejs

* Install Nodejs: [https://nodejs.org](https://nodejs.org)
* Install required node-modules from the `IVE/package.json` inside the repository (run the command with `sudo`, if you don't have permission):

```
node npm install
```

### 2.4. Bower

* Install Bower via **npm** (run the command with `sudo`, if you don't have permission):

```
node npm bower -g
```

* Install required bower_components from the `IVE/bower.json`:

```
bower install
```

* If you need root-permission, install dependencies with this command:

```
sudo bower install --allow-root
```

### (Server-settings)

* If you have installed the IVE on a Linux server, you can create a cronjob to automatically start Neo4j and the server after a reboot. Open `sudo nano /etc/crontab` and add the following lines:

```
# Start Neo4j
@reboot         root    neo4j restart

# Start IVE
@reboot         root    cd /home/<username>/IVE && PORT=4000 USERNAME=<NEO4J> PW=<NEO4J> node server.js >> log.txt
```

***

# 3. Start the IVE

* Open a webbrowser and go to [http://localhost:4000](http://localhost:4000/) (there is also a **dark-version** for production: [http://localhost:4000/ive.html](http://localhost:4000/ive.html))

* Open the **FRONTEND** in a new tab ([http://localhost:4000/frontend](http://localhost:4000/frontend)))
* Open the **REMOTE CONTROL APP** in a new tab or on your smartphone ([http://localhost:4000/remote](http://localhost:4000/remote)))
* In the remote app, select a Scenario from the list
* After that, select a starting location

Have fun!

***

# 4. Documentation

* If you want to contribute to this documentation, you need to install Jekyll ([https://jekyllrb.com/docs/installation/](https://jekyllrb.com/docs/installation/)) your local machine. Attention: Jekyll is not officially supported by Windows. Please follow the instructions on their website.
* Switch to the `gh-pages` branch in you local repository:

```
git checkout gh-pages
```

* Run Jekylls-built-in-server with the following command (run it with `sudo`, if you don't have permission):

```
jekyll serve
```

* Open a webbrowser and go to: [http://localhost:4000/](http://localhost:4000/)
* Open the markdown files and start writing.
* If you want to write a blog-post, create a new `.md` file inside the folder `_posts` with the name `YYYY-MM-DD-TOPIC`, e.g. `2016-10-23-Introducing-v2.md`.
* For adding new (static) pages, please read the documentation and make sure that you have set a header-section and added (static) page to the `_config.yml` file.
