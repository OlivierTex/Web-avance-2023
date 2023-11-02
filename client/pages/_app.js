import Layout from '../components/layout';
import '../styles/globals.css';

function App({ Component, pageProps }) {
  return (
    <div className="block h-full bg-zinc-200">
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
}

export default App;