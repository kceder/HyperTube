import separator from '../assets/rose.png'

function Footer() {
  return (
    <footer className='invisible md:visible flex justify-between items-center text-white mt-auto p-4 border-t border-white'>
      
      <span className='text-sm'>&copy; 2023</span>
      <div>
        <a
          href='https://github.com/amedeomajer/'
          className='ml-3 text-sm hover:text-blue-500'
          >
          amajer
        </a>
        <a
          href='https://github.com/kceder/'
          className='ml-3 text-sm hover:text-blue-500'
          >
          kceder
        </a>
        <a
          href='https://github.com/lifeBalance/'
          className='ml-3 text-sm hover:text-blue-500'
          >
          rodrodri
        </a>
      </div>
    </footer>
  )
}
export default Footer
