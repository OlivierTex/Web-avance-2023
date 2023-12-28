import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAPIKey, getAPIBaseURL } from "../API/API_pexels";
import { useRouter } from "next/router";
import Marquee from "react-marquee-slider";
import times from "lodash/times";

function Home({ initialRandomImages1, initialRandomImages2, initialRandomImages3}) {
  const [randomImages1, setRandomImages1] = useState(initialRandomImages1);
  const [randomImages2, setRandomImages2] = useState(initialRandomImages2);
  const [randomImages3, setRandomImages3] = useState(initialRandomImages3);
  const router = useRouter();

  useEffect(() => {
    const fetchRandomImages = async () => {
      const newRandomImages1 = await fetchImages();
      setRandomImages1(newRandomImages1);
      const newRandomImages2 = await fetchImages();
      setRandomImages2(newRandomImages2);
      const newRandomImages3 = await fetchImages();
      setRandomImages3(newRandomImages3);
    };

    fetchRandomImages();
  }, []);

  const handleImageClick = (id) => {
    router.push(`/image/${id}`);
  };

  return (
    <div className="bg-light dark:bg-dark min-h-screen">
      <div className="text-center py-10">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          Welcome to our image and video bank website
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mt-2 mb-5">
          Discover our selection of high-quality photos and videos.
        </p>

        <Marquee velocity={15}>
          {times(randomImages1.length, Number).map((id) => (
            <div
              key={id}
              className="flex justify-center"
              style={{ margin: "10px" }}
            >
              <img
                src={randomImages1[id].src.large}
                alt={`Random ${randomImages1[id].id}`}
                className="rounded shadow-lg cursor-pointer h-80 object-cover"
                onClick={() => handleImageClick(randomImages1[id].id)}
              />
            </div>
          ))}
        </Marquee>

        <Marquee velocity={15}>
          {times(randomImages2.length, Number).map((id) => (
            <div
              key={id}
              className="flex justify-center"
              style={{ margin: "10px" }}
            >
              <img
                src={randomImages2[id].src.large}
                alt={`Random ${randomImages2[id].id}`}
                className="rounded shadow-lg cursor-pointer h-80 object-cover"
                onClick={() => handleImageClick(randomImages2[id].id)}
              />
            </div>
          ))}
        </Marquee>

        <Marquee velocity={15}>
          {times(randomImages3.length, Number).map((id) => (
            <div
              key={id}
              className="flex justify-center"
              style={{ margin: "10px" }}
            >
              <img
                src={randomImages3[id].src.large}
                alt={`Random ${randomImages3[id].id}`}
                className="rounded shadow-lg cursor-pointer h-80 object-cover"
                onClick={() => handleImageClick(randomImages3[id].id)}
              />
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const initialRandomImages1 = await fetchImages();
  const initialRandomImages2 = await fetchImages();
  const initialRandomImages3 = await fetchImages();

  return {
    props: {
      initialRandomImages1, initialRandomImages2, initialRandomImages3
    },
    revalidate: 60,
  };
}

async function fetchImages() {
  const randomPage = Math.floor(Math.random() * 1000) + 1;
  const baseUrl = getAPIBaseURL();
  const apiUrl = `${baseUrl}curated?per_page=10&page=${randomPage}`;
  const apiKey = getAPIKey();

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: apiKey,
      },
    });
    return response.data.photos;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default Home;
