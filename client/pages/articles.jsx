import Link from 'next/link';
import Layout from '../components/layout'
import articles from '../data/data';

  export default function Articles() {
    return (
      <Layout>
        <h1>Articles</h1>
        <ul>
        {articles.map((article) => (
        <li key={article.id}>
          <Link href={`/articles/${article.id}`}>
            {article.title}
          </Link>
        </li>
        ))}

        </ul>
      </Layout>
    );
  }