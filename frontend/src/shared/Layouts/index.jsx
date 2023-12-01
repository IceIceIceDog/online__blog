import { Outlet } from "react-router-dom";
import Header from "../../modules/Header";
import Footer from "../../components/Footer";

const Layout = ({type}) => {

  switch (type){
    case 'default':
  return (
   <>
   <Header />
   <main className="main">
   <Outlet />
   </main>
   <Footer />
   
   
   </>
  )
  case 'signup':
    return (
      <main className="signup">
        <Outlet />
      </main>
    )
    case 'unset':
      return (
        <>
        <Header />
        <main className="unset">
          <Outlet />
        </main>
        <Footer />
        </>
      )
    default:
      return <></>
  }
}

export default Layout;