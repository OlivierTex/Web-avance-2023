import Header from './header'
import Footer from './footer'
import Navigation from './navigation'

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
