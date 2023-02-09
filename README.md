# matcha #

Web-app to stream torrent with P2P protocol (Popcorn-Time & Netflix-like).

**Installation:**
Prep: Please make sure you have [Docker](https://www.docker.com/) running on your machine (or install if needed, use init_docker.sh script if not working)

1. `git clone https://github.com/lifeBalance/hypertube-express`
2. `make dev` in root directory (takes 3-4 minutes)
3. go to `localhost` in browser

For pgadmin credentials: 
- username: hyper@tube.com
- password: hyper

(Then, add new server, name: hyper. 
then, connection tab, hostname is postgres.)

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

**Deviations relative to subject/eval form**
- (42 omniauth works only in prod)
- when registering with omniauth, password is not editable


**TO DO**
1) Test in prod all eval form, especially the omniauth, and double check in firefox
2) create the page to be able to check all other users' profiles
3) add the omniauth buttons in register page?
4) styling of other users profile

5) Add short text here with explanation for::
- sources for "Search engine must interrogate at least 2 external sources and limit results to videos only."
- Once the movie is entirely downloaded, it must be saved on the server, so that we
don’t need to re-download the movie again. If a movie is unwatched for a month, it will
have to be erased.
- subtitles
- In addition, if the language of the video does not match
the preferred language of the user, and some subtitles are available for this video, they
will need to be downloaded and selectable as well
- When the video isn't readable natively on the browser, it must be
converted on the fly and then streamed. The mkv extension must be
supported at least.
For example this magnet must be streamable: `magnet:?
xt=urn:btih:79816060ea56d56f2a2148cd45705511079f9bca&dn=TPB.AFK.2013.720p.h264-
SimonKlose&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A69
- A video already downloaded (by any user) must be saved on the
server and deleted if unwatched for a month. Obviously, to watch
a video already on the server musn't download it again but
stream the copy on the server.
- If english subtitles are available for the video, they must be
automatically downloaded and activable directly from the player.
If the language of the video isn't the same as the one by default
on the user settings and there is available subtitles, they must
be downloaded automatically and activable from the player
- How our API is RESTful
