import { HandRaisedIcon } from '@heroicons/react/24/outline'

function Input(props) {
  return (
    <div className='relative flex flex-col w-full'>
      <div className='flex flex-col w-full'>
      {props.errors[props.id] &&
        <p className='text-white text-sm'>
          {`${props.errors[props.id].message}`}
          <HandRaisedIcon className='inline w-5 -mt-1 mx-2' />
        </p>}
        <label className='text-white pb-2 align-left'>
          {props.label}{props.isRequired && <sup className="text-sm">*</sup>}
        </label>
        <input
          id={props.id}
          type={props.type}
          label={props.label}
          className='bg-gray-50 border border-gray-300 rounded-md px-4 py-1 text-gray-900 max-w-xs md:max-w-md placeholder:text-gray-300 min-w-full'
          placeholder={props.placeholder}
          {...props.register(props.id, props.registerOptions)}
        />
      </div>
    </div>
  )
}

export default Input
