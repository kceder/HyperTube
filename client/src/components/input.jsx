import { HandRaisedIcon } from '@heroicons/react/24/outline'

function Input(props) {
  return (
    <div className='relative flex flex-col pb-20 w-full px-2'>
      <div className='flex flex-col w-full'>
        <label className='text-2xl font-medium text-white pb-2 capitalize align-left'>
          {props.label}{props.isRequired && <sup className="text-sm">*</sup>}
        </label>
        <input
          id={props.id}
          type={props.type}
          label={props.label}
          className='bg-gray-50 border border-gray-300 rounded-md px-4 py-1 text-gray-900 text-2xl max-w-xs md:max-w-md placeholder:text-gray-300 min-w-full'
          placeholder={`Enter your ${props.label}`}
          {...props.register(props.id, props.registerOptions)}
        />
      </div>
      {props.errors[props.id] &&
        <p className='absolute top-24 left-2 text-white'>
          <HandRaisedIcon className='inline w-5 -mt-1 mx-2' />
          {`${props.errors[props.id].message}`}
        </p>}
    </div>
  )
}

export default Input
