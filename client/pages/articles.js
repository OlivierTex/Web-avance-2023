import Link from 'next/link';
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
        <h1 className="text-3xl text-custom5 text-center mt-8">Catalogue photos</h1>
        <div className="flex justify-end mt-4 space-x-4 w-11/12">
          <div className="scale-75">
            <button onClick={() => handleArticlesPerRowChange(2)} className={`${articlesPerRow === 2 ? 'border border-custom5 bg-custom4' : 'bg-custom3'} px-4 py-2 rounded-md`}>
              <img  src={"/images/layout-1-64.svg"}/>
            </button>
            <button onClick={() => handleArticlesPerRowChange(4)} className={`${articlesPerRow === 4 ? 'border border-custom5 bg-custom4' : 'bg-custom3'} px-4 py-2 rounded-md`}>
              <img  src={"/images/layout-2-64.svg"}/>
            </button>
            <button onClick={() => handleArticlesPerRowChange(6)} className={`${articlesPerRow === 6 ? 'border border-custom5 bg-custom4' : 'bg-custom3'} px-4 py-2 rounded-md`}>
              <img  src={"/images/layout-3-64.svg"}/>  
            </button>        
          </div>
        </div>
        <div className="w-11/12 mx-auto">
          <div className="flex flex-wrap justify-center mt-8">
            {articlesData.map((article) => (
              <div key={article.id} className={`p-4 ${articlesPerRow === 2 ? 'w-1/2': articlesPerRow === 4 ? 'w-1/4': 'w-1/6'}`}>
                <Link href={`/articles/${article.id}`}>
                  <div className="block h-full relative group bg-custom4 border border-custom1 p-2">
                  <img src={article.image} alt={article.title} className="w-full object-cover transition duration-300 transform group-hover:scale-110"/>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}
