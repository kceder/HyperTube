import React from 'react'
import ReactDOM from 'react-dom'
import {
  XCircleIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import { useSelector, useDispatch } from 'react-redux'
import { showNotif, hideNotif } from '../store/notificationsSlice'

function Notification(props) {
  // const { title, message, status } = props // for testing
  const {
    isOn,
    message,
    status
  } = useSelector(slices => slices.notifications)
  const dispatch = useDispatch()

  // Timer to auto remove notifications after 3 seconds
  React.useEffect(() => {
    // For pending/loading notifications we don't want the timer
    if (isOn && (status === 'success' || status === 'error')) {
      const timer = setTimeout(() => {
        dispatch(hideNotif())
      }, 3000)
      // Cleanup function (so we don't end up with multiple timers on)
      return () => clearTimeout(timer)
    }
  }, [isOn, status])

  let statusClasses = ''
  let icon

  if (status === 'success') {
    statusClasses = 'bg-green-500 text-green-100'
    icon = <HandThumbUpIcon className='inline w-8 -mt-1 text-green-700'/>
  }

  if (status === 'error') {
    statusClasses = 'bg-red-500 text-red-100'
    icon = <HandThumbDownIcon className='inline w-8 -mt-1 text-red-700'/>
  }

  if (status === 'loading') {
    statusClasses = 'bg-amber-500 text-amber-100'
    icon = <InformationCircleIcon className='inline w-8 -mt-1 text-amber-700'/>
  }

  return ReactDOM.createPortal(
    <div
      className={`${statusClasses} fixed inset-x-0 bottom-0 flex flex-col md:flex-row justify-between items-center text-lg p-4`}
    >
      <XCircleIcon
        className='absolute top-2 right-2 w-6 text-white hover:cursor-pointer hover:scale-125'
        onClick={() => dispatch(hideNotif())}
      />
      <p className='ml-12 mr-6'>{icon} {message}</p>
    </div>,
    document.getElementById('notifications'),
  )
}

export default Notification
