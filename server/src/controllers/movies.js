import pool from '/app/src/lib/db.js'

async function getListMovies(req, res) {
  console.log('req.query',JSON.stringify(req.query))

  // Destructure the query
  const {
    page,
    minimum_rating,
    genre,
    query_term
  } = req.query
  try {
    const ytsBaseUrl = 'https://yts.mx/api/v2/list_movies.json'

    // Build the query here
    let url = `${ytsBaseUrl}?` + `&page=${+page}`
    if (+minimum_rating > 0) {
      // console.log('added minimum_rating', minimum_rating, typeof minimum_rating)
      url += `&minimum_rating=${+minimum_rating}`
    }

    if (genre !== 'all' && genre !== 'null') {
      // console.log('added genre', genre, typeof genre)
      url += `&genre=${genre}`
    }

    if (query_term && query_term !== '' && query_term !== 'null') {
      // console.log('added query_term', query_term, typeof query_term)
      url += `&query_term=${query_term}`
    }

    const response = await fetch(url)
    const { data } = await response.json()
    
    if (data.movie_count === 0) {
      // console.log(data) //  testing
      
      return res.status(200).json({
        params: req.query,
        error: 'no movies found'
      })
    }

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
    // console.log(movies)
    return res.status(200).json({ movies })
  } catch (error) {
    console.log(error)
  }
}

export { getListMovies }