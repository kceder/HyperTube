import separator from '../assets/rose.png'

function Footer() {
  return (
    <footer className='flex justify-between items-center text-white mt-auto p-4 border-t-2 border-white'>
      
      <span className='font-bold text-xl'>&copy; 2023</span>
      <div>
        <a
          href='https://github.com/amedeomajer/'
          className='ml-3 font-bold hover:text-blue-500'
          >
          amajer
        </a>
        <a
          href='https://github.com/kceder/'
          className='ml-3 font-bold hover:text-blue-500'
          >
          kceder
        </a>
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
