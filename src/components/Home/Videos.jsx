import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

const FALLBACK_IMAGE =
  "https://m.media-amazon.com/images/I/61cqQC9+H9L._SY425_.jpg";

const CourseCard = ({ image, title, description, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="flex flex-col bg-white rounded-[25px] p-[20px] h-[340px] shadow-sm shadow-[#B120304D] overflow-hidden cursor-pointer"
    >
      <div className="relative h-48 sm:h-[215px]">
        <img
          src={image || FALLBACK_IMAGE}
          alt={title}
          className="w-full h-full object-cover rounded-[15px]"
          loading="lazy"
          onLoad={(e) => {
            if (
              e.currentTarget.naturalWidth === 1 &&
              e.currentTarget.naturalHeight === 1
            ) {
              e.currentTarget.src = FALLBACK_IMAGE;
            }
          }}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
      </div>

      <div className="mt-2">
        <h3 className="text-[17px] leading-[24px] font-medium font-serif_4 text-black">
          {title}
        </h3>
        <p className="mt-1 text-[15px] font-normal leading-[20px] font-serif_4 text-[#00000099]/60">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

const VideoModal = ({ videoId, onClose }) => {
  const [error, setError] = useState(false);

  const handleError = () => {
    setError(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 relative w-full max-w-3xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-black font-bold"
        >
          X
        </button>
        {error ? (
          <div className="text-center text-red-600">
            Not available right now.
          </div>
        ) : (
          <iframe
            width="100%"
            height="400"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onError={handleError}
            title="Video Player"
          ></iframe>
        )}
      </div>
    </div>
  );
};

const Videos = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { title, courses } = location.state || { title: "Videos", courses: [] };
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [recommendedVideos, setRecommendedVideos] = useState([]);

  useEffect(() => {
    const userID = sessionStorage.getItem("userId");
    console.log("User ID:", userID);
    const fetchVideoData = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      try {
        console.log("Token in videos:", token);
        const response = await axios.get(`/api/v1/video/${userID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("API response status:", response.status);
        if (response.status !== 200) {
          throw new Error("Failed to fetch video data");
        }

        const data = response.data;
        console.log("API response:", data);

        // Transform API data into a flat list of videos
        const transformedVideos = data.catDtoList
          .filter((cat) => cat.videoDtoList && cat.videoDtoList.length > 0)
          .flatMap((cat, catIndex) =>
            cat.videoDtoList.map((video, index) => {
              const videoId = extractVideoId(video.url);
              return {
                image: videoId
                  ? `https://img.youtube.com/vi/${videoId}/0.jpg`
                  : FALLBACK_IMAGE,
                title: `Recommended Video ${catIndex * cat.videoDtoList.length + index + 1}`,
                description: `Explore more about ${cat.type.replace(/_/g, " ")}`,
                link: video.url,
                type: "video",
              };
            })
          );

        setRecommendedVideos(transformedVideos);
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };

    fetchVideoData();
  }, []);

  const extractVideoId = (url) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.host === "www.youtu.be" || urlObj.host === "youtu.be") {
        return urlObj.pathname.slice(1);
      }
      let videoId = urlObj.searchParams.get("v");
      if (videoId) {
        return videoId;
      }
      if (
        urlObj.host === "www.youtube.com" &&
        urlObj.pathname.startsWith("/v/")
      ) {
        return urlObj.pathname.split("/")[2];
      }
      return null;
    } catch (e) {
      console.error("Invalid YouTube URL:", url, e);
      return null;
    }
  };

  const handleVideoClick = (course) => {
    const userId = sessionStorage.getItem("userId");
    if (userId) {
      const historyKey = `history_${userId}`;
      let history = JSON.parse(localStorage.getItem(historyKey)) || [];
      if (!history.some((item) => item.link === course.link)) {
        const updatedHistory = [course, ...history];
        localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
      }
    }
    setSelectedVideo(course);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/home")}
            className="mr-4 text-[#B12030] hover:text-red-700"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="lg:text-[36px] text-[24px] font-semibold leading-[24px] font-poppins text-black">
            Back
          </h2>
        </div>

        {courses.length > 0 ? (
          <div className="mb-12">
            <h3 className="text-[24px] font-semibold font-poppins mb-6">
              {title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {courses.map((course, idx) => (
                <CourseCard
                  key={`course-${idx}`}
                  {...course}
                  onClick={() => handleVideoClick(course)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div >
            
          </div>
        )}

        {recommendedVideos.length > 0 && (
          <div className="mt-12">
            <h3 className="text-[24px] font-semibold font-poppins mb-6">
              Recommended Videos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedVideos.map((video, idx) => (
                <CourseCard
                  key={`recommended-video-${idx}`}
                  {...video}
                  onClick={() => handleVideoClick(video)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedVideo && (
        <VideoModal
          videoId={extractVideoId(selectedVideo.link)}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};

export default Videos;