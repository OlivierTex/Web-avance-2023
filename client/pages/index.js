import React from "react";
import axios from "axios";
import { getAPIKey, getAPIBaseURL } from "../API/API_pexels";
import { useRouter } from "next/router";
import Marquee from "react-marquee-slider";
import times from "lodash/times";
import { StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";

function ImageCarousel({ images, handleImageClick }) {
  return (
    <Marquee velocity={15}>
      {times(images.length, Number).map((id) => (
        <div
          key={id}
          className="flex justify-center"
          style={{ margin: "10px" }}
        >
          <img
            src={images[id].src.large}
            alt={`Random ${images[id].id}`}
            className="rounded shadow-lg cursor-pointer h-80 object-cover"
            onClick={() => handleImageClick(images[id].id)}
          />
        </div>
      ))}
    </Marquee>
  );
}

function Home({
  initialRandomImages1,
  initialRandomImages2,
  initialRandomImages3,
}) {
  const router = useRouter();

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
        <StyleSheetManager shouldForwardProp={isPropValid}>
          <ImageCarousel
            images={initialRandomImages1}
            handleImageClick={handleImageClick}
          />
          <ImageCarousel
            images={initialRandomImages2}
            handleImageClick={handleImageClick}
          />
          <ImageCarousel
            images={initialRandomImages3}
            handleImageClick={handleImageClick}
          />
        </StyleSheetManager>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const initialRandomImages1 = await fetchImagesWithFallback();
  const initialRandomImages2 = await fetchImagesWithFallback();
  const initialRandomImages3 = await fetchImagesWithFallback();

  return {
    props: {
      initialRandomImages1,
      initialRandomImages2,
      initialRandomImages3,
    },
    revalidate: 60 * 5,
  };
}

async function fetchImagesWithFallback() {
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

    const photos = response.data.photos;

    if (!photos || photos.length === 0) {
      console.warn("Fetched data is empty. Trying again.");
      return await fetchImagesWithFallback();
    }

    return photos;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized access. Please check your API key.");
    } else {
      console.error("Error fetching images:", error.message);
    }

    return [];
  }
}

export default Home;
