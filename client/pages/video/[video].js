import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { getAPIKey, getAPIBaseURL } from '../../API/API_pexels';

const VideoPage = () => {
  const router = useRouter();
  const { video } = router.query;
  const [videoData, setVideoData] = useState(null);
  const apiKey = getAPIKey(); 

  useEffect(() => {
    const fetchVideoData = async () => {
      if (video) {
        try {
          const response = await axios.get(`https://api.pexels.com/videos/videos/${video}`, {
            headers: {
              Authorization: apiKey,
            },
          });

          setVideoData(response.data);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchVideoData();
  }, [video, apiKey]);

  if (!videoData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{videoData.id}</h1>
      <p>Duration: {videoData.duration} seconds</p>
      <video width="640" height="360" controls>
        <source src={videoData.video_files[0].link} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <p>
        <a href={videoData.url} target="_blank" rel="noopener noreferrer">
          View on Pexels
        </a>
      </p>
    </div>
  );
};

export default VideoPage;

