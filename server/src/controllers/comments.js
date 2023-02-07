// Import the comments model
import { createComment } from '../models/comment.js'
// Import the users model
import { findByUid } from '../models/user.js'

async function postComment(req, res) {
  const { imdb_id, comment } = req.body

  const user = await findByUid({ uid: req.uid })

  const savedComment = await createComment({
    user_id: req.uid,
    imdb_id: imdb_id,
    comment: comment
  })

  // send new created comment to the front, to update UI
  res.status(200).json({ comment: {
    ...savedComment,
    username: user.username
  } })
}

export { postComment }
