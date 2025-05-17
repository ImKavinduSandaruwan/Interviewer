import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

// Animation variants remain unchanged
const starBurst = {
  initial: { scale: 0, opacity: 1, x: 0, y: 0 },
  animate: (i) => ({
    scale: [0, 1.5, 0],
    opacity: [1, 1, 0],
    x: Math.cos((i * Math.PI) / 8) * 300,
    y: Math.sin((i * Math.PI) / 8) * 300,
    transition: { duration: 1, ease: "easeOut" },
  }),
};

const swirlLine = {
  initial: { pathLength: 0, opacity: 0 },
  animate: {
    pathLength: [0, 1],
    opacity: [0, 1, 0],
    transition: { duration: 1.5, ease: "easeInOut" },
  },
};

const pointsBounce = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: [0, 1.3, 1],
    opacity: [0, 1, 1],
    transition: { duration: 0.8, times: [0, 0.5, 1] },
  },
};

const scaleUp = {
  initial: { scale: 0 },
  animate: {
    scale: [0, 1.6, 1],
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
  const [recommendations, setRecommendations] = useState([]);
  const [timer, setTimer] = useState(30);
  const [level, setLevel] = useState("Beginner");
  const [completionReason, setCompletionReason] = useState(null);

  const correctSoundRef = useRef(null);
  const incorrectSoundRef = useRef(null);
  const pointsSoundRef = useRef(null);
  const completionSoundRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Existing useEffect and function definitions remain unchanged
  useEffect(() => {
    const fetchInitialQuestion = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) throw new Error("No authentication token found. Please log in.");
        const response = await axios.post(
          "/api/v1/mcq",
          { role: "SE", chapter: "Intern" },
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
        const data = response.data;
        setQuizData(data);
        setPreviousPoints(data.points || 0);
        setSessionId(data.session_id);
        setLevel(data.level || "Beginner");
        setSelectedAnswers([]);
        if (data.done === true) {
          setQuizCompleted(true);
          setCompletionReason("done");
        }
      } catch (error) {
        setError(`Failed to fetch question: ${error.message}`);
      }
    };
    fetchInitialQuestion();
  }, []);

  useEffect(() => {
    if (!showResult && quizData && !quizCompleted && selectedAnswers.length === 0) {
      setTimer(30);
      const intervalId = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(intervalId);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [quizData, showResult, quizCompleted]);

  useEffect(() => {
    if (showResult && lastAnswerCorrect !== null && soundEnabled) {
      if (lastAnswerCorrect) {
        correctSoundRef.current?.play().catch((e) => console.error("Error playing sound:", e));
      } else {
        incorrectSoundRef.current?.play().catch((e) => console.error("Error playing sound:", e));
      }
    }
  }, [showResult, lastAnswerCorrect, soundEnabled]);

  useEffect(() => {
    if (showPointsAnimation && soundEnabled) {
      pointsSoundRef.current?.play().catch((e) => console.error("Error playing sound:", e));
    }
  }, [showPointsAnimation, soundEnabled]);

  useEffect(() => {
    if (quizCompleted && soundEnabled) {
      completionSoundRef.current?.play().catch((e) => console.error("Error playing sound:", e));
    }
  }, [quizCompleted, soundEnabled]);

  const handleAnswerSelect = (index) => {
    if (!showResult && !quizCompleted) {
      setSelectedAnswers((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    }
  };

  const triggerEnhancedConfetti = () => {
    const count = 300;
    const defaults = {
      origin: { y: 0.7 },
      colors: ["#FF0000", "#FFA500", "#FFFF00", "#00FF00", "#0000FF", "#FF00FF"],
      shapes: ["star", "circle"],
    };
    confetti({ ...defaults, particleCount: count, spread: 120, scalar: 1.3 });
    confetti({ ...defaults, particleCount: count, spread: 120, scalar: 1.3, angle: 60 });
    confetti({ ...defaults, particleCount: count, spread: 120, scalar: 1.3, angle: 120 });
  };

  const handleSubmit = async () => {
    if (!quizData || !sessionId) {
      setError("Question data is not ready or session missing.");
      return;
    }
    try {
      const token = sessionStorage.getItem("token");
      const action = selectedAnswers.length > 0 ? selectedAnswers.join(",") : "-1";
      const response = await axios.post(
        "/api/v1/mcq/submit",
        { action, response_time: 3.0 },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "X-Session-ID": sessionId } }
      );

      console.log("token", token);
      const data = response.data;
      const isCorrect = data.correct;
      setLastAnswerCorrect(isCorrect);
      setLevel(data.level || "Beginner");

      setCorrectAnswer(
        isCorrect || !data.correct_answer || typeof data.correct_answer !== "string"
          ? null
          : data.correct_answer.split(",").map(Number)
      );

      const newPoints = data.points || 0;
      const gainedPoints = newPoints - previousPoints;
      setPointsGained(gainedPoints);
      if (gainedPoints > 0 && isCorrect) {
        setTimeout(() => {
          setShowPointsAnimation(true);
          triggerEnhancedConfetti();
        }, 500);
        setTimeout(() => setShowPointsAnimation(false), 3000);
      } else {
        setShowPointsAnimation(false);
      }

      setPreviousPoints(newPoints);
      setQuizData(data);
      setSelectedAnswers([]);
      setShowResult(true);

      if (data.done === true) {
        setQuizCompleted(true);
        setCompletionReason("done");
        setTimeout(() => triggerEnhancedConfetti(), 300);
      } else if (data.game_over === true) {
        setQuizCompleted(true);
        setCompletionReason("game_over");
      }
    } catch (error) {
      setError(`Failed to submit answer: ${error.message}`);
    }
  };

  const handleNext = () => {
    setShowResult(false);
    setCorrectAnswer(null);
    setLastAnswerCorrect(null);
  };

  const handleCloseCompletionPopup = async () => {
    setQuizCompleted(false);
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get("/api/v1/mcq/report", {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "X-Session-ID": sessionId },
      });
      setIncorrectAnswers(response.data.incorrectAnswers || []);
      setRecommendations(response.data.recommendations || []);
      setShowSummary(true);
    } catch (err) {
      navigate("/home");
    }
  };

  const handleCloseSummary = () => {
    setShowSummary(false);
    navigate("/videos");
  };

  const toggleSound = () => setSoundEnabled(!soundEnabled);

  const getOptionClassName = (index) => {
    let baseClass =
      "p-10 text-[16px] leading-[24px] font-medium font-poppins rounded-[20px] shadow-sm shadow-[#B120301A] text-center border transition-all ";
    const isSelected = selectedAnswers.includes(index);

    if (!showResult) {
      return isSelected
        ? baseClass + "border-2 border-black bg-gray-100"
        : baseClass + "border-gray-200 hover:border-gray-300";
    } else {
      if (lastAnswerCorrect) {
        if (isSelected) {
          return baseClass + "border-2 border-[#1EFF00] bg-white text-[#1EFF00]";
        }
        return baseClass + "border-gray-200";
      } else {
        const isCorrectAnswer = correctAnswer && correctAnswer.includes(index);
        if (isCorrectAnswer) {
          return baseClass + "border-2 border-[#1EFF00] bg-white text-[#1EFF00]";
        } else if (isSelected) {
          return baseClass + "border-2 border-[#DB0000] bg-white text-[#DB0000]";
        }
        return baseClass + "border-gray-200";
      }
    }
  };

  if (!quizData || !quizData.options) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 overflow-hidden">
      <audio ref={correctSoundRef} src="/sounds/correct.mp3" preload="auto" />
      <audio ref={incorrectSoundRef} src="/sounds/incorrect.mp3" preload="auto" />
      <audio ref={pointsSoundRef} src="/sounds/points.mp3" preload="auto" />
      <audio ref={completionSoundRef} src="/sounds/completion.mp3" preload="auto" />

      <div className="fixed top-4 right-4 flex gap-2 z-10">
  
        <button
          onClick={() => navigate('/home')}
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Stop Quiz"
          title="Stop Quiz"
        >
          <X className="h-5 w-5 text-red-600" />
        </button>
      </div>

      <AnimatePresence>
        {showPointsAnimation && lastAnswerCorrect && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <svg className="absolute w-full h-full" style={{ pointerEvents: "none" }}>
              {[...Array(4)].map((_, i) => (
                <motion.path
                  key={`swirl-${i}`}
                  d={`M${window.innerWidth / 2} ${window.innerHeight / 2} C${window.innerWidth * 0.3 * (i % 2 ? 1 : -1)} ${
                    window.innerHeight * 0.3
                  } ${window.innerWidth * 0.5 * (i % 2 ? -1 : 1)} ${window.innerHeight * 0.7} ${
                    window.innerWidth * (i % 2 ? 0.2 : 0.8)
                  } ${window.innerHeight * (i < 2 ? 0.1 : 0.9)}`}
                  stroke={["#FF0000", "#00FF00", "#0000FF", "#FFFF00"][i]}
                  strokeWidth="4"
                  fill="none"
                  variants={swirlLine}
                  initial="initial"
                  animate="animate"
                />
              ))}
            </svg>
            <div className="relative w-full h-full overflow-hidden">
              {[...Array(16)].map((_, i) => (
                <motion.div
                  key={`star-${i}`}
                  className="absolute text-2xl"
                  style={{
                    left: "50%",
                    top: "50%",
                    color: ["#FFD700", "#FF69B4", "#00CED1", "#ADFF2F"][i % 4],
                    fontSize: `${1.5 + (i % 3)}rem`,
                  }}
                  variants={starBurst}
                  initial="initial"
                  animate="animate"
                  custom={i}
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
                className="bg-gradient-to-r from-green-400 to-blue-500 rounded-full p-6 shadow-2xl"
                style={{ filter: "drop-shadow(0 0 10px rgba(0, 255, 0, 0.5))" }}
                variants={scaleUp}
                initial="initial"
                animate="animate"
              >
                <motion.div
                  className="text-7xl font-bold text-white flex items-center"
                  variants={pointsBounce}
                >
                  <motion.span className="mr-3">🎉</motion.span>
                  <motion.span
                    animate={{ scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 0.5, repeat: 3 }}
                  >
                    +{pointsGained}
                  </motion.span>
                  <motion.span className="ml-3">🏆</motion.span>
                </motion.div>
              </motion.div>
              <motion.div
                className="mt-6 text-3xl font-bold text-green-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0.8, 1.3, 1] }}
                transition={{ duration: 1.5, times: [0, 0.5, 1] }}
              >
                Awesome Work!
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[650px] mx-auto p-4 mb-12">
        <div className="bg-white rounded-full border border-[#B12030] p-1.5 flex flex-col sm:flex-row gap-2 shadow-sm">
          <div className="flex">
            <button className="bg-red-700 text-white rounded-full py-3 px-5 flex items-center gap-4 hover:bg-red-800 transition-colors">
              <div className="flex items-center gap-3">
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
                <div className="text-left">
                  <div className="font-semibold text-[12px] leading-[18px] font-poppins">
                    Experience Level
                  </div>
                  <div className="font-semibold text-[10px] leading-[15px] font-poppins">
                    Junior
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
              key={level}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {level}
            </motion.span>
          </div>
        </div>
      </div>

      <div className="max-wxs-[1167px] mx-auto">
        <motion.div
          className="p-[50px] max-w-[862px] border border-[#B120301A]/10 rounded-[40px] mx-auto shadow-md shadow-[#B120301A]/10 mb-10 bg-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          key={quizData.question}
        >
          <div className="text-[22px] leading-[33px] font-medium font-poppins text-[#564D4D] text-center mb-8">
            {quizData.question}
          </div>
        </motion.div>

        {!showResult && !quizCompleted && selectedAnswers.length === 0 && (
          <div className="text-center mb-4">
            <p className={`text-lg font-semibold ${timer <= 5 ? "text-red-600" : "text-black"}`}>
              Time left: {timer} seconds
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {quizData.options.map((option, index) => {
            const isSelected = selectedAnswers.includes(index);
            const isCorrectAnswer = correctAnswer && correctAnswer.includes(index);
            return (
              <motion.button
                key={`${quizData.question}-${index}`}
                onClick={() => handleAnswerSelect(index)}
                className={getOptionClassName(index)}
                disabled={showResult || quizCompleted}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  ...(showResult && lastAnswerCorrect && isSelected
                    ? { scale: [1, 1.1, 1], transition: { duration: 0.5, repeat: 4 } }
                    : showResult && !lastAnswerCorrect && isCorrectAnswer
                    ? { scale: [1, 1.1, 1], transition: { duration: 0.5, repeat: 4 } }
                    : showResult && !lastAnswerCorrect && isSelected
                    ? { x: [-5, 5, -5, 5, 0], transition: { duration: 0.5 } }
                    : {}),
                }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                whileHover={!showResult && !quizCompleted ? { scale: 1.02 } : {}}
                whileTap={!showResult && !quizCompleted ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>{option}</span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {!showResult && !quizCompleted && (
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
                        <div className="text-green-400 font-bold">Correct :)</div>
                        <div>
                          {selectedAnswers.length > 0
                            ? `Selected: ${selectedAnswers.map((idx) => quizData.options[idx]).join(", ")}`
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
                        <svg width="24" height="24" viewBox="0 0 103 94" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M32 32L72 72M72 32L32 72" stroke="#DB0000" strokeWidth="6" strokeLinecap="round" />
                        </svg>
                      </motion.div>
                      <div>
                        <div className="text-red-400 font-bold">You are on the way</div>
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
                  Start Next Question
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
                  <motion.h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {completionReason === "done" ? "Congratulations!" : "Game Over"}
                  </motion.h2>
                  <motion.p className="text-gray-600 mb-6">
                    {completionReason === "done" ? "You’ve completed the quiz successfully!" : "Better luck next time!"}
                  </motion.p>
                  <motion.p className="font-medium text-gray-700 mb-6">Level achieved: {level}</motion.p>
                </div>
                <motion.button
                  onClick={handleCloseCompletionPopup}
                  className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-colors w-full font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Report
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
                className="bg-white rounded-lg p-8 max-w-lg w-full text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 20 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Quiz Report</h2>
                <div className="text-left max-h-[60vh] overflow-y-auto pr-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Recommendations for Improvement</h3>
                  {recommendations.length > 0 ? (
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      {recommendations.map((rec, idx) => (
                        <li key={idx} className="text-left flex items-start">
                          <span className="text-red-600 mr-2">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">No recommendations available.</p>
                  )}
                </div>
                <button
                  onClick={handleCloseSummary}
                  className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-colors w-full font-medium mt-6"
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