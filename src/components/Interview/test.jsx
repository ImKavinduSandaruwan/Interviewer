import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Lottie from "lottie-react";
import womanAnimation from "../../assets/women.json";
import man2Animation from "../../assets/man2.json";
import man3Animation from "../../assets/man3.json";
import { useNavigate } from "react-router-dom";

// Main interview page component
export const InterviewMainPage = () => {
  const navigate = useNavigate();

  // State variables
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [interviewStage, setInterviewStage] = useState("preparing");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(true); // Initially disabled
  const [elapsedTime, setElapsedTime] = useState(0);
  const [voices, setVoices] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [collectedAnswers, setCollectedAnswers] = useState([]);
  const [interviewId, setInterviewId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState("");
  const [isSelectingRole, setIsSelectingRole] = useState(true);

  // Refs
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const streamRef = useRef(null); // To manage the camera stream
  const interviewStartedRef = useRef(false);
  const lottieRefs = {
    Priya: useRef(null),
    David: useRef(null),
    Daniel: useRef(null),
  };

  // Load available voices with retry mechanism
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length === 0) {
        setTimeout(loadVoices, 100);
        return;
      }
      setVoices(availableVoices);
      console.log(
        "Available voices:",
        availableVoices.map((v) => ({ name: v.name, lang: v.lang }))
      );
    };

    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Camera control functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // UseEffect to control camera based on isVideoOff
  useEffect(() => {
    if (!isVideoOff) {
      startCamera();
      return () => {
        stopCamera();
      };
    }
  }, [isVideoOff]);

  // UseEffect for timer only
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  // Start the interview flow after role selection
  useEffect(() => {
    const startInterview = async () => {
      try {
        setInterviewStage("preparing");
        const token = sessionStorage.getItem("token");
        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const response = await axios.post(
          "/api/v1/interview",
          {
            role: selectedRole,
            seniority_level: selectedExperienceLevel,
            candidate_id: "candidate124",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Interview session started:", response.data.interview_id);
        setInterviewId(response.data.interview_id);

        if (response.data?.questions) {
          setQuestions(response.data.questions);

          // Greeting
          setInterviewStage("greeting");
          setCurrentQuestionIndex(-1);
          const greetingSpeaker = getCurrentSpeaker();
          console.log("Greeting speaker:", greetingSpeaker);
          await speakText(
            "Hi, welcome, and thank you for joining us today! We appreciate your time. Let me introduce the interview panel. I am Priya and I will be part of today's discussion. Let's begin the interview.",
            greetingSpeaker
          );

          // Questions loop
          setInterviewStage("questions");
          for (let i = 0; i < response.data.questions.length; i++) {
            setCurrentQuestionIndex(i);
            const speaker = getCurrentSpeaker();
            console.log(`Question ${i + 1} speaker:`, speaker);
            const questionObj = response.data.questions[i];
            await speakText(questionObj.question, speaker);

            const candidateResponse = await listenForCandidateResponse();
            console.log(`Candidate Response for Question ${i + 1}:`, candidateResponse);
            setCollectedAnswers((prev) => [
              ...prev,
              {
                question_id: questionObj.id,
                answer_text: candidateResponse,
              },
            ]);
          }

          // Closing
          setInterviewStage("closing");
          setCurrentQuestionIndex(response.data.questions.length);
          const closingSpeaker = getCurrentSpeaker();
          console.log("Closing speaker:", closingSpeaker);
          await speakText(
            "That concludes our interview. Thank you for your time. If you have any questions, feel free to ask.",
            closingSpeaker
          );

          // User choice stage
          setInterviewStage("user-choice");
        }
      } catch (error) {
        console.error("Failed to start interview session:", error);
      }
    };

    if (voices.length > 0 && !isSelectingRole && !interviewStartedRef.current) {
      interviewStartedRef.current = true;
      startInterview();
    }
  }, [voices, isSelectingRole, selectedRole, selectedExperienceLevel]);

  // Capture candidate response or question via speech recognition
  const listenForCandidateResponse = () => {
    return new Promise((resolve) => {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.error("Speech recognition not supported in this browser.");
        setTimeout(() => resolve(""), 10000);
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";
      let finalTranscript = "";
      recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          finalTranscript += event.results[i][0].transcript;
        }
      };
      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };
      recognition.onend = () => {
        resolve(finalTranscript);
      };
      recognition.start();
      setTimeout(() => {
        recognition.stop();
      }, 10000);
    });
  };

  // Voice synthesis with speaker-specific settings
  const speakText = (text, speaker) => {
    return new Promise((resolve) => {
      if (isMuted) {
        setTimeout(resolve, 1000);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);

      const getFemaleVoice = () => {
        const femaleVoices = ["Google UK English Female"];
        const femaleVoice = voices.find((v) => femaleVoices.includes(v.name));
        console.log(`Selected female voice for ${speaker}:`, femaleVoice?.name || "Default");
        return femaleVoice || voices.find((v) => /female/i.test(v.name)) || voices[0];
      };

      const getMaleVoice = () => {
        const maleVoices = ["Microsoft Mark - English (United States)"];
        const maleVoice = voices.find((v) => maleVoices.includes(v.name));
        console.log(`Selected male voice for ${speaker}:`, maleVoice?.name || "Default");
        return maleVoice || voices.find((v) => /male/i.test(v.name)) || voices[1] || voices[0];
      };

      switch (speaker) {
        case "Priya":
          utterance.voice = getFemaleVoice();
          break;
        case "David":
        case "Daniel":
          utterance.voice = getMaleVoice();
          break;
        default:
          utterance.voice = voices[0];
          console.log(`Default voice selected for ${speaker}`);
      }

      utterance.pitch = speaker === "Priya" ? 1.2 : 0.8;
      utterance.rate = speaker === "Daniel" ? 1.1 : 1.0;

      utterance.onstart = () => {
        console.log(`Starting to speak with ${speaker}'s voice:`, utterance.voice?.name);
      };
      utterance.onend = () => {
        console.log(`Finished speaking with ${speaker}'s voice:`, utterance.voice?.name);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  };

  // Control Lottie animations based on current speaker
  useEffect(() => {
    const currentSpeaker = getCurrentSpeaker();
    Object.keys(lottieRefs).forEach((name) => {
      if (lottieRefs[name].current) {
        if (name === currentSpeaker && interviewStage !== "preparing" && interviewStage !== "user-choice") {
          lottieRefs[name].current.play();
        } else {
          lottieRefs[name].current.stop();
        }
      }
    });
  }, [currentQuestionIndex, interviewStage]);

  // Get current display text for UI
  const getCurrentText = () => {
    if (interviewStage === "preparing") {
      return "Preparing your interview...";
    } else if (interviewStage === "greeting") {
      return "Welcome , how are you doing?";
    } else if (
      interviewStage === "questions" &&
      currentQuestionIndex >= 0 &&
      currentQuestionIndex < questions.length
    ) {
      return questions[currentQuestionIndex].question;
    } else if (interviewStage === "closing") {
      return "That concludes our interview. Thank you for your time. If you have any questions, feel free to ask.";
    }
    return "";
  };

  // Format elapsed time into HH:MM:SS
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Determine current speaker
  const getCurrentSpeaker = () => {
    const speakers = ["Priya", "David", "Daniel"];
    if (interviewStage === "greeting" || interviewStage === "closing") {
      return "Priya";
    } else if (interviewStage === "questions" && currentQuestionIndex >= 0) {
      return speakers[currentQuestionIndex % speakers.length];
    }
    return "Priya";
  };

  // Handle asking a question
  const handleAskQuestion = async () => {
    setIsListening(true);
    const question = await listenForCandidateResponse();
    console.log("Question asked:", question);
    setIsListening(false);
    if (question) {
      try {
        setIsLoading(true);
        const token = sessionStorage.getItem("token");
        console.log("Token for ask:", token);
        const response = await axios.post(
          "/api/v1/interview/ask",
          { question },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Response to question:", response.data);
        const currentSpeaker = getCurrentSpeaker();
        speakText(response.data.tts_friendly_answer, currentSpeaker);
        setIsLoading(false);
        setShowProgress(true);
        setTimeout(() => {
          setShowProgress(false);
        }, 3000);
      } catch (error) {
        console.error("Failed to ask question:", error);
        setIsLoading(false);
        setShowProgress(true);
        setTimeout(() => {
          setShowProgress(false);
        }, 3000);
      }
    }
  };

  // Handle ending the interview
  const handleEndInterview = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        "/api/v1/interview/result",
        {
          interview_id: interviewId,
          answers: collectedAnswers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Interview results posted successfully!", response.data);
      if (response.data && response.data.results) {
        const allFeedback = response.data.results.flatMap(
          (result) => result.feedback || []
        );
        setFeedback(allFeedback);
        setShowFeedback(true);
      }
    } catch (err) {
      console.error("Failed to post interview results:", err);
    }
  };

  // Interviewers data for UI
  const interviewers = [
    {
      name: "Priya",
      role: "Human Resources",
      isSpeaking: getCurrentSpeaker() === "Priya",
      animation: womanAnimation,
      refKey: "Priya",
    },
  ];

  // Render audio visualization bars
  const renderAudioBars = () => {
    const bars = [];
    for (let i = 0; i < 8; i++) {
      const height = Math.floor(Math.random() * 12) + 4;
      const animationDuration = (Math.random() * 0.8 + 0.2).toFixed(2);
      const animationDelay = (Math.random() * 0.5).toFixed(2);
      bars.push(
        <div
          key={i}
          className="w-1 bg-blue-500 rounded-t-sm opacity-80"
          style={{
            height: `${height}px`,
            animation: `audiowave ${animationDuration}s ease-in-out ${animationDelay}s infinite alternate`,
          }}
        />
      );
    }
    return bars;
  };

  // Render role and experience selection form
  if (isSelectingRole) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center p-7">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-6 text-white">Select Your Role and Experience Level</h2>
          <div className="flex flex-col space-y-4 w-full max-w-xs">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="p-2 border rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select Role</option>
              <option value="Software Engineer">Software Engineer</option>
              <option value="QA Engineer">QA Engineer</option>
              <option value="Project Manager">Project Manager</option>
            </select>
            <select
              value={selectedExperienceLevel}
              onChange={(e) => setSelectedExperienceLevel(e.target.value)}
              className="p-2 border rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select Experience Level</option>
              <option value="junior">Junior</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
            </select>
            <button
              onClick={() => setIsSelectingRole(false)}
              className={`px-4 py-2 rounded text-white ${
                selectedRole && selectedExperienceLevel
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-600 cursor-not-allowed"
              }`}
              disabled={!selectedRole || !selectedExperienceLevel}
            >
              Start Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col overflow-hidden p-7">
      {/* Inline styles for animations */}
      <div
        dangerouslySetInnerHTML={{
          __html: `
            <style>
              @keyframes audiowave {
                0% { height: 4px; }
                100% { height: 20px; }
              }
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            </style>
          `,
        }}
      />

      <div className="flex flex-col h-full max-h-full">
        {/* Header */}
        <div className="flex justify-between items-center p-2 sm:p-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Professional Interview
            </h1>
            <p className="text-blue-400 text-sm">
              {selectedExperienceLevel.charAt(0).toUpperCase() + selectedExperienceLevel.slice(1)} {selectedRole} Position
            </p>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="px-2 py-1 sm:px-4 sm:py-2 bg-blue-600 rounded-lg font-medium animate-pulse text-sm">
              LIVE
            </div>
            <div className="px-2 py-1 sm:px-4 sm:py-2 bg-gray-800 rounded-lg text-sm">
              {formatTime(elapsedTime)}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col bg-gray-800 rounded-lg overflow-hidden shadow-2xl border border-gray-700 mx-2 sm:mx-4 mb-2 sm:mb-4">
          {/* Top bar */}
          <div className="flex items-center justify-between bg-gray-900 px-3 py-2 border-b border-gray-700">
            <div className="flex items-center">
              <button className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center mr-3">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-white">
                  <path
                    d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
                    fill="currentColor"
                  />
                </svg>
              </button>
              <div className="hidden sm:block">
                <h2 className="text-sm sm:text-lg font-medium text-blue-400">
                  {selectedRole} Interview
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Interview ID: SE-2025-001-009
                </p>
              </div>
              <div className="sm:hidden">
                <h2 className="text-sm font-medium text-blue-400">
                  {selectedRole.split(" ")[0]} Interview
                </h2>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded-md text-xs flex items-center">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                  <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                </svg>
               率先
                <span className="hidden sm:inline">Support</span>
              </button>
              <button className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded-md text-xs flex items-center">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1.586l-1.707-1.707A1 1 0 0012 2H8a1 1 0 00-.707.293L5.586 4H4z" />
                </svg>
                <span className="hidden sm:inline">Record</span>
              </button>
            </div>
          </div>

          {/* Main video and interviewers section */}
          <div className="flex-1 flex flex-col lg:flex-row p-2 gap-2 overflow-hidden">
            {/* Video section */}
            <div className="flex-grow flex flex-col h-full overflow-hidden">
              <div className="relative bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center border border-gray-700 shadow-lg flex-1">
                {isVideoOff ? (
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-blue-600 flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold">K</span>
                    </div>
                    <p className="text-lg font-medium">Camera Off</p>
                  </div>
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                    poster="/placeholder-user.jpg"
                  />
                )}

                <div className="absolute top-2 left-2 right-2 flex justify-between">
                  <div className="bg-gray-900 bg-opacity-75 px-2 py-1 rounded-lg flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></div>
                    <span className="text-xs">Presenting</span>
                  </div>
                </div>

                <div className="absolute bottom-4 left-2 right-2">
                  {interviewStage === "user-choice" ? (
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-2 shadow-lg">
                      {isListening ? (
                        <p className="text-sm">Listening for your question...</p>
                      ) : isLoading ? (
                        <div className="flex justify-center items-center">
                          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                        </div>
                      ) : showProgress ? (
                        <div className="flex justify-center items-center">
                          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <p className="text-sm mb-4">Do you have any questions?</p>
                          <div className="flex space-x-4">
                            <button
                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                              onClick={handleAskQuestion}
                            >
                              Ask
                            </button>
                            <button
                              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                              onClick={handleEndInterview}
                            >
                              End
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      className={`bg-gray-800 border ${
                        interviewStage === "questions"
                          ? "border-blue-500"
                          : "border-gray-700"
                      } rounded-lg p-2 shadow-lg`}
                    >
                      <div className="flex items-center mb-1">
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center mr-2">
                          <span className="text-xs font-bold">
                            {getCurrentSpeaker().charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-blue-400 text-xs">
                          {getCurrentSpeaker()} is asking:
                        </span>
                      </div>
                      <p className="text-sm">{getCurrentText()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Control buttons */}
              <div className="flex justify-center space-x-2 sm:space-x-4 py-2 mt-2">
                <button
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${
                    isMuted ? "bg-red-600" : "bg-gray-700 hover:bg-gray-600"
                  } flex items-center justify-center`}
                  onClick={() => setIsMuted(!isMuted)}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                  >
                    {isMuted ? (
                      <path
                        d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"
                        fill="currentColor"
                      />
                    ) : (
                      <path
                        d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.72 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"
                        fill="currentColor"
                      />
                    )}
                  </svg>
                </button>
                <button
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${
                    isVideoOff ? "bg-red-600" : "bg-gray-700 hover:bg-gray-600"
                  } flex items-center justify-center`}
                  onClick={() => setIsVideoOff(!isVideoOff)}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                  >
                    {isVideoOff ? (
                      <path
                        d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82L21 17.18V6.5zM3.27 2L2 3.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 3.27 2z"
                        fill="currentColor"
                      />
                    ) : (
                      <path
                        d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"
                        fill="currentColor"
                      />
                    )}
                  </svg>
                </button>
                <button
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
                  onClick={() => {
                    const currentSpeaker = getCurrentSpeaker();
                    if (
                      currentQuestionIndex >= 0 &&
                      currentQuestionIndex < questions.length
                    ) {
                      speakText(
                        questions[currentQuestionIndex].question,
                        currentSpeaker
                      );
                    } else if (interviewStage === "greeting") {
                      speakText(
                        "Hi, welcome, and thank you for joining us today! We appreciate your time. Let me introduce the interview panel. I am Priya and with me join today this is David and Daniel, who will be part of today's discussion. Let's begin the interview.",
                        currentSpeaker
                      );
                    } else if (interviewStage === "closing") {
                      speakText(
                        "That concludes our interview. Thank you for your time. If you have any questions, feel free to ask.",
                        currentSpeaker
                      );
                    }
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                  >
                    <path
                      d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
                <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Interviewers section */}
            <div className="lg:w-64 flex flex-row lg:flex-col overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden gap-2">
              <div className="flex lg:flex-col gap-2 min-w-max lg:min-w-0">
                {interviewers.map((interviewer, index) => (
                  <div
                    key={index}
                    className={`relative rounded-lg overflow-hidden transition-all duration-300 border min-w-40 sm:min-w-48 lg:min-w-0 ${
                      interviewer.isSpeaking
                        ? "border-blue-500 shadow-lg shadow-blue-500/20"
                        : "border-gray-700"
                    }`}
                  >
                    <div className="aspect-video bg-gray-800 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lottie
                          animationData={interviewer.animation}
                          lottieRef={lottieRefs[interviewer.refKey]}
                          style={{ width: "100%", height: "100%" }}
                          autoplay={false}
                          loop={true}
                        />
                      </div>

                      {interviewer.isSpeaking && (
                        <>
                          <div className="absolute bottom-1 left-1 right-1 flex items-center justify-center">
                            <div className="bg-blue-600 px-1 py-0.5 rounded-full text-xs font-medium animate-pulse">
                              Speaking
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-4 flex items-end justify-center gap-1 px-2">
                            {renderAudioBars()}
                          </div>
                        </>
                      )}
                    </div>

                    <div className="bg-gray-900 p-1.5 flex items-center justify-between">
                      <div>
                        <h3 className="text-xs font-medium">
                          {interviewer.name}
                        </h3>
                        <p className="text-xxs text-gray-400">
                          {interviewer.role}
                        </p>
                      </div>
                      <div className="flex space-x-1">
                        <button className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center">
                          <svg
                            viewBox="0 0 24 24"
                            className="w-3 h-3 text-gray-300"
                          >
                            <path
                              d="M3 9v6h4l5 5V4L7 9H3z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback popup */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-lg shadow-lg max-w-lg w-full mx-4 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Interview Feedback</h2>
              <button
                onClick={() => {
                  setShowFeedback(false);
                  navigate("/home");
                }}
                className="text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              <ul className="list-disc pl-5 space-y-2">
                {feedback.map((msg, idx) => (
                  <li key={idx} className="text-sm text-gray-800">
                    {msg}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 border-t border-gray-200 text-right">
              <button
                onClick={() => {
                  setShowFeedback(false);
                  navigate("/home");
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};