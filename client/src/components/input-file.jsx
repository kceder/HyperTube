import React from 'react'
import { HandRaisedIcon, XCircleIcon } from '@heroicons/react/24/outline'

function InputFile(props) {
  const {
    label,
    inputId,
    filenameBoxId,
    inputLabel,
    btnLabel,
    clearPicLabel,
    register,
    registerOptions,
    errors,
    setValue,
    isRequired
  } =  props

  const [filename, setFilename] = React.useState('No file selected')

  function handleUploadFile(e) {
    e.preventDefault()
    const fileInputElem = document.getElementById(inputId)
    // console.log(document.getElementById(inputId))
    fileInputElem.click()
  }

  function handleFilename(e) {
    // console.log(e.target.files[0].name)
    setFilename(e.target.files[0].name)
    setValue(inputId, e.target.files) // this set the input to a 'FileList' object
  }

  // console.log(errors)
  function clearPic(e) {
    e.preventDefault()
    setValue(inputId, '')
    setFilename('No file selected')
  }

  return (
    <div className='relative flex flex-col w-full pb-20'>
    <label className='text-2xl pb-2 capitalize ml-2'>
      {label}{isRequired && <sup className="text-sm">*</sup>}
    </label>
    <div className="flex items-center">
      <input
        style={{display: 'none'}}
        id={inputId}
        type='file'
        label={inputLabel}
        {...register(inputId, registerOptions)}
        onChange={handleFilename}
      />

      <button
        className='border border-white rounded-l-md p-3 w-[35%] capitalize'
        onClick={handleUploadFile}
      >
        {btnLabel}
      </button>

      <p id={filenameBoxId} className='bg-white border border-white w-[65%] p-3 rounded-r-md text-slate-700 truncate'>
        {filename}
      </p>

      <button
        className='absolute top-0 right-4 text-gray-400'
        onClick={clearPic}
      >
        <div className='group'>
          <XCircleIcon className='inline w-4 mx-1 -mt-1 group-hover:text-red-500' />
          <span className='group-hover:text-white'>
          {clearPicLabel}
          </span>
        </div>
      </button>
    </div>
    {errors[inputId] &&
      <p className='absolute top-24 left-2 text-white'>
        <HandRaisedIcon className='inline w-5 -mt-1 mx-2' />
        {`${errors[inputId].message}`}
      </p>}
  </div>
  )
}

export default InputFile
