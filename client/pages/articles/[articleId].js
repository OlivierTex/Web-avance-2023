import { useRouter } from 'next/router';
import articles from '../../data/data';
import { useState, useEffect } from 'react';

const Article = ({ article }) => {
  const router = useRouter();

  const [isImageFullscreen, setIsImageFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsImageFullscreen(!isImageFullscreen);
  };

  const handleOutsideClick = (e) => {
    if (isImageFullscreen && e.target.tagName !== 'IMG') {
      toggleFullscreen();
    }
  };

  useEffect(() => {
    if (isImageFullscreen) {
      document.addEventListener('click', handleOutsideClick);
      document.body.style.overflow = 'hidden'; //désactiver la barre de scroll
    } else {
      document.body.style.overflow = 'auto'; //réactiver la barre de scroll
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.body.style.overflow = 'auto'; //réactiver la barre de scroll
    };
  }, [isImageFullscreen]);

  return (
    <div className={isImageFullscreen ? 'h-screen overflow-hidden' : 'min-h-screen'}>
      {article ? (
        <div className={isImageFullscreen ? 'hidden' : 'w-3/5 mx-auto py-8'}>
          <h1 className="text-3xl text-custom5 font-bold text-center mb-4">{article.title}</h1>
          <img className="w-auto h-auto object-cover mx-auto max-h-screen mb-4 cursor-pointer border-4 border-custom1" src={article.image} onClick={toggleFullscreen}/>
          <div className="text-center text-custom5 mb-4">
            <p>By :{' '} <a href={article.linkToPP} target="_blank" rel="noopener noreferrer" className="text-custom5 underline hover:text-custom4">{article.author}</a></p>
            <p className="text-custom5">Catégorie : {article.tag}</p>
          </div>
          <p className="text-lg leading-relaxed text-custom5">{article.content}</p>
        </div>
      ):(<p className="text-center text-custom5">Article not found</p>)
      }
      {isImageFullscreen && (
        <div className="fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-75 flex justify-center items-center">
          <div className="relative">
            <img src={article.image} className="h-screen mx-auto"/>
            <button onClick={toggleFullscreen} className="absolute top-4 right-4 text-white text-3xl focus:outline-none">x</button>
          </div>
        </div>
      )}
    </div>
  );
  
};

export async function getStaticPaths() {
  const paths = articles.map((article) => ({
    params: { articleId: article.id.toString() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const articleId = parseInt(params.articleId);
  const article = articles.find((a) => a.id === articleId);

  return {
    props: {
      article,
    },
  };
}

export default Article;