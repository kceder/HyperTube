import Header from './header'

function Layout(props) {
  return (
    <>
      <Header />

      <div className='bg-gray-800'>
        <div className='max-w-6xl mx-auto'>
          <main>{props.children}</main>
        </div>
      </div>
    </>
  )
}
export default Layout
