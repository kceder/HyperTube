import torrentStream from 'torrent-stream'

export async function downloadTorrent(movie) {
  // Destructure the movie title and the torrents (array)
  const { title, torrents, imdb_code } = movie

  // Let's start with the first torrent (forget about video quality for now)
  const hash = torrents[0].hash
  const magnetLink = `magnet:?xt=urn:btih:${hash}&dn=${title.split(' ').join('+')}`
  
  // console.log(magnetLink)  // testing
  // Let's set some options for the torrent streaming engine
  const torrentStreamOptions = {
    // Trackers recommended by YTS (check movie details page)
    trackers: [
      'udp://open.demonii.com:1337/announce',
      'udp://tracker.openbittorrent.com:80',
      'udp://tracker.coppersurfer.tk:6969',
      'udp://glotorrents.pw:6969/announce',
      'udp://tracker.opentrackr.org:1337/announce',
      'udp://torrent.gresille.org:80/announce',
      'udp://p4p.arenabg.com:1337',
      'udp://tracker.leechers-paradise.org:6969',
    ],
    // Path in our server where we want to keep our movies
    path: `/app/public/movies/${imdb_code}`,
  }
  // Let's initialize the torrent streaming engine
  const engine = torrentStream(magnetLink, torrentStreamOptions)

  engine.on('ready', function () {
    engine.files.forEach(function (file) {
      console.log('torrentStream is doing something with:', file.name)
      // By default, no files are downloaded unless we create a stream to them.
      // let stream = file.createReadStream({}) // we'll decide later

      /* But if we want to fetch a file without creating a stream 
        we can use the file.select and file.deselect methods. */
      file.select() // In theory, this should start the download?
    })
  })
}

