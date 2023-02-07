// Import the comments model
import { createComment } from '../models/comment.js'
// Import the users model
import { findByUid } from '../models/user.js'

async function postComment(req, res) {
  const { imdb_id, comment, created_at } = req.body
  // req.uid = 1 // testing while authentication is bypassed

  const user = await findByUid({ uid: req.uid })

  const savedComment = await createComment({
    user_id: req.uid, // testing
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
