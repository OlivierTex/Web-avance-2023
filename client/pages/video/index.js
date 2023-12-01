import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { getAPIKey } from "../../API/API_pexels";

const Video = () => {
  const [videos, setVideos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 24;
  const apiKey = getAPIKey();
  const [viewMode, setViewMode] = useState("default");
  const [imagesPerRow, setImagesPerRow] = useState(4);

  useEffect(() => {
    loadVideos(currentPage);
  }, [currentPage]);

  const loadVideos = async (page) => {
    const apiUrl =
      searchTerm === ""
        ? `https://api.pexels.com/videos/search?query=nature&per_page=${itemsPerPage}&page=${page}`
        : `https://api.pexels.com/videos/search?query=${searchTerm}&per_page=${itemsPerPage}&page=${page}`;

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

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleImagesPerRowChange = (num) => {
    setImagesPerRow(num);
  };

  const getClassName = (count) => {
    switch (count) {
      case 2:
        return "w-6/12";
      case 4:
        return "w-3/12";
      case 6:
        return "w-2/12";
      default:
        return "w-3/12";
    }
  };

  const VideoThumbnail = ({ video, index, onViewEnter, onViewLeave }) => {
    const videoRef = useRef(null);

    useEffect(() => {
      const handleMouseEnter = async () => {
        try {
          if (videoRef.current) {
            if (videoRef.current.paused) {
              await videoRef.current.play();
              onViewEnter(index);
            }
          }
        } catch (error) {
          console.error("Error playing video:", error);
        }
      };

      const handleMouseLeave = () => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
          onViewLeave(index);
        }
      };

      if (videoRef.current) {
        videoRef.current.addEventListener("mouseenter", handleMouseEnter);
        videoRef.current.addEventListener("mouseleave", handleMouseLeave);
      }

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener("mouseenter", handleMouseEnter);
          videoRef.current.removeEventListener("mouseleave", handleMouseLeave);
        }
      };
    }, [index, onViewEnter, onViewLeave]);

    return (
      <Link key={video.id} href={`/video/${video.id}`} passHref>
        <div className="video-thumbnail-container relative">
          <video
            className="video-preview"
            controls={false}
            autoPlay={false}
            muted
            loop
            ref={videoRef}
          >
            <source src={video.video_files[0].link} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </Link>
    );
  };

  const GridView = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (
      <div className="w-4/5 mx-auto">
        <br />
        <br />
        <div
          className={`grid grid-cols-1 ${
            imagesPerRow === 2 ? "sm:grid-cols-2" : ""
          } ${imagesPerRow === 4 ? "md:grid-cols-4" : ""} ${
            imagesPerRow === 6 ? "grid-cols-6" : ""
          } gap-4 place-items-center`}
        >
          {videos.map((video, index) => (
            <VideoThumbnail
              key={video.id}
              video={video}
              index={index}
              onViewEnter={() => setHoveredIndex(index)}
              onViewLeave={() => setHoveredIndex(null)}
            />
          ))}
        </div>
      </div>
    );
  };

  const DefaultView = () => {
    return (
      <div className="w-4/5 mx-auto">
        <div className="flex flex-wrap justify-center mt-8 gap-y-4">
          {videos.map((video) => (
            <div
              key={video.id}
              className={`${getClassName(imagesPerRow)} px-2 aspect-[1]`}
            >
              <Link href={`/video/${video.id}`} passHref>
                <div className="block h-full relative group bg-custom4 border border-custom1 p-1 overflow-hidden cursor-pointer">
                  <img
                    src={video.image}
                    className="w-full h-full object-cover transition-transform duration-500 transform hover:scale-110"
                    alt="Video Thumbnail"
                  />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-light dark:bg-dark">
      <h1 className="h1">Video Gallery</h1>
      <p className="paragraphe">
        Découvrez notre sélection de vidéo de haute qualité.
      </p>
      <br />
      <div className="w-4/5 mx-auto">
        <form
          onSubmit={handleSearch}
          className="flex justify-center mb-2 dropdown rounded-md"
        >
          <input
            type="search"
            id="video-search"
            className="block p-4 pl-10 w-1/3 text-sm text-gray-900 bg-gray-50 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ml-4"
            placeholder="Search Videos..."
            required
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="text-white bg-gray-800 px-4 py-2 rounded-md ml-4"
          >
            Search
          </button>
          <div className=" ml-4">
            <button
              onClick={() => handleImagesPerRowChange(2)}
              className={`${
                imagesPerRow === 2
                  ? "border border-gray-800 bg-gray-200"
                  : "bg-gray-100"
              } px-4 py-2 rounded-md`}
            >
              <img src="/images/layout-1-64.svg" className="w-8 h-8" />
            </button>
            <button
              onClick={() => handleImagesPerRowChange(4)}
              className={`${
                imagesPerRow === 4
                  ? "border border-gray-800 bg-gray-200"
                  : "bg-gray-100"
              } px-4 py-2 rounded-md ml-2`}
            >
              <img src="/images/layout-2-64.svg" className="w-8 h-8" />
            </button>
            <button
              onClick={() => handleImagesPerRowChange(6)}
              className={`${
                imagesPerRow === 6
                  ? "border border-gray-800 bg-gray-200"
                  : "bg-gray-100"
              } px-4 py-2 rounded-md ml-2`}
            >
              <img src="/images/layout-3-64.svg" className="w-8 h-8" />
            </button>
          </div>
        </form>
      </div>
      <br />
      <br />

      <div className="container mx-auto ">
        <div className="flex justify-center mb-4 ">
          <button
            onClick={() => setViewMode("default")}
            className={`px-4 py-2 rounded-md ${
              viewMode === "default" ? "bg-gray-300" : ""
            }`}
          >
            Default View
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`px-4 py-2 rounded-md ml-2 ${
              viewMode === "grid" ? "bg-gray-300" : ""
            }`}
          >
            Grid View
          </button>
        </div>
        {viewMode === "default" ? <DefaultView /> : null}
        {viewMode === "grid" ? <GridView /> : null}
      </div>

      <br />
      <br />
      <br />
      <br />
      <div className="flex justify-center mb-4">
        <ul className="inline-flex -space-x-px text-sm">
          <li>
            <button
              onClick={() => handlePageClick(Math.max(1, currentPage - 1))}
              className={`flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                currentPage === 1
                  ? "cursor-not-allowed dark:text-gray-600 dark:bg-gray-700"
                  : ""
              }`}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>

          {Array.from({ length: 5 }, (_, index) => {
            let pageNumber =
              currentPage > 2 ? currentPage - 2 + index : index + 1;
            return (
              <li key={pageNumber}>
                <button
                  onClick={() => handlePageClick(pageNumber)}
                  aria-current={currentPage === pageNumber ? "page" : undefined}
                  className={`flex items-center justify-center px-3 h-8 leading-tight border ${
                    currentPage === pageNumber
                      ? "text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-gray-700 dark:text-white"
                      : "text-gray-500 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  }`}
                >
                  {pageNumber}
                </button>
              </li>
            );
          })}

          <li>
            <button
              onClick={() =>
                handlePageClick(Math.min(totalPages, currentPage + 1))
              }
              className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                currentPage === totalPages
                  ? "cursor-not-allowed dark:text-gray-600 dark:bg-gray-700"
                  : ""
              }`}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Video;
