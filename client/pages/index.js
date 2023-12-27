import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAPIKey, getAPIBaseURL } from "../API/API_pexels";
import { useRouter } from "next/router";
import Marquee from "react-marquee-slider";
import times from "lodash/times";

function Home() {
  const [randomImages, setRandomImages] = useState([]);
  const [randomImages2, setRandomImages2] = useState([]); 
  const [randomImagess, setRandomImagess] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchRandomImages = async () => {
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
        const randomPhotos = response.data.photos;
        setRandomImages(randomPhotos);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchRandomImages2 = async () => {
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
        const randomPhotos = response.data.photos;
        setRandomImages2(randomPhotos);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchRandomImagess = async () => {
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
        const randomPhotos = response.data.photos;
        setRandomImagess(randomPhotos);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRandomImagess();
    fetchRandomImages();
    fetchRandomImages2(); 
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
          {times(randomImages.length, Number).map((id) => (
            <div key={id} className="flex justify-center" style={{ margin: '10px' }}>
              <img
                src={randomImages[id].src.large}
                alt={`Random ${randomImages[id].id}`}
                className="rounded shadow-lg cursor-pointer h-80 object-cover"
                onClick={() => handleImageClick(randomImages[id].id)}
              />
            </div>
          ))}
        </Marquee>

        <Marquee velocity={15}>
          {times(randomImagess.length, Number).map((id) => (
            <div key={id} className="flex justify-center" style={{ margin: '10px' }}>
              <img
                src={randomImagess[id].src.large}
                alt={`Random ${randomImagess[id].id}`}
                className="rounded shadow-lg cursor-pointer h-80 object-cover"
                onClick={() => handleImageClick(randomImagess[id].id)}
              />
            </div>
          ))}
        </Marquee>

        <Marquee velocity={15}>
          {times(randomImages2.length, Number).map((id) => (
            <div key={id} className="flex justify-center" style={{ margin: '10px' }}>
              <img
                src={randomImages2[id].src.large}
                alt={`Random ${randomImages2[id].id}`}
                className="rounded shadow-lg cursor-pointer h-80 object-cover"
                onClick={() => handleImageClick(randomImages2[id].id)}
              />
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
}

export default Home;
