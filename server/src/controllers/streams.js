import { findMovie, saveMovie, setCompleteMovie } from '../models/download.js'
import { downloadTorrent } from '/app/src/lib/downloadTorrent.js'
import fs from 'fs'

async function getStream(req, res) {
  try {
    const { id: imdb_id, quality, hash } = req.params
    // console.log(imdb_id, quality, hash) // testing

    // Things common for streaming from torrent or filesystem
    const range = req.headers.range
    if (!range) {
      console.log('no range bro') // testing
      return res.status().json({
        error: 'No range provided',
      })
    }
    const start = Number(range.replace(/\D/g, ''))
    const CHUNK_SIZE = 10 ** 6 // 1MB
    // console.log(`range: ${range}, start: ${start}`) // testing

    const movieExists = await findMovie({ imdb_id, quality })

    /* In case the movie exists in the DB, and it's been
      downloaded completedly we start streaming it.*/
    if (movieExists && movieExists.completed) {
      const videoPath = movieExists.path
      const videoSize = movieExists.size

      // console.log(`videoSize: ${videoSize} bytes`) // testing
      const end = Math.min(start + CHUNK_SIZE, videoSize - 1)
      // console.log(`end: ${end} byte position`)
      const contentLength = end - start + 1

      // Set Headers of our response
      const headers = {
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentLength,
        'Content-Type': 'video/mp4',
      }
      // Sometimes the start doesn't make sense, so we have to:
      if (start > videoSize - 1) {
        start = 0
        res.writeHead(416, headers) // Range Not Satisfiable
      } else res.writeHead(206, headers) // Partial content
      const videoStream = fs.createReadStream(videoPath, { start, end })

      videoStream.pipe(res)
      /* Here We should update the 'last_watched' 
        column for the movie with the current time. */
    } else {
      // In case the movie does NOT exist in the DB, we start downloading it
      // and streaming it. When is downloaded, we set it to 'completed' in the database.
      await downloadTorrent({
        imdb_id,
        quality,
        hash,
        start,
        CHUNK_SIZE,
        movieExists,
        res,
      })
    }
  } catch (error) {
    console.log(error)
  }
}

export { getStream }
