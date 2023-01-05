import pool from '/app/src/lib/db.js'

// const dummyList = [
//   { id: 1, title: 'movie one', director: 'John Dummy'},
//   { id: 2, title: 'movie two', director: 'Bob Dummy'},
// ]

async function getListMovies(req, res) {
  console.log('req.query',JSON.stringify(req.query))
  try {
    const ytsBaseUrl = 'https://yts.mx/api/v2/list_movies.json'

    // Build the query here
    const minimum_rating = 8 // replace 8 for IMDbRating in the query
    const url = `${ytsBaseUrl}?` + `minimum_rating=${minimum_rating}`

    const response = await fetch(url)
    const { data } = await response.json()
    const movies = data.movies.map(m => ({
      // consider extracting more info here
      title:      m.title,
      imdbId:     m.imdb_code,
      year:       m.year,
      imdbRating: m.rating,
      coverUrl:   m.large_cover_image,
      synopsis:   m.synopsis,
      genres:     m.genres,
      torrents:   m.torrents
    }))
    console.log(data)
    return res.status(200).json({
      params: req.query,
      movies: movies
    })
  } catch (error) {
    console.log(error)
  }
}

export { getListMovies }