const dummyComments = [
  { content: "This is a comment", username: "user1", timestamp: "2021-01-01", id : 1 },
  { content: "This is a comment", username: "user2", timestamp: "2021-01-06", id : 45 },
  { content: "This is a comment", username: "user1", timestamp: "2021-01-03", id : 78 },
  { content: "This is a comment", username: "user1", timestamp: "2021-01-23", id : 100 },
]
const newDummyComment = {
  content: "This is a new comment",
  username: "user1",
  timestamp: "2021-01-01",
  id: 1 // useful for the keys ;-)
}

// Import the comments model

async function getCommentList(req, res) {
  const { imdb_id } = req.query
  console.log('Comments', imdb_id) // always printing shit to check

  // call the getCommentList fn from the comments model

  // send them to the front, instead of dummy comments
  res.status(200).json({ comments: dummyComments })
}

async function postComment(req, res) {
  const { id: imdb_id } = req.params
  // call the createComment fn from the comments model (pass imdb_id and uid)
  // send new created comment to the front, to update UI
  res.status(200).json({ newComment: newDummyComment })
}

export { 
  getCommentList,
  postComment
}