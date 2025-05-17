import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Calibration = () => {
  const [step, setStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    jobRole: "SE",
    experience: "Intern",
    targetRole: "Mid",
    primarySkill: "Java",
    EnglishLevel: "C1",
  });

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
      alert("Authentication error. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `/api/v1/user-basic/${userId}`,
        {
          fullName: formData.fullName,
          jobRole: formData.jobRole,
          experience: formData.experience,
          targetRole: formData.targetRole,
          primarySkill: formData.primarySkill,
          EnglishLevel: formData.EnglishLevel,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // store normalized values
      sessionStorage.setItem("jobRole", formData.jobRole);
      sessionStorage.setItem("experience", formData.experience);

      setStep(2);
    } catch (error) {
      console.error("Error saving basic details:", error);
      alert("Failed to save details. Please try again.");
    }
  };

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

    const data = new FormData();
    data.append("file", selectedFile);

    try {
      const response = await axios.post("/api/v1/cv/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      // mark calibration complete
      const userId = sessionStorage.getItem("userId");
      localStorage.setItem(`calibrationCompleted_${userId}`, "true");
      navigate("/home", {
        state: { resourcesToImprove: response.data.resources_to_improve },
      });
    } catch (error) {
      console.error("Error uploading CV:", error);
      alert("Failed to upload CV. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="text-right lg:px-4 px-6 mb-8 max-w-7xl mx-auto">
        <div className="gap-[10px] flex justify-end">
          <span className="text-[#564D4DB2] text-[14px] font-semibold">
            Already have an account?{" "}
          </span>
          <a
            href="/login"
            className="text-[#B12030] underline text-[14px] font-semibold"
          >
            Log in
          </a>
        </div>
      </div>

      <h1 className="text-[24px] font-semibold text-center mb-12">
        {step === 1
          ? "Let's Get to Know You!"
          : "Submit Your CV Here"}
      </h1>

      {step === 1 && (
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-[20px] font-semibold mb-2">Basic Details</h2>
          <p className="text-[#564D4D80] mb-8">
            Please provide your basic details to personalize your experience.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6 p-8 bg-[#F1F4F8] rounded-2xl">
              <div>
                <label className="block mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter Full Name"
                  className="w-full px-4 py-3 rounded-full border"
                />
              </div>
              <div>
                <label className="block mb-2">Current Job Role</label>
                <select
                  name="jobRole"
                  value={formData.jobRole}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-full border"
                >
                  <option value="SE">Software Engineer</option>
                  <option value="PM">Product Manager</option>
                  <option value="QA">QA</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Experience Level</label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-full border"
                >
                  <option value="Intern">Junior (0-2 years)</option>
                  <option value="Associate">Mid (3-5 years)</option>
                  <option value="Senior">Senior (6+ years)</option>
                </select>
              </div>
            </div>

            <div className="space-y-6 p-8 bg-[#F1F4F8] rounded-2xl">
              <div>
                <label className="block mb-2">Desired Seniority</label>
                <select
                  name="targetRole"
                  value={formData.targetRole}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-full border"
                >
                  <option value="Mid">Mid-level</option>
                  <option value="Senior">Senior-level</option>
                  <option value="Lead">Lead</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Primary Skill</label>
                <select
                  name="primarySkill"
                  value={formData.primarySkill}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-full border"
                >
                  <option value="Java">Java</option>
                  <option value="Python">Python</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">English Proficiency</label>
                <select
                  name="EnglishLevel"
                  value={formData.EnglishLevel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-full border"
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
              className="bg-[#B12030] text-white px-6 py-2 rounded-full"
            >
              Save & Continue
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-4xl mx-auto text-center px-6">
          <p className="mb-8">
            Drag & drop your CV or click to browse. PDF only (max 5MB).
          </p>

          <div className="border-2 border-[#E2E8F0] bg-[#F1F4F8] rounded-3xl p-8 mb-6 hover:border-[#B12030]/30">
            <input
              type="file"
              id="cv-upload"
              accept=".pdf"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="hidden"
            />
            <label htmlFor="cv-upload" className="cursor-pointer">
              <p className="text-[#B12030] underline mb-2">
                Click to Upload
              </p>
              <p className="text-sm">or drag and drop your file here</p>
              <p className="text-xs mt-2">
                Supported: PDF (Max 5MB)
              </p>
            </label>
          </div>

          {selectedFile && (
            <div className="bg-[#F1F4F8] rounded-lg p-3 mb-6 flex items-center justify-between">
              <p className="truncate">{selectedFile.name}</p>
              <button onClick={() => setSelectedFile(null)}>Remove</button>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!selectedFile}
            className={`px-8 py-3 rounded-full mb-5 ${
              selectedFile
                ? "bg-[#B12030] text-white hover:bg-[#901828]"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            Upload & Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default Calibration;
