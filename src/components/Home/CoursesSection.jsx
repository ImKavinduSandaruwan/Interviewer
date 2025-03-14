import React, { useRef, useState, useEffect } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const FALLBACK_IMAGE =
  "https://m.media-amazon.com/images/I/61cqQC9+H9L._SY425_.jpg";

const CourseCard = ({ image, title, description, link, onClick, type }) => {
  const content = (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="flex flex-col bg-white rounded-[25px] p-[20px] h-[340px] shadow-sm shadow-[#B120304D] overflow-hidden"
    >
      <div className="relative h-48 sm:h-[215px] max-w-[330px] lg:block hidden">
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

      <div className="relative h-48 sm:h-[215px] lg:hidden">
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

  if (type === "video") {
    return (
      <div
        onClick={(e) => {
          e.preventDefault();
          onClick && onClick();
        }}
        style={{ cursor: "pointer" }}
      >
        {content}
      </div>
    );
  } else {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
};

const Section = ({ title, courses, showMore = true, onVideoClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef(null);

  const itemsPerPage = {
    sm: 1,
    md: 2,
    lg: 4,
  };

  const getVisibleItems = () => {
    const width = window.innerWidth;
    let items = itemsPerPage.sm;
    if (width >= 1024) items = itemsPerPage.lg;
    else if (width >= 640) items = itemsPerPage.md;
    return items;
  };

  const next = () => {
    if (currentIndex < courses.length - getVisibleItems()) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="lg:py-8 mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="lg:text-[36px] text-[24px] font-semibold leading-[24px] font-poppins text-black">
            {title}
          </h2>
          {showMore && (
            <a
              href="#"
              className="text-[#B12030] hover:text-red-700 text-[20px] leading-[24px] font-medium font-poppins"
            >
              See More
            </a>
          )}
        </div>

        <div className="relative">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              ref={containerRef}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              custom={direction}
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {courses
                .slice(currentIndex, currentIndex + getVisibleItems())
                .map((course, idx) => (
                  <CourseCard
                    key={currentIndex + idx}
                    {...course}
                    onClick={
                      course.type === "video" && onVideoClick
                        ? () => onVideoClick(course)
                        : undefined
                    }
                  />
                ))}
            </motion.div>
          </AnimatePresence>

          {currentIndex > 0 && (
            <button
              onClick={prev}
              className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-red-600 rounded-full p-2 text-white shadow-lg hover:bg-red-700 focus:outline-none transition-all duration-200 ease-in-out"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {currentIndex < courses.length - getVisibleItems() && (
            <button
              onClick={next}
              className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-red-600 rounded-full p-2 text-white shadow-lg hover:bg-red-700 focus:outline-none transition-all duration-200 ease-in-out"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
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

const CoursesSection = () => {
  const location = useLocation();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [persistedResources, setPersistedResources] = useState({});

  useEffect(() => {
    const savedResources = localStorage.getItem('resourcesToImprove');
    const initialResources = savedResources 
      ? JSON.parse(savedResources)
      : location.state?.resourcesToImprove || {};
    setPersistedResources(initialResources);

    if (location.state?.resourcesToImprove) {
      localStorage.setItem('resourcesToImprove', JSON.stringify(location.state.resourcesToImprove));
    }
  }, [location.state]);

  const extractAsin = (url) => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/");
      const asinIndex = pathParts.indexOf("dp");
      if (asinIndex !== -1 && pathParts.length > asinIndex + 1) {
        return pathParts[asinIndex + 1];
      }
      return null;
    } catch (e) {
      console.error("Invalid Amazon URL:", url, e);
      return null;
    }
  };

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

  const transformResources = (title, type, links) => {
    return links.slice(0, 10).map((link, index) => {
      if (type === "ebooks") {
        const asin = extractAsin(link);
        const coverUrl = asin
          ? `https://covers.openlibrary.org/b/isbn/${asin}-L.jpg`
          : FALLBACK_IMAGE;
        return {
          image: coverUrl,
          title: `${title} EBook ${index + 1}`,
          description: `Learn more about ${title}`,
          link,
          type: "ebook",
        };
      } else if (type === "videos") {
        const videoId = extractVideoId(link);
        const thumbnailUrl = videoId
          ? `https://img.youtube.com/vi/${videoId}/0.jpg`
          : FALLBACK_IMAGE;
        return {
          image: thumbnailUrl,
          title: `${title} Video ${index + 1}`,
          description: `Learn more about ${title}`,
          link,
          type: "video",
        };
      }
      return null;
    });
  };

  return (
    <div className="bg-white min-h-screen">
      {Object.keys(persistedResources).length > 0 ? (
        Object.keys(persistedResources).map((title) => (
          <React.Fragment key={title}>
            <Section
              title={`${title} eBooks`}
              courses={transformResources(
                title,
                "ebooks",
                persistedResources[title].ebooks || []
              )}
            />
            <Section
              title={`${title} Videos`}
              courses={transformResources(
                title,
                "videos",
                persistedResources[title].videos || []
              )}
              onVideoClick={(course) => {
                setSelectedVideo(course);
              }}
            />
          </React.Fragment>
        ))
      ) : (
        <div className="text-center py-10">
          <h2 className="text-[24px] font-semibold font-poppins">
            No Resources Available
          </h2>
          <p className="text-[#564D4D] text-[16px] font-medium font-poppins">
            Please Upload the CV to receive personalized
            learning resources.
          </p>
        </div>
      )}
      {selectedVideo && (
        <VideoModal
          videoId={extractVideoId(selectedVideo.link)}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};

export default CoursesSection;