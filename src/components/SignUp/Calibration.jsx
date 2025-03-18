import React, { useState, useEffect } from "react";
import { Upload, ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Calibration = () => {
  const [step, setStep] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [questions, setQuestions] = useState([]); // State for fetched questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Index for current question
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [selectedFile, setSelectedFile] = useState(null); // State for selected CV file
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    jobRole: "Software Engineer",
    experience: "Junior",
    targetRole: "Mid",
    primarySkill: "Java",
    EnglishLevel: "C1",
  });

  // Fetch token, user ID on mount, and questions when step changes to 2
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");
    console.log("Retrieved token:", token);
    console.log("Retrieved user ID:", userId);

    if (step === 2 && userId && token) {
      fetchQuestions(userId, token);
    }
  }, [step]);

  // Function to fetch questions from the endpoint
  const fetchQuestions = async (userId, token) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/v1/calibration/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Store the questionsList from the response
      setQuestions(response.data.questionsList || []);
      setCurrentQuestionIndex(0); // Reset to first question
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError("Failed to load questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Basic Details", isActive: true },
    { number: 2, title: "Skill Assessment", isActive: false },
    { number: 3, title: "Upload CV", isActive: true },
  ];

  const handleSubmitAssessment = () => {
    setShowResults(true);
  };

  const handleContinueToCV = () => {
    setShowResults(false);
    setStep(3);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAndContinue = async () => {
    if (!formData.fullName.trim()) {
      alert("Full Name is required.");
      return;
    }

    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");

    if (!token || !userId) {
      console.error("Missing token or user ID. Please log in.");
      alert("Authentication error. Please log in again.");
      navigate("/login");
      return;
    }

    const payload = {
      fullName: formData.fullName,
      jobRole: formData.jobRole,
      experience: formData.experience,
      targetRole: formData.targetRole,
      primarySkill: formData.primarySkill,
      EnglishLevel: formData.EnglishLevel,
    };

    console.log("Payload:", payload);

    try {
      const response = await axios.post(
        `/api/v1/user-basic/${userId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("API Response:", response.data);
      setStep(2); // Move to Skill Assessment
      // Add these lines to store jobRole and experience in session storage
      if(formData.jobRole == "Software Engineer"){
        sessionStorage.setItem("jobRole", "SE");
      }else if(formData.jobRole == "Product Manager"){
        sessionStorage.setItem("jobRole", "PM");
      }else if(formData.jobRole == "QA"){
        sessionStorage.setItem("jobRole", "QA");
      }

      if(formData.experience == "Junior"){
        sessionStorage.setItem("experience", "Intern");
      }else if(formData.experience == "Mid"){
        sessionStorage.setItem("experience", "Associate");
      }else if(formData.experience == "Senior"){
        sessionStorage.setItem("experience", "Senior");
      }

      console.log("jobRole:", sessionStorage.getItem("jobRole"));
      console.log("experience:", sessionStorage.getItem("experience"));


    } catch (error) {
      console.error(
        "Error saving basic details:",
        error.response?.data || error.message
      );
      alert("Failed to save details. Please try again.");
    }
  };

  // Handle navigation to previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(""); // Reset selected answer
    }
  };

  // Handle navigation to next question
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(""); // Reset selected answer
    }
  };

  // Handle CV upload
  const handleUpload = async () => {
    if (!selectedFile || selectedFile.type !== "application/pdf") {
      alert("Please select a PDF file.");
      return;
    }

    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("Authentication token is missing. Please log in again.");
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("/api/v1/cv/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Upload successful:", response.data);
      alert("CV uploaded successfully!");
      // Pass resources_to_improve to /home via navigation state
      //navigate("/home", { state: { resourcesToImprove: response.data.resources_to_improve } });
      // Calibration.jsx (inside handleUpload, after successful upload)
      const userId = sessionStorage.getItem("userId");
      // Add this line before navigation
      localStorage.setItem(`calibrationCompleted_${userId}`, "true");
      navigate("/home", {
        state: { resourcesToImprove: response.data.resources_to_improve },
      });
    } catch (error) {
      console.error("Error uploading CV:", error);
      alert("Failed to upload CV. Please try again.");
    }
  };

  const renderStepContent = () => {
    if (showResults && step === 2) {
      return (
        <div className="max-w-4xl mx-auto lg:px-4 px-5 text-center">
          <h2 className="text-[24px] font-semibold leading-[36px] font-poppins mb-4 mt-[130px]">
            Thank You for Completing the Assessment!
          </h2>
          <p className="text-[#564D4D] text-[16px] leading-[24px] font-medium font-poppins max-w-[754px] mx-auto mb-12">
            We are currently analyzing your responses to initialize your skill
            level. Stay tuned for the next steps in your journey!
          </p>
          <button
            onClick={handleContinueToCV}
            className="bg-[#B12030] text-white text-[16px] leading-[24px] font-medium font-poppins px-5 py-2 rounded-[20px]"
          >
            Continue
          </button>
        </div>
      );
    }

    switch (step) {
      case 1:
        return (
          <div className="max-w-7xl mx-auto lg:px-4 px-6">
            <h2 className="text-[20px] font-semibold leading-[30px] font-poppins mb-2">
              Basic Details
            </h2>
            <p className="text-[#564D4DB2]/70 text-[16px] leading-[24px] max-w-[1272px] mx-auto font-medium font-poppins mb-8">
              We'd like to know more about you! Please provide your basic
              details, including your job preferences, experience level, and
              career goals. These details will help us personalize your
              experience and match you with the best opportunities.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6 p-[50px] bg-[#F1F4F8] rounded-[40px]">
                <div>
                  <label className="block mb-2 text-[#564D4D] text-[16px] leading-[24px] font-medium font-poppins">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter Full Name"
                    className="w-full px-[18px] py-[17px] rounded-[100px] font-medium font-poppins text-[14px] leading-[21px] border"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-[#564D4D] text-[16px] leading-[24px] font-medium font-poppins">
                    What is your current job role?
                  </label>
                  <select
                    name="jobRole"
                    value={formData.jobRole}
                    onChange={handleInputChange}
                    className="w-full px-[18px] py-[17px] rounded-[100px] font-medium font-poppins text-[14px] leading-[21px] border"
                  >
                    <option value="SE">Software Engineer</option>
                    <option value="PM">Product Manager</option>
                    <option value="QA">QA</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-[#564D4D] text-[16px] leading-[24px] font-medium font-poppins">
                    How many years of experience do you have?
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-[18px] py-[17px] rounded-[100px] font-medium font-poppins text-[14px] leading-[21px] border"
                  >
                    <option value="Intern">Junior (0-2 years)</option>
                    <option value="Associate">Mid (3-5 years)</option>
                    <option value="Senior">Senior (6+ years)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-6 p-[50px] bg-[#F1F4F8] rounded-[40px]">
                <div>
                  <label className="block mb-2 text-[#564D4D] text-[16px] leading-[24px] font-medium font-poppins">
                    What is your desired seniority level?
                  </label>
                  <select
                    name="targetRole"
                    value={formData.targetRole}
                    onChange={handleInputChange}
                    className="w-full px-[18px] py-[17px] rounded-[100px] font-medium font-poppins text-[14px] leading-[21px] border"
                  >
                    <option value="Mid">Mid-level</option>
                    <option value="Senior">Senior-level</option>
                    <option value="Lead">Lead</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-[#564D4D] text-[16px] leading-[24px] font-medium font-poppins">
                    Which field are you most interested in?
                  </label>
                  <select
                    name="primarySkill"
                    value={formData.primarySkill}
                    onChange={handleInputChange}
                    className="w-full px-[18px] py-[17px] rounded-[100px] font-medium font-poppins text-[14px] leading-[21px] border"
                  >
                    <option value="Java">Java</option>
                    <option value="Python">Python</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-[#564D4D] text-[16px] leading-[24px] font-medium font-poppins">
                    How would you rate your English proficiency?
                  </label>
                  <select
                    name="EnglishLevel"
                    value={formData.EnglishLevel}
                    onChange={handleInputChange}
                    className="w-full px-[18px] py-[17px] rounded-[100px] font-medium font-poppins text-[14px] leading-[21px] border"
                  >
                    <option value="A1">A1 (Beginner)</option>
                    <option value="B1">B1 (Intermediate)</option>
                    <option value="C1">C1 (Advanced)</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleSaveAndContinue}
                className="bg-[#B12030] text-[16px] font-medium leading-[24px] font-poppins text-white px-[20px] py-2 rounded-[20px]"
              >
                Save & Continue
              </button>
            </div>
          </div>
        );

      case 2:
        if (loading) {
          return <div className="text-center">Loading questions...</div>;
        }
        if (error) {
          return <div className="text-center text-red-500">{error}</div>;
        }
        if (questions.length === 0) {
          return <div className="text-center">No questions available.</div>;
        }

        const currentQuestion = questions[currentQuestionIndex];
        return (
          <div className="max-w-7xl mx-auto lg:px-4 px-6">
            <h2 className="text-[20px] font-semibold leading-[30px] font-poppins mb-2">
              Skill Assessment
            </h2>
            <p className="text-[#564D4DB2]/70 text-[16px] leading-[24px] max-w-[1272px] mx-auto font-medium font-poppins mb-8">
              The following questions are designed to evaluate your knowledge
              and skills based on the job role you selected. Answer each
              question to the best of your ability. This assessment is just a
              step to help you showcase your expertise!
            </p>
            <div className="mb-8 max-w-4xl mx-auto px-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[14px] font-medium font-poppins leading-[21px] text-[#564D4D80]/50 mb-2">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </p>
                  <p className="mb-4 text-[#564D4D] text-[16px] leading-[24px] font-medium font-poppins">
                    {currentQuestion.question}
                  </p>
                </div>
                <div className="flex justify-end items-center">
                  <button
                    onClick={handleSubmitAssessment}
                    className="bg-[#B12030] text-[16px] leading-[24px] font-medium font-poppins text-white px-5 py-2 rounded-[20px]"
                  >
                    Submit
                  </button>
                </div>
              </div>
              <div className="space-y-6">
                {["answer1", "answer2", "answer3", "answer4"].map(
                  (ansKey, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded-full border-b-[#564D4D4D] cursor-pointer ${
                        selectedAnswer === ansKey
                          ? "bg-black text-white"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedAnswer(ansKey)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-[25px] h-[24px] rounded-full border border-[#564D4D] p-[16px] text-[12px] bg-white text-black flex items-center justify-center">
                          {String.fromCharCode(97 + index)} {/* a, b, c, d */}
                        </span>
                        <span className="text-[16px] font-semibold font-poppins leading-[24px]">
                          {currentQuestion[ansKey]}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
            {questions.length > 1 && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={handlePrevious}
                  className="p-2 rounded-full bg-red-50 disabled:opacity-50"
                  disabled={currentQuestionIndex === 0}
                >
                  <ChevronLeft className="w-5 h-5 text-red-700" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-full bg-red-50 disabled:opacity-50"
                  disabled={currentQuestionIndex === questions.length - 1}
                >
                  <ChevronRight className="w-5 h-5 text-red-700" />
                </button>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="max-w-4xl mx-auto lg:px-4 px-6 text-center">
            <h2 className="text-2xl font-semibold font-poppins mb-3">
              Submit Your CV Here
            </h2>
            <p className="text-[#564D4D] text-sm leading-relaxed font-medium max-w-[882px] mx-auto font-poppins mb-8">
              Simply drag and drop your CV into the upload area or click to
              browse files on your device. Once uploaded confirm the file to
              complete the sign-up.
            </p>

            <div className="flex justify-center">
              <div className="border-2 border-[#E2E8F0] bg-[#F1F4F8] rounded-3xl lg:w-[666px] h-[278px] p-8 mb-8 transition-all hover:border-[#B12030]/30 shadow-sm">
                <div className="flex flex-col items-center justify-center h-full">
                  <input
                    type="file"
                    id="cv-upload"
                    accept=".pdf"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="hidden"
                  />
                  <label
                    htmlFor="cv-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <svg
                      width="60"
                      height="60"
                      viewBox="0 0 50 50"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mb-4 text-[#564D4D] transition-transform hover:scale-110"
                    >
                      <path
                        d="M25.0078 42.7085L24.999 23.9585"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M42.2058 35.746C45.6294 33.3386 47.0973 28.9899 45.8332 25.0001C44.5691 21.0103 40.6982 18.8245 36.513 18.8277H34.0953C32.5148 12.6681 27.3 8.12063 20.9826 7.393C14.6651 6.66538 8.55312 9.90821 5.61364 15.5473C2.67416 21.1863 3.51587 28.0539 7.73014 32.8162"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M31.6289 28.7875L24.9998 22.1584L18.3706 28.7875"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex items-center gap-2">
                      <p className="text-[#B12030] underline text-sm font-medium font-poppins hover:text-[#901828] transition-colors">
                        Click to Upload
                      </p>
                      <p className="text-[#564D4D] text-sm font-medium font-poppins">
                        or drag and drop your file here
                      </p>
                    </div>
                    <p className="text-[#564D4D]/70 text-xs mt-2 font-poppins">
                      Supported format: PDF (Max size: 5MB)
                    </p>
                  </label>
                </div>
              </div>
            </div>

            {selectedFile && (
              <div className="bg-[#F1F4F8] rounded-lg p-3 max-w-md mx-auto mb-6 flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 text-[#B12030]"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  <p className="text-sm text-[#564D4D] font-medium truncate max-w-xs">
                    {selectedFile.name}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-[#564D4D] hover:text-[#B12030] transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            )}

            <button
              onClick={handleUpload}
              className={`bg-[#B12030] text-white text-base font-medium font-poppins px-8 py-3 rounded-full mb-5 shadow-sm transition-all ${
                selectedFile
                  ? "hover:bg-[#901828] hover:shadow-md"
                  : "opacity-50 cursor-not-allowed"
              }`}
              disabled={!selectedFile}
            >
              Upload & Continue
            </button>

            <div className="text-sm">
              <span className="text-[#564D4D]/50 text-xs font-medium font-poppins">
                Don't have a CV?{" "}
              </span>
              <button
                onClick={() => navigate("/login")}
                className="text-[#B12030] underline text-xs font-medium font-poppins hover:text-[#901828] transition-colors"
              >
                Skip
              </button>
              <span className="text-[#564D4D]/50 text-xs font-medium font-poppins">
                {" "}
                this for now.
              </span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="text-right lg:px-4 px-6 mb-8 max-w-7xl mx-auto">
        <div className="gap-[10px] flex flex-row justify-end">
          <span className="text-[#564D4DB2]/70 text-[14px] leading-[21px] font-semibold font-poppins">
            Already have an account?{" "}
          </span>
          <a
            href="/login"
            className="text-[#B12030] underline hover:underline text-[14px] leading-[21px] font-semibold font-poppins"
          >
            Log in
          </a>
        </div>
      </div>
      <h1 className="text-[24px] font-semibold leading-[36px] font-poppins text-center mb-12">
        {step === 1
          ? "Let's Get to Know You!"
          : "Let's Showcase Your Expertise!"}
      </h1>
      <div className="max-w-lg mx-auto px-4 mb-12">
        <div className="flex items-center">
          {steps.map((s, index) => (
            <React.Fragment key={s.number}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full text-[14px] flex items-center justify-center mb-2 ${
                    step >= s.number
                      ? "bg-[#DB0000] text-white"
                      : "bg-[#564D4D1A]/10 text-gray-600"
                  }`}
                >
                  {s.number}
                </div>
                <div className="text-[12px] font-semibold leading-[18px] font-poppins text-center">
                  {s.title}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-[1.5px] relative top-[-14px]">
                  <div
                    className={`h-full ${
                      step > s.number ? "bg-[#DB0000]" : "bg-[#564D4D80]/50"
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      {renderStepContent()}
    </div>
  );
};

export default Calibration;
