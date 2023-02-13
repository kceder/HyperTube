// import pool from '/app/src/lib/db.js'
// import { downloadTorrent } from '/app/src/lib/downloadTorrent.js'
import { checkIfWatched, markAsWatched } from '../models/watchedHistory.js'

import { getComments } from '../models/comment.js'

async function getListMovies(req, res) {
  // Destructure the query
  const { page, minimum_rating, genre, query_term, sort_by, order_by } =
    req.query

  const uid = req.uid // wired up authentication
  // const uid = 1    // testing

  try {
    const ytsBaseUrl = 'https://yts.mx/api/v2/list_movies.json'

    // Build the query here
    let url = `${ytsBaseUrl}`
    if (+page > 1) {
      // console.log('requested page', page)
      url += `?page=${+page}`
    } else {
      // console.log('requested page', page)
      url += '?page=1'
    }

    if (+minimum_rating > 0) {
      // console.log('added minimum_rating', minimum_rating, typeof minimum_rating)
      url += `&minimum_rating=${+minimum_rating}`
    }

    if (sort_by !== 'null') {
      // console.log('added sort_by', sort_by, typeof sort_by)
      url += `&sort_by=${sort_by}`
    } else {
      url += `&sort_by=download_count&order_by=desc`
    }

    if (order_by !== 'null') {
      // console.log('added order_by', order_by, typeof order_by)
      url += `&order_by=${order_by}`
    }
    if (genre !== 'null') {
      // console.log('added genre', genre, typeof genre)
      url += `&genre=${genre}`
    }

    if (query_term && query_term !== '' && query_term !== 'null') {
      // console.log('added query_term', query_term, typeof query_term)
      url += `&query_term=${query_term.replace(/\s/g, '+')}`
    }
    // console.log(url) // testing
    const response = await fetch(url)
    const { data } = await response.json()

    // console.log(data.movies.map(m => m.title)) //  testing
    if (data.movie_count > 0 && data?.movies?.length > 0) {
      const movies = []
      for (const m of data.movies) {
        movies.push({
          // consider extracting more info here
          title: m.title,
          imdbId: m.imdb_code,
          year: m.year,
          imdbRating: m.rating,
          coverUrl: m.large_cover_image,
          synopsis: m.synopsis,
          genres: m.genres,
          torrents: m.torrents,
          watched: await checkIfWatched({ uid: uid, imdbId: m.imdb_code }),
        })
      }
      return res.status(200).json({ movies })
    } else {
      return res.status(200).json({
        params: req.query,
        error: 'no movies found',
      })
    }
  } catch (error) {
    console.log(error)
  }
}

async function getMovie(req, res) {
  // console.log('req uid', req.uid);
  // Destructure the query
  const { language, hash, quality } = req.query // The language of the UI (needed for subtitles)
  const { id } = req.params // The imdb id of the movie (needed for querying the yts API)

  const ytsBaseUrl = 'https://yts.mx/api/v2/movie_details.json'

  console.log('Client sent - Language:', language, `(Imdb-id${id})`) // testing

  const comments = await getComments({ imdb_id: id })

  // No need for a POST endpoint for marking movies as watched.
  await markAsWatched({ uid: req.uid, imdbId: id })

  try {
    // 1st of all, we request the movie with lots of extra information
    const response = await fetch(ytsBaseUrl + '?' + new URLSearchParams({
      imdb_id: id,
      with_images: true,
      with_cast: true,
      }))

    if (response.ok) {
      const { data } = await response.json() // Destructure the data property
      
      return res.status(200).json({
        movie: data.movie,
        comments: comments
      })
    }
  } catch (error) {
    return res.status(200).json({
      error: error,
    })
  }
}

export { getListMovies, getMovie }
