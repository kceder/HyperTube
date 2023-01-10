import torrentStream from 'torrent-stream'

export async function downloadTorrent(movie) {
  // Destructure the movie title and the torrents (array)
  const { title, torrents } = movie

  // Let's start with the first torrent (forget about video quality for now)
  const hash = torrents[0].hash
  const magnetLink = `magnet:?xt=urn:btih:${hash}&dn=${title.split(' ').join('+')}`
  
  console.log(magnetLink)
}

