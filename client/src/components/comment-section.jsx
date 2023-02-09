import React from 'react'

import { Link } from 'react-router-dom'

import { useSelector } from 'react-redux'

// homemade translation system
import t from '../i18n/i18n'

import {
  ExclamationTriangleIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

function CommentSection(props) {
  const [newComment, setNewComment] = React.useState('')
  const activeLanguage = useSelector(slices => slices.language.activeLanguage)
  const accessToken = useSelector(slices => slices.auth.accessToken)

  function handleSubmit(e) {
    e.preventDefault()
    let comment = newComment.trim();
    if (comment.length > 255) {
      comment = newComment.slice(0, 255);
    }
    else if (comment.length === 0) {
      return
    }
    else if (comment.replace(/\s/g, '').length === 0) {
      setNewComment('');
      return
    }
    async function postComment() {
      try {
        const response = await fetch('/api/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization : `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            imdb_id: props.imdbId,
            comment: comment,
            created_at: +new Date(),
          }),
        })
        // Check if the response is OK
        if (response.ok) {
          const data = await response.json()
          props.setComments(prev => [data.comment, ...prev])
        }
      } catch (error) {
        console.log(error)
      }
    }

    postComment()
    // Clear text area
    setNewComment('')
  }
console.log(props.comments)// testing
  return (
    <div className='min-w-4xl pb-6'>
      <form className='flex flex-col'>
        <label className='text-white text-lg capitalize'>{t(activeLanguage, 'moviePage.commentSection.label')}</label>
        <textarea
          className='rounded-sm p-2 mb-2 w-full text-slate-700'
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          maxLength='255'
        />
        <div className='flex justify-between'>
          <button
            className='border rounded-lg mb-2 text-white p-2 hover:bg-white hover:bg-opacity-20'
            onClick={(e) => handleSubmit(e)}
          >
            {t(activeLanguage, 'moviePage.commentSection.submit')}
          </button>
          <p className='text-sm text-white mb-4 ml-2'>
            <ExclamationTriangleIcon className='inline w-4 text-white -mt-1 mr-1' />
            {255 - newComment.length} {t(activeLanguage, 'moviePage.commentSection.charactersLeft')}
          </p>
        </div>
      </form>
        {props.comments && props.comments.length > 0 && (
          <>
          <h2 className='text-2xl text-white text-center mb-4'>{t(activeLanguage, 'moviePage.commentSection.comments')}</h2>
          <hr />
          <ul className={`flex flex-col space-y-6 py-6 max-h-96${props.comments && props.comments.length > 0 &&' overflow-y-scroll'}`}>
            {props.comments && props.comments.length > 0 && (
              props.comments.map(comment => {
                return (
                  <li
                    key={comment.id}
                    className='break-all'
                  >
                  <p className='text-white'>
                    <span className='font-bold'>
                      <Link
                        to={`/users/${comment.user_id}`}
                        className='hover:text-blue-500'
                      >
                        {comment.username}
                      </Link>
                    </span>{t(activeLanguage, 'moviePage.commentSection.wroteOn')}{' '}
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
                  <p className='text-xl bg-slate-300 text-slate-700 rounded-md p-2 w-full'>{comment.comment}</p>
                </li>
                )
              })
            )}
          </ul>
          <hr />
          </>
          )}
    </div>)
}

export default CommentSection
