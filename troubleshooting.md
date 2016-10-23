# Troubleshooting

***

##### 2016-10-21
* Upgraded from v3.0.4 to v3.0.6 (MacOS), installation via official website
* Error occurred in Bolt-connection in `server.js`
* All graph data got deleted and the certification was running out
* **Solved**: Deleted line in `/Users/Nicho/.neo4j/known_hosts` for resetting the certification
