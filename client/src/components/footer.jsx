import separator from '../assets/rose.png'

function Footer() {
  return (
    <footer className='flex justify-between items-center bg-red-600 text-white mt-auto p-4 border-t-2 border-white'>
      
      <span className='font-bold text-xl'>&copy; 1997</span>
      <div>
        <a
          href='https://github.com/amedeomajer/'
          className='ml-3 font-bold hover:text-blue-500'
          >
          amajer
        </a>
        <img
          src={separator}
          alt='2023-separator'
          className='hidden md:inline w-12'
          />
        <a
          href='https://github.com/kceder/'
          className='ml-3 font-bold hover:text-blue-500'
          >
          kceder
        </a>
        <img
          src={separator}
          alt='2023-separator'
          className='hidden md:inline w-12'
          />
        <a
          href='https://github.com/lifeBalance/'
          className='ml-3 font-bold hover:text-blue-500'
          >
          rodrodri
        </a>
      </div>
    </footer>
  )
}
export default Footer
