import Link from 'next/link';
import articlesData from '../data/data';
import { useState } from 'react';

export default function Articles() {
  const [articlesPerRow, setArticlesPerRow] = useState(4);

  const handleArticlesPerRowChange = (count) => {
    setArticlesPerRow(count);
  };

  const getClassName = (count) => {
    switch (count) {
      case 2:
        return 'w-6/12';
      case 4:
        return 'w-3/12';
      case 6:
        return 'w-2/12';
      default:
        return 'w-3/12';
    }
  };

  return (
    <div className={`bg-light dark:bg-dark`}>
      <div className="mb-8">
        <h1 className="h1">Catalogue photos</h1>
        <div className="flex justify-end mt-4 space-x-4 w-11/12">
          <div className="scale-75">
            <button onClick={() => handleArticlesPerRowChange(2)} className={`${articlesPerRow === 2 ? 'border border-custom5 bg-custom4' : 'bg-custom3'} px-4 py-2 rounded-md`}>
              <img src="/images/layout-1-64.svg" alt="Layout 1" />
            </button>
            <button onClick={() => handleArticlesPerRowChange(4)} className={`${articlesPerRow === 4 ? 'border border-custom5 bg-custom4' : 'bg-custom3'} px-4 py-2 rounded-md`}>
              <img src="/images/layout-2-64.svg" alt="Layout 2" />
            </button>
            <button onClick={() => handleArticlesPerRowChange(6)} className={`${articlesPerRow === 6 ? 'border border-custom5 bg-custom4' : 'bg-custom3'} px-4 py-2 rounded-md`}>
              <img src="/images/layout-3-64.svg" alt="Layout 3" />
            </button>
          </div>
        </div>
        <div className="w-4/5 mx-auto">
          <div className="flex flex-wrap justify-center mt-8 gap-y-4">
            {articlesData.map((article) => (
              <div key={article.id} className={`${getClassName(articlesPerRow)} px-2 aspect-[1]`}>
                <Link href={`/articles/${article.id}`}>
                  <div className="block h-full relative group bg-custom4 border border-custom1 p-1 overflow-hidden">
                    <img src={article.image} className="w-full h-full object-cover transition-transform duration-500 transform hover:scale-110" alt={article.title} />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
