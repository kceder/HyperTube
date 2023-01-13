async function getSubtitles(req, res) {
  // Destructure the query
  const { id: imdbId } = req.params

  console.log('Subtitles', imdbId)
  res.status(200).json({ ok: imdbId })
}

export { getSubtitles }