import pool from "../lib/db.js"

async function checkIfWatched({ uid,  imdbId }) {
	const query = `SELECT * FROM users_movies WHERE imdb_id = $1 AND user_id = $2;`
	const values = [ imdbId, uid ]
	try {
		const result = await pool.query(query, values)
		return result.rows.length > 0 ? true : false
	} catch (error) {
		console.log(error)
		return false
	}

}

async function markAsWatched({ uid,  imdbId }) {
	try {
		const rowExists = await checkIfWatched({ uid, imdbId });
		if (!rowExists) {
			const query = `INSERT INTO users_movies (user_id, imdb_id) VALUES ($1, $2);`
			const values = [ uid, imdbId ]
			await pool.query(query, values)
		}
	} catch (error) {
		console.log(error)
	}
}

export {
	checkIfWatched,
	markAsWatched
}