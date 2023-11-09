import Layout from '../components/layout';
import '../styles/globals.css';
import { AuthProvider } from '../components/authcontex';

function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <div className={`bg-light dark:bg-dark`}>
        <div className="body">
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;