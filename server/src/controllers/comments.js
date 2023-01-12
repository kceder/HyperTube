const dummyComments = [
  {
    content: 'This is a comment',
    username: 'user1',
    created_at: 1673551785446,
    id: 1,
  },
  {
    content: 'This is a comment',
    username: 'user2',
    created_at: 1673551715446,
    id: 45,
  },
  {
    content: 'This is a comment',
    username: 'user1',
    created_at: 1673551784446,
    id: 78,
  },
  {
    content: 'This is a comment',
    username: 'user1',
    created_at: 1673551785446,
    id: 100,
  },
]
const newDummyComment = {
  content: 'This is a new comment',
  username: 'user1',
  created_at: 1673551785446,
  id: 1, // useful for the keys ;-)
}

// Import the comments model
import { getComments, createComment } from '../models/comment.js'
import { findByUid } from '../models/user.js'

async function getCommentList(req, res) {
  const { imdb_id } = req.query
  console.log('Comments', imdb_id) // always printing shit to check

  // call the getCommentList fn from the comments model
  const comments = await getComments({ imdb_id })

  // send them to the front, instead of dummy comments
  res.status(200).json({ comments: comments })
}

async function postComment(req, res) {
  const { imdb_id, comment, created_at } = req.body
  req.uid = 1 // testing while authentication is bypassed
  const author = await findByUid({ uid: req.uid })
  console.log(req.body)
  console.log(imdb_id, comment)

  // call the createComment fn from the comments model (pass imdb_id and uid)
  // const savedComment = {
  //   id: Math.random(), // testing
  //   comment: comment,
  //   username: 'bob',
  //   created_at: created_at
  // }
  const savedComment = await createComment({
    user_id: req.uid, // testing
    imdb_id: imdb_id,
    comment: comment
  })
  const comments = await getComments({ imdb_id })

  // send new created comment to the front, to update UI
  res.status(200).json({ comments: comments })
}

export { getCommentList, postComment }
