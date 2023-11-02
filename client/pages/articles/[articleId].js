import { useRouter } from 'next/router';
import Layout from '../../components/layout';
import articles from '../../data/data';

const Article = () => {
  const router = useRouter();
  const { articleId } = router.query;

  // Trouver l'article correspondant à l'articleId dans les données
  const article = articles.find((a) => a.id === parseInt(articleId));

  return (
    <div>
      {article ? (
        <div>
          <h1>Article {article.id}</h1>
          <h2>{article.title}</h2>
          <p>{article.content}</p>
        </div>
      ) : (
        <p>Article not found</p>
      )}
    </div>
  );
};

export default Article;