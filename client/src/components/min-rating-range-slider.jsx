import imdbLogo from '../assets/imdb.png'

function MinRatingRangeSlider(props) {
  const {
    label,
    value,
    changeHandler
  } = props

  return (
    <div className='flex flex-col space-y-2'>
      <label className='capitalize text-white text-xl flex justify-between items-center space-x-4'>
        {label}
        <div className='flex items-center space-x-2'>
          <span className='flex justify-center items-center bg-slate-700 w-8 h-8 rounded-full text-white font-bold'>
            {value}
          </span>
          <img src={imdbLogo} alt="imdb logo" className='h-6'/>
        </div>
      </label>
      <input type='range' min='0' max='9' onChange={changeHandler} id='rating' value={value}/>
    </div>
  )
}

export default MinRatingRangeSlider
