import Layout from '../components/layout';
import '../styles/globals.css';

function App({ Component, pageProps }) {
  return (
    <div className="body">
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
}

export default App;