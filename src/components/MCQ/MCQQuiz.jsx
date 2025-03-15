import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

// Animation variants
const floatingStars = {
  initial: { y: 0, opacity: 1, scale: 0 },
  animate: {
    y: -100,
    opacity: [1, 0],
    scale: [1, 1.5],
    transition: { duration: 1.5, ease: "linear", repeat: Infinity },
  },
};

const pointsBounce = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: [0, 1.2, 1],
    opacity: [0, 1, 1],
    transition: { duration: 0.8, times: [0, 0.5, 1] },
  },
};

const scaleUp = {
  initial: { scale: 0 },
  animate: {
    scale: [0, 1.5, 1],
    transition: { duration: 0.6, times: [0, 0.8, 1] },
  },
};

function MCQQuiz() {
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [previousPoints, setPreviousPoints] = useState(0);
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);
  const [pointsGained, setPointsGained] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const [timer, setTimer] = useState(5);

  const correctSoundRef = useRef(null);
  const incorrectSoundRef = useRef(null);
  const pointsSoundRef = useRef(null);
  const completionSoundRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Fetch initial question
  useEffect(() => {
    const fetchInitialQuestion = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          setError("No authentication token found. Please log in.");
          return;
        }
        const response = await axios.post(
          "/api/v1/mcq",
          { role: "SE", chapter: "Intern" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setQuizData(response.data);
        setPreviousPoints(response.data.points || 0);
        setSessionId(response.data.session_id);
        if (response.data.done === true) {
          setQuizCompleted(true);
        }
      } catch (error) {
        setError(`Failed to fetch question: ${error.message}`);
      }
    };

    fetchInitialQuestion();
  }, []);

  const handleAnswerSelect = (index) => {
    if (!showResult) {
      setSelectedAnswers((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      );
    }
  };

  const playSound = (soundRef) => {
    if (soundEnabled && soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current
        .play()
        .catch((e) => console.error("Error playing sound:", e));
    }
  };

  const triggerEnhancedConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ["#FF0000", "#FFA500", "#FFFF00", "#008000", "#0000FF"],
    };

    confetti({ ...defaults, particleCount: count, spread: 100, scalar: 1.2 });
    confetti({
      ...defaults,
      particleCount: count,
      spread: 100,
      scalar: 1.2,
      angle: 60,
    });
    confetti({
      ...defaults,
      particleCount: count,
      spread: 100,
      scalar: 1.2,
      angle: 120,
    });
  };

  const handleSubmit = async () => {
    if (!quizData || !sessionId) {
      setError("Question data is not ready or session missing.");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      const action =
        selectedAnswers.length > 0 ? selectedAnswers.join(",") : "-1";
      const response = await axios.post(
        "/api/v1/mcq/submit",
        { action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Session-ID": sessionId,
          },
        }
      );

      const isCorrect = response.data.is_correct;
      setLastAnswerCorrect(isCorrect);

      const correctAnswerData = response.data.correct_answer;
      setCorrectAnswer(
        isCorrect || !correctAnswerData || typeof correctAnswerData !== "string"
          ? null
          : correctAnswerData.split(",")
      );

      isCorrect ? playSound(correctSoundRef) : playSound(incorrectSoundRef);

      const newPoints = response.data.points || 0;
      const gainedPoints = newPoints - previousPoints;
      setPointsGained(gainedPoints);
      if (gainedPoints > 0) {
        setTimeout(() => {
          setShowPointsAnimation(true);
          playSound(pointsSoundRef);
          triggerEnhancedConfetti();
        }, 500);
        setTimeout(() => setShowPointsAnimation(false), 2500);
      } else {
        setShowPointsAnimation(false);
      }

      setPreviousPoints(newPoints);
      setQuizData(response.data);
      setShowResult(true);

      if (response.data.done === true) {
        setQuizCompleted(true);
        setTimeout(() => {
          triggerEnhancedConfetti();
          playSound(completionSoundRef);
        }, 300);
      }
    } catch (error) {
      console.error("Submit error:", error);
      setError(`Failed to submit answer: ${error.message}`);
      setShowResult(false);
    }
  };

  // Timer effect
  useEffect(() => {
    if (!showResult && quizData && selectedAnswers.length === 0) {
      setTimer(5);
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(intervalId);
            handleSubmit();
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [quizData, showResult, selectedAnswers]);

  const handleNext = () => {
    setShowResult(false);
    setSelectedAnswers([]);
    setCorrectAnswer(null);
  };

  const handleCloseCompletionPopup = async () => {
    setQuizCompleted(false);
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get("/api/v1/mcq/incorrect", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Session-ID": sessionId,
        },
      });
      setIncorrectAnswers(response.data.incorrectAnswers || []);
      setShowSummary(true);
    } catch (err) {
      console.error("Error fetching incorrect answers:", err);
      navigate("/home");
    }
  };

  const handleCloseSummary = () => {
    setShowSummary(false);
    navigate("/home");
  };

  const getLevelString = (points) => {
    if (points < 100) return "Beginner";
    if (points < 300) return "Intermediate";
    if (points < 600) return "Advanced";
    return "Expert";
  };

  const toggleSound = () => setSoundEnabled(!soundEnabled);

  const getOptionClassName = (index) => {
    let baseClass =
      "p-10 text-[16px] leading-[24px] font-medium font-poppins rounded-[20px] shadow-sm shadow-[#B120301A] text-center border transition-all ";

    if (!showResult) {
      return selectedAnswers.includes(index)
        ? baseClass + "border-2 border-black"
        : baseClass + "border-gray-200 hover:border-gray-300";
    } else {
      const isSelected = selectedAnswers.includes(index);
      const isCorrectAnswer =
        correctAnswer && correctAnswer.includes(String(index));

      if (isCorrectAnswer) {
        return baseClass + "border-2 border-[#1EFF00] bg-white text-[#1EFF00]";
      }
      if (isSelected && !isCorrectAnswer) {
        return (
          baseClass +
          "border-2 border-[#DB0000] bg-white text-[#DB0000] animate-shake"
        );
      }
      return baseClass + "border-gray-200";
    }
  };

  if (!quizData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>
    );
  }

  const points = quizData.points || 0;
  const levelString = getLevelString(points);

  return (
    <div className="min-h-screen bg-white p-4 md:p-6 overflow-hidden">
      <audio
        ref={correctSoundRef}
        src="/sounds/correct.mp3"
        preload="auto"
      ></audio>
      <audio
        ref={incorrectSoundRef}
        src="/sounds/incorrect.mp3"
        preload="auto"
      ></audio>
      <audio
        ref={pointsSoundRef}
        src="/sounds/points.mp3"
        preload="auto"
      ></audio>
      <audio
        ref={completionSoundRef}
        src="/sounds/completion.mp3"
        preload="auto"
      ></audio>

      <button
        onClick={toggleSound}
        className="fixed top-4 right-4 p-2 bg-white rounded-full shadow-md z-10"
      >
        {soundEnabled ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
        )}
      </button>

      <AnimatePresence>
        {showPointsAnimation && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative w-full h-full overflow-hidden">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={`star-${i}`}
                  className="absolute text-2xl"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  variants={floatingStars}
                  initial="initial"
                  animate="animate"
                >
                  ⭐
                </motion.div>
              ))}
            </div>
            <motion.div
              className="flex flex-col items-center z-50"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="bg-gradient-to-r from-yellow-400 to-red-500 rounded-full p-4 shadow-xl"
                variants={scaleUp}
                initial="initial"
                animate="animate"
              >
                <motion.div
                  className="text-6xl font-bold text-white flex items-center"
                  variants={pointsBounce}
                >
                  <motion.span className="mr-2">🎉</motion.span>
                  <motion.span
                    className="block"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      repeatType: "mirror",
                    }}
                  >
                    +{pointsGained}
                  </motion.span>
                  <motion.span className="ml-2">🏆</motion.span>
                </motion.div>
              </motion.div>
              <motion.div
                className="mt-4 text-2xl font-semibold text-yellow-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 1] }}
                transition={{ duration: 1.5, times: [0, 0.5, 1] }}
              >
                Keep it up!
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[650px] mx-auto p-4 mb-12">
        <div className="bg-white rounded-full border border-[#B12030] p-1.5 flex flex-col sm:flex-row gap-2">
          <div className="flex">
            <button className="bg-red-700 text-white rounded-full py-3 px-5 flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full flex items-center justify-center">
                  <svg
                    width="24"
                    height="32"
                    viewBox="0 0 20 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  ></svg>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-[12px] leading-[18px] font-poppins">
                    Current Role
                  </div>
                  <div className="font-medium text-[10px] leading-[15px] font-poppins">
                    Software Engineer
                  </div>
                </div>
              </div>
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>
          <div className="flex">
            <button className="bg-white rounded-full py-3 px-5 flex items-center gap-10 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="rounded-full flex items-center justify-center">
                  <svg
                    width="21"
                    height="27"
                    viewBox="0 0 21 27"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  ></svg>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-[12px] leading-[18px] font-poppins">
                    Senior Role
                  </div>
                  <div className="font-semibold text-[10px] leading-[15px] font-poppins">
                    Senior Software Engineer
                  </div>
                </div>
              </div>
              <ChevronDown className="h-5 w-5 text-black" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1167px] mx-auto mb-8">
        <div className="flex justify-between items-center max-w-[862px] mx-auto border-b border-gray-200 pb-4 mb-8">
          <div className="flex items-center">
            <span className="font-medium text-gray-700 mr-2">Level:</span>
            <motion.span
              className="font-bold text-red-700"
              key={levelString}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {levelString}
            </motion.span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-700 mr-2">Points:</span>
            <motion.span
              className="font-bold text-red-700"
              key={points}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5 }}
            >
              {points}
            </motion.span>
          </div>
        </div>
      </div>

      <div className="max-w-[1167px] mx-auto">
        <motion.div
          className="p-[50px] max-w-[862px] border border-[#B120301A]/10 rounded-[40px] mx-auto shadow-md shadow-[#B120301A]/10 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          key={quizData.question}
        >
          <div className="text-[22px] leading-[33px] font-medium font-poppins text-[#564D4D] text-center mb-8">
            {quizData.question}
          </div>
        </motion.div>

        {!showResult && selectedAnswers.length === 0 && (
          <div className="text-center mb-4">
            <p
              className={`text-lg font-semibold ${
                timer <= 2 ? "text-red-600" : "text-black"
              }`}
            >
              Time left: {timer} seconds
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {quizData.options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={getOptionClassName(index)}
              disabled={showResult}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-center gap-2">
                <span>{option}</span>
              </div>
            </motion.button>
          ))}
        </div>

        {!showResult && (
          <div className="flex justify-center mb-8">
            <motion.button
              onClick={handleSubmit}
              disabled={selectedAnswers.length === 0}
              className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit Answer
            </motion.button>
          </div>
        )}

        <AnimatePresence>
          {showResult && !quizCompleted && (
            <motion.div
              className={`fixed bottom-0 left-0 right-0 h-[150px] text-white px-4 py-12 ${
                lastAnswerCorrect ? "bg-green-600" : "bg-red-600"
              }`}
              initial={{ y: 150, scale: 0.8 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 150 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {lastAnswerCorrect ? (
                    <>
                      <motion.div
                        className="bg-green-500 rounded-full p-2"
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.2, 1] }}
                        transition={{ duration: 0.5 }}
                      >
                        <Check className="h-6 w-6" />
                      </motion.div>
                      <div>
                        <div className="text-green-400 font-bold">
                          Correct :)
                        </div>
                        <div>
                          {selectedAnswers.length > 0
                            ? `Selected: ${selectedAnswers
                                .map((idx) => quizData.options[idx])
                                .join(", ")}`
                            : "No answers selected"}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <motion.div
                        className="rounded-full p-2"
                        initial={{ rotate: 0 }}
                        animate={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 103 94"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M32 32L72 72M72 32L32 72"
                            stroke="#DB0000"
                            strokeWidth="6"
                            strokeLinecap="round"
                          />
                        </svg>
                      </motion.div>
                      <div>
                        <div className="text-red-400 font-bold">
                          You are on the way
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <motion.button
                  onClick={handleNext}
                  className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Next Question
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {quizCompleted && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-lg p-8 max-w-md w-full text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 20 }}
              >
                <div className="mb-4">
                  <motion.div
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <Check className="h-10 w-10 text-green-500" />
                  </motion.div>
                  <motion.h2
                    className="text-2xl font-bold text-gray-800 mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    Congratulations!
                  </motion.h2>
                  <motion.p
                    className="text-gray-600 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    You’ve completed the quiz successfully!
                  </motion.p>
                  <motion.p
                    className="font-bold text-xl text-red-600 mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    Final Score: {points} points
                  </motion.p>
                  <motion.p
                    className="font-medium text-gray-700 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    Level achieved: {levelString}
                  </motion.p>
                </div>
                <motion.button
                  onClick={handleCloseCompletionPopup}
                  className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-colors w-full font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  Continue
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSummary && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-lg p-8 max-w-md w-full text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 20 }}
              >
                <h2 className="text-2xl font-bold mb-4">
                  Summary of Incorrect Answers
                </h2>
                <div className="text-left max-h-96 overflow-y-auto pr-2">
                  {incorrectAnswers.length > 0 ? (
                    incorrectAnswers.map((item, idx) => (
                      <div key={idx} className="mb-4 border-b pb-3">
                        <p className="font-semibold">
                          Question: {item.question}
                        </p>
                        <p>Correct Answer: {item.correctAnswer}</p>
                        <p>Your Answer: {item.givenAnswer}</p>
                      </div>
                    ))
                  ) : (
                    <p>No incorrect answers found!</p>
                  )}
                </div>
                <button
                  onClick={handleCloseSummary}
                  className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-colors w-full font-medium mt-4"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default MCQQuiz;
