# matcha #

Web-app to stream torrent with P2P protocol (Popcorn-Time & Netflix-like).

**Installation:**
Prep: Please make sure you have [Docker](https://www.docker.com/) running on your machine (or install if needed, use init_docker.sh script if not working)

1) Delete all previous files in goinfre 
2) ensure docker is installed and purge data  (or even run init_docker shell script if needed) 
3) git clone 
4) make prod-clean
5) go to localhost in browser 


For pgadmin credentials: 
- username: hyper@tube.com
- password: hyper

database credentials:
hostname: postgres
port: 5432
username: hyper

**Stack:**
Node.js, Express, React, Redux, Vite, Tailview and PostgreSQL.
Docker (docker-compose). RESTful API.
Architectural pattern: MVC. 

**Only Project constraint:**
Libraries executing the transfer from a torrent to a video stream are forbidden: use of libraries such as webtorrent, pulsar or peerflix aretherefore considered cheating.
