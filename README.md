# HyperTube - Web app for torrent streaming  🍿

## This project was done for educational purposes only is not deployed publicly

Web-app to stream torrent with P2P protocol (Popcorn-Time & Netflix-like).

**Installation:**
Prep: Please make sure you have [Docker](https://www.docker.com/) running on your machine (or install if needed, use init_docker.sh script if not working)

1) Delete all files in goinfre / documents
2) ensure docker is installed and purge data  (or even run init_docker shell script if needed) 
3) git clone 
4) make prod-clean
5) go to localhost in browser 

Note: each video on average takes 5-10 minutes of download to be able to start playing


**How to access database**
- http://localhost:8080/
- login with pgadmin credentials: 
  - username: hyper@tube.com
  - password: hyper

- Add a new server and with these credentials:
  - server details: name: hyper
- switch to connection tab and with these connection credentials: 
  - hostname: postgres
  - port: 5432
  - username: hyper
  - password: hyper
- expand hyper > schemas > public > tables >
- click on "view data" icon

**Stack:**
Node.js, Express, React, Redux, Vite, Tailview and PostgreSQL.
Docker (docker-compose). RESTful API.
Architectural pattern: MVC. 

**Only Project constraint:**
Libraries executing the transfer from a torrent to a video stream are forbidden: use of libraries such as webtorrent, pulsar or peerflix aretherefore considered cheating.

**Comments about the eval form and our test coverage/results**
We reviewed the eval form and based on our tests we comply with all points, apart from:
- Search engine must interrogate at least 2 external sources --> apparently all projects only used one
- Video conversion: For example this magnet must be streamable: --> we were not able to make it work.

Apart from these 2 points, all good, and we guarantee all works up to 10 movie downloads at same time (above this, there will be space issues in school computers and also slows down requests). 

We have 2 bonuses: 
- Website is translated
- Advanced search (genre, keyword, min rating) 
