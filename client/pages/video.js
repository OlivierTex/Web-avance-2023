import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link'; 
import { getAPIKey, getAPIBaseURL } from '../API/API_pexels';

const Video = () => {
  const [videos, setVideos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 15;
  const apiKey = getAPIKey();

  useEffect(() => {
    loadVideos(currentPage);
  }, [currentPage]);

  const loadVideos = async (page) => {
    const apiUrl = `https://api.pexels.com/videos/search?query=nature&per_page=${itemsPerPage}&page=${page}`;

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: apiKey,
        },
      });

      setVideos(response.data.videos);
      setTotalPages(Math.ceil(response.data.total_results / itemsPerPage));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadVideos(1);
  };

  return (
    <div>
      <h1>Video Gallery</h1>
      <form onSubmit={handleSearch}>
        <button type="submit">Search for Nature Videos</button>
      </form>
      <div>
        {videos.map((video) => (
          <div key={video.id}>
            <h3>{video.id}</h3>
            <p>Duration: {video.duration} seconds</p>
            <Link href="/video/[id]" as={`/video/${video.id}`}>
              <div style={{ display: 'block' }}>
                <img src={video.image} alt="Video Thumbnail" />
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div>
        {/* Pagination logic here */}
      </div>
    </div>
  );
};

export default Video;

