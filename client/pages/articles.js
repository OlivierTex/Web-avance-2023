import Link from 'next/link';
import Layout from '../components/layout';
import articlesData from '../data/data';
import { useState } from 'react';

export default function Articles(articles) {
  const [articlesPerRow, setArticlesPerRow] = useState(4);

  const handleArticlesPerRowChange = (count) => {
    console.log('Changing articles per row to:', count);
    setArticlesPerRow(count);
  };

  return (
    <div>
      <Layout>
        <h1 className="text-3xl text-center mt-8">Catalogue photos</h1>
        <div className="flex justify-end mt-4 space-x-4">
          <button onClick={() => handleArticlesPerRowChange(2)} className={`${articlesPerRow === 2 ? 'bg-blue-900 text-white' : 'bg-gray-200'} px-4 py-2 rounded-md`}>2 par ligne</button>
          <button onClick={() => handleArticlesPerRowChange(4)} className={`${articlesPerRow === 4 ? 'bg-blue-900 text-white' : 'bg-gray-200'} px-4 py-2 rounded-md`}>4 par ligne</button>
          <button onClick={() => handleArticlesPerRowChange(6)} className={`${articlesPerRow === 6 ? 'bg-blue-900 text-white' : 'bg-gray-200'} px-4 py-2 rounded-md`}>6 par ligne</button>        
        </div>
        <div className="w-11/12 mx-auto">
          <div className="flex flex-wrap justify-center mt-8">
            {articlesData.map((article) => (
              <div key={article.id} className={`p-4 ${articlesPerRow === 2 ? 'w-1/2': articlesPerRow === 4 ? 'w-1/4': 'w-1/6'}`}>
                <Link href={`/articles/${article.id}`}>
                  <div className="block h-full border border-gray-300 p-2 hover:bg-gray-100">
                  <img src={article.image} alt={article.title} className="w-full object-cover"/>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    </div>
  );
}
