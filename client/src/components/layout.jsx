import Footer from './footer'
import Header from './header'

function Layout(props) {
  return (
    <div className='flex flex-col min-h-screen bg-gray-800'>
      <Header />

      <div className='mx-auto'>
        {props.children}
      </div>

      <Footer />
    </div>
  )
}
export default Layout
