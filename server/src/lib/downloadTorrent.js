import torrentStream from 'torrent-stream'

export async function downloadTorrent(movie) {
  // Destructure the movie title and the torrents (array)
  const { imdb_code, quality, hash, title } = movie
  const videoExtensions = ['mp4', 'mkv']

  // Let's start with the first torrent (forget about video quality for now)
  // const hash = torrents[0].hash

  // We gotta build a magnet link, because that's what 'torrent-stream' needs.
  const magnetLink = `magnet:?xt=urn:btih:${hash}&dn=${encodeURIComponent(title)}`
  
  // console.log(magnetLink)  // testing
  
  // Let's set some options for the torrent streaming engine (trackers, path to file)
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
    path: `/app/public/movies/${imdb_code}/${quality}`,
  }

  // Let's initialize the torrent streaming engine
  const engine = torrentStream(magnetLink, torrentStreamOptions)

  engine.on('ready', function () {
    engine.files.forEach(function (file) {
      // By default, no files are downloaded unless we create a stream to them.
      // let stream = file.createReadStream({}) // we'll decide later

      // Check for video extensions; save only video files.
      const extension = file.name.split('.').pop()
      if (videoExtensions.includes(extension)) {
        /* But if we want to fetch a file without creating a stream 
          we can use the file.select and file.deselect methods. */
        file.select() // In theory, this should start the download?
        console.log('torrentStream is saving:', file.name)
        console.log('and file is:', file)
        console.log('and extension is:', extension)
      }
    })
  })
  
  engine.on('iddle', function () {
    // save the path to the DB
  })

  // Here we have to use the engine's events to mark the movie download as complete.
}

