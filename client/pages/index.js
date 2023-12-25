import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";
import { getAPIKey, getAPIBaseURL } from "../API/API_pexels";
import { useRouter } from "next/router";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Home() {
  const [randomImages, setRandomImages] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchRandomImages = async () => {
      const randomPage = Math.floor(Math.random() * 1000) + 1;
      const baseUrl = getAPIBaseURL();
      const apiUrl = `${baseUrl}curated?per_page=5&page=${randomPage}`;
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

    fetchRandomImages();
  }, []);

  if (randomImages.length === 0) {
    return <div>Loading...</div>;
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 20000,
  };

  const handleImageClick = (id) => {
    router.push(`/image/${id}`);
  };

  return (
    <div className="bg-light dark:bg-dark min-h-screen">
      <div className="text-center py-10">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          Welcome to our image and video bank website
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mt-2 mb-2">
          Discover our selection of high-quality photos and videos.
        </p>
        <Slider {...settings}>
          {randomImages.map((image) => (
            <div key={image.id} className="flex justify-center">
              <img
                src={image.src.large}
                alt={`Random ${image.id}`}
                className="rounded shadow-lg cursor-pointer max-w-full h-auto mx-auto"
                onClick={() => handleImageClick(image.id)}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default Home;
