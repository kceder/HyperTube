async function logout(req, res) {
  req.logout(function(err) {
    if (err) return next(err)
    res.status(200).json({ message: 'successfully logged out' })
  })
}

export { logout }
