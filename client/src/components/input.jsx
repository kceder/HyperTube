import { HandRaisedIcon } from '@heroicons/react/24/outline'

function Input(props) {
  return (
    <div className='relative flex flex-col w-full text-[0.9rem]'>
      <div className='flex flex-col w-full'>
        <label className='text-white pb-1 mt-2 align-left'>
          {props.label}{props.isRequired && <sup className="text-xs">*</sup>}
        </label>
        <input
          id={props.id}
          type={props.type}
          label={props.label}
          className={`border border-gray-300 rounded-md px-4 py-1 text-gray-900 max-w-xs md:max-w-md placeholder:text-gray-300 min-w-full ${
            props.errors[props.id] ? "border-red-500 outline-red-400" : ""
          }`}
          placeholder={props.placeholder}
          {...props.register(props.id, props.registerOptions)}
        />
      </div>
        {props.errors[props.id] &&
        <p className='absolute top-[4.2rem] text-right text-red-400 text-[0.7rem]'>
          {`${props.errors[props.id].message}`}
          <HandRaisedIcon className='inline w-3 mx-2' />
        </p>}
    </div>
  )
}

export default Input
