// pages/articles.jsx

import Link from 'next/link';
import Layout from '../components/layout';
import articles from '../data/data';

export default function Articles() {
  return (
    <div className='bg-gray-500'> 
      <Layout>
        <h1 className="wt-title">Articles<br /><br /></h1>
        <ul>
          {articles.map((article) => (
            <li key={article.id}>
              <Link className='italic font-bold text-2xl text-blue-900 underline' href={`/articles/${article.id}`}>
                {article.title}
              </Link>
            </li>
          ))}
        </ul>
      </Layout>
    </div>
  );
}
