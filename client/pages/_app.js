import Layout from '../components/layout';
import { UserContext } from '../components/AuthContext';
import '../styles/globals.css';


function App({ Component, pageProps }) {
  return (
      <div className={`bg-light dark:bg-dark`}>
        <div className="body">
          <Layout>
            <UserContext>
              <Component {...pageProps} />
            </UserContext>
          </Layout>
        </div>
      </div>

  );
}

export default App;