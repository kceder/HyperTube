import torrentStream from 'torrent-stream'
import fs from 'fs'
import { saveMovie, setCompleteMovie } from '../models/download.js'

export async function downloadTorrent(movie, res) {
  new Promise(function (resolve) {
    // Destructure the movie title and the torrents (array)
    const { imdb_id, quality, hash, start, CHUNK_SIZE, movieExists } = movie
    const videoExtensions = ['mp4', 'mkv', 'webm']
    let filePath // path to the video file (inside `/app/public/movies`)
    let newMovie // store all the video file data we write to the DB

    // We gotta build a magnet link, because that's what 'torrent-stream' needs.
    // const magnetLink = `magnet:?xt=urn:btih:${hash}&dn=${encodeURIComponent(title)}`
    const magnetLink = `magnet:?xt=urn:btih:${hash}` // Only the hash is strictly necessary
    
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
      path: `/app/public/movies/${imdb_id}/${quality}`,
    }

    // Let's initialize the torrent streaming engine
    const engine = torrentStream(magnetLink, torrentStreamOptions)

    // When all of the torrent files are available, 'torrent' event is triggered
    engine.on('torrent', function () {
      engine.files.forEach(async function (file) {
        // Check for video extensions; save only video files.
        const extension = file.name.split('.').pop()

        if (videoExtensions.includes(extension)) {
          filePath = `/app/public/movies/${imdb_id}/${quality}/${file.path}`
          // Save download information to DB
          if (!movieExists) {
            try {
              newMovie = await saveMovie({
                imdb_id,
                quality,
                completed: false,
                path: filePath,
                size: file.length,
                last_watched: +new Date() // Unix time in milliseconds
              })
              console.log(`new movie saved to DB:`, newMovie) // test
            } catch (error) {
              console.log(error)
            }
          }
          const end = Math.min(start + CHUNK_SIZE, file.length - 1)
          const contentLength = end - start + 1

          /* By default, no files are downloaded unless we create a stream to
          them.But if we want to fetch a file without creating a stream 
          we can use the 'file.select' and 'file.deselect' methods. */
          file.select() // This starts the download
          let stream = file.createReadStream({ start, end }) // we'll decide later
          // Set Headers of our response
          const headers = {
            'Content-Range': `bytes ${start}-${end}/${file.length}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': contentLength,
            'Content-Type': 'video/mp4'
          }
          res.writeHead(206, headers) // Partial content

          stream.pipe(res)
          console.log('torrentStream is processing:', file.name)
          console.log('file path is:', file.path)
          console.log('and extension is:', extension)
        }
      })
    })

    // engine.on('download', () => {
		// 	if (fs.existsSync(filePath) &&
    //       fs.statSync(filePath.size / (1024 * 1024) > 25))
    //   {
    //     console.log('wuawuaweewa') //testing
    //     resolve(newMovie)
    //   }
		// })

    engine.on('idle', async function () {
      // Here we use the engine's 'iddle' event to set the download as complete.
      const result = await setCompleteMovie({ imdb_id, quality })
      console.log('Completed?', JSON.stringify(result)) // testing
    })
  }) 
}
