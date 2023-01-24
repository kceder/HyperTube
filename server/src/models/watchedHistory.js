import pool from "../lib/db.js"

async function checkIfWatched({ uid,  imdbId }) {
	const query = `SELECT * FROM users_movies WHERE user_id = $1 AND imdb_id = $2;`
	const values = [ uid, imdbId ]
	const result = await pool.query(query, values)

	return result.length > 0 ? true : false
}

async function markAsWatched({ uid,  imdbId }) {
	try {
		const query = `INSERT INTO users_movies (user_id, imdb_id) VALUES ($1, $2);`
		const values = [ uid, imdbId ]
		await pool.query(query, values)
	} catch (error) {
		console.log(error)
	}
}

export {
	checkIfWatched,
	markAsWatched
}