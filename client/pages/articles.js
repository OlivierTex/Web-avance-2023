import Link from 'next/link';
import Layout from '../components/layout';
import articlesData from '../data/data';
import React, { useEffect, useState } from 'react';


export default function Articles(articles) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/profile')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setProfile(data);
      })
      .catch((error) => {
        console.error('Error fetching profile:', error);
      });
  }, []);

  return (
    <div>
      <Layout>
        <h1 className="text-3xl text-center mt-8">Articles</h1>
        <ul className="mt-8">
          {articlesData.map((article) => (
            <li key={article.id} className="text-center">
              <Link className="text-blue-900 hover:underline" href={`/articles/${article.id}`}>
                {article.title}
              </Link>
            </li>
          ))}
        </ul>
      </Layout>
    </div>
  );
}

export async function getStaticProps() {
  const articles = articlesData;
  return {
    props: {
      articles,
    },
  };
}
