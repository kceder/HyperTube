import React from 'react'

function CommentSection(props) {
  const { imdbId } = props
  const [comment, setComment] = React.useState('')
  const [refresh, setRefresh] = React.useState(false)
  const [comments, setComments] = React.useState(null)
  const [newComment, setNewComment] = React.useState('')
  // id, imbdb_id, username, content, timestamp
  React.useEffect(() => {
    async function fetchComments() {
      const response = await fetch('/api/comments?' + new URLSearchParams({
        imdb_id: imdbId
      }))
      const data = await response.json()
      setComments(data.comments)
    }

    fetchComments()
    // console.log('comments  fetched again')
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    // send to db
    setRefresh(!refresh)
    setNewComment('')
  }

  const deleteCommment = (id) => {
    // not requested by subject or eval form
  }

  return (
    <div className='CommentSection'>
      <h2 className='text-2xl mb-4'>Comments</h2>
      <div className='comments'>
        {comments && comments.length > 0 && comments.map((comment, index) => (
          <div
            key={index} // use the comment id instead ;-)
            className='border-b p-2'
          >
            {comment.content} {comment.username} {comment.timestamp}{' '}
            <button onClick={() => deleteCommment(comment.id)}>delete</button>
            <div>{comment.id}</div>
          </div>
        ))}
      </div>

      <form>
        <textarea
          className='border p-2 mb-2 w-full text-black'
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          className='bg-blue-500 text-white p-2'
          onClick={(e) => handleSubmit(e)}
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default CommentSection
