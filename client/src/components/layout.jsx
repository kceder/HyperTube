import Header from './header'

function Layout(props) {
  return (
    <div className='min-h-screen bg-gray-800'>
      <Header />

      <div className='max-w-6xl mx-auto'>
        {props.children}
      </div>
    </div>
  )
}
export default Layout
