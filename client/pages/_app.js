import Layout from '../components/layout';
import '../styles/globals.css';

function App({ Component, pageProps }) {
  return (
    <div className={`bg-light dark:bg-dark`}>
    <div className="body">
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
    </div>
  );
}

export default App;