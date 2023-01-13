import React from 'react'
// import dayjs from 'dayjs'

import {
  ExclamationTriangleIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

function CommentSection(props) {
  const { imdbId } = props
  // const [comment, setComment] = React.useState('')
  // const [refresh, setRefresh] = React.useState(false)
  const [comments, setComments] = React.useState(null)
  const [newComment, setNewComment] = React.useState('')
  // id, imbdb_id, username, content, timestamp
  React.useEffect(() => {
    async function fetchComments() {
      const response = await fetch(
        '/api/comments?' +
          new URLSearchParams({
            imdb_id: imdbId,
          }),
      )
      const data = await response.json()
      setComments(data.comments)
      console.log('comments  fetched again', data.comments)
    }

    fetchComments()
  }, [])

  function handleSubmit(e) {
    e.preventDefault()

    async function postComment() {
      console.log(newComment)
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imdb_id: imdbId,
          comment: newComment,
          created_at: +new Date(),
        }),
      })
      const data = await response.json()
      // console.log(data)
      // setComments(data.comments)
      setComments(prev => [data.comment, ...prev])
    }

    postComment()

    setNewComment('')
  }

  return (
    <div className='w-full space-y-6'>
      <form className='flex flex-col'>
        <label className='text-xl'>Add New Comment</label>
        <textarea
          className='rounded-sm p-2 mb-2 w-full text-slate-700'
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <p className='text-sm mb-4 ml-2'>
          <ExclamationTriangleIcon className='inline w-4 text-white -mt-1 mr-1' />
          {255 - newComment.length} characters left
        </p>
        <button
          className='w-full border rounded-lg text-white p-2 hover:bg-white hover:bg-opacity-20'
          onClick={(e) => handleSubmit(e)}
        >
          Submit
        </button>
      </form>

      <h2 className='text-2xl text-center mb-4'>Comments</h2>
      <hr />
      <ul className=''>
        {comments &&
          comments.length > 0 &&
          comments.map(comment => (
            <li
              key={comment.id}
              className='p-2'
              >
              <p>
                {/* <span className='font-bold'>{comment.username}</span> wrote on <span>{dayjs().to(dayjs(comment.created_at / 1000))}</span> */}
                <span className='font-bold'>{comment.username}</span> wrote on{' '}
                <span>
                  <CalendarIcon className='inline w-4 text-white -mt-1 mr-1'/>
                  {new Date(+comment.created_at).toLocaleDateString('fi-FI')} at{' '}
                  <ClockIcon className='inline w-4 text-white -mt-1 mr-1'/>
                  {new Date(+comment.created_at).toLocaleTimeString('fi-FI', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </p>
              <p className='text-xl bg-slate-300 text-slate-700 rounded-md p-2'>{comment.comment}</p>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default CommentSection
