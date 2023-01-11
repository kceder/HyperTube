import pool from '/app/src/lib/db.js'
import { downloadTorrent } from '/app/src/lib/downloadTorrent.js'
import fs from 'fs'

async function getStream(req, res) {
  try {
    const range = req.headers.range
    const start = Number(range.replace(/\D/g, ''))
    console.log(`range: ${range}, start: ${start}`) // testing
    console.log(typeof start);

    if (!range) {
      return res.status().json({
        error: 'No range provided',
      })
    }

    // Hardcode it for now
    const videoPath = '/app/public/movies/tt23806336/willSisters.mp4'
    const videoSize = fs.statSync(videoPath).size
    console.log(`videoSize: ${videoSize} bytes`)
    const CHUNK_SIZE = 10 ** 6 // 1MB
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1)
    console.log(`end: ${end} byte position`)
    const contentLength = end - start + 1

    // Set Headers of our response
    const headers = {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-Type': 'video/mp4'
    }
    res.writeHead(206, headers) // Partial content
    const videoStream = fs.createReadStream(videoPath, { start, end })

    videoStream.pipe(res)
  } catch (error) {
    console.log(error)
  }
}

export { getStream }
