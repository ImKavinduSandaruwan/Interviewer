/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import logo from "../assets/logoo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    const userId = sessionStorage.getItem("userId");
    localStorage.removeItem(`calibrationCompleted_${userId}`);
    navigate("/");
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile || selectedFile.type !== "application/pdf") {
      alert("Please select a valid PDF file.");
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

      alert("CV uploaded successfully!");
      const userId = sessionStorage.getItem("userId");
      localStorage.setItem(`calibrationCompleted_${userId}`, "true");

      navigate("/home", {
        state: { resourcesToImprove: response.data.resources_to_improve },
      });
      setShowUploadModal(false);
    } catch (error) {
      console.error("Error uploading CV:", error);
      alert("Failed to upload CV. Please try again.");
    }
  };

  return (
    <nav className="bg-white shadow-xl border border-[#B120301A]/10 shadow-[#B120304D]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[78px]">
          {/* Logo Section */}
          <div className="flex items-center gap-20">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img src={logo} alt="Logo" className="h-[180px] w-[184px]" />
            </div>

            <div className="hidden md:flex space-x-8">
              <a href="/home" className="text-[#B12030] hover:font-bold">
                Home
              </a>
              <a href="/interviewmain" className="text-black hover:font-bold">
                Interview
              </a>
              <a href="/mcq" className="text-black hover:font-bold">
                MCQ
              </a>
              <a href="/videos" className="text-black hover:font-bold">
                Video
              </a>
            </div>
          </div>

          {/* Right Menu Section */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-5 py-2 text-[#B12030] border border-[#B12030] rounded-full hover:bg-red-50"
            >
              Upload CV
            </button>

            {/* <button
              onClick={handleLogout}
              className="px-5 py-2 text-white bg-[#B12030] rounded-full hover:bg-red-700"
            >
              Log Out
            </button> */}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 text-center">
          <a href="/" className="block px-3 py-2 rounded-md text-[#B12030]">
            Home
          </a>
          <a
            href="/interviewmain"
            className="block px-3 py-2 rounded-md text-gray-600"
          >
            Interview
          </a>
          <a href="/mcq" className="block px-3 py-2 rounded-md text-gray-600">
            MCQ
          </a>

          <button
            onClick={() => setShowUploadModal(true)}
            className="w-full mt-4 px-4 py-2 border text-[#B12030] rounded-full hover:bg-red-50"
          >
            Upload CV
          </button>

          <button
            onClick={handleLogout}
            className="w-full mt-4 px-4 py-2 text-white bg-[#B12030] rounded-full hover:bg-red-700"
          >
            Log Out
          </button>
        </div>
      )}

      {/* Upload CV Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-xl relative">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close"
            >
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
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Submit Your CV
            </h2>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6 hover:border-gray-400 transition-colors text-center">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="cv-upload"
              />
              <label
                htmlFor="cv-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mb-2 text-gray-500"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <span className="text-gray-600 font-medium">
                  {selectedFile
                    ? selectedFile.name
                    : "Click to select PDF file"}
                </span>
                {!selectedFile && (
                  <span className="text-gray-400 text-sm mt-1">
                    Maximum size: 5MB
                  </span>
                )}
              </label>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleUpload}
                disabled={!selectedFile}
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  selectedFile
                    ? "bg-[#B12030] text-white hover:bg-[#9a1c2a]"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {selectedFile
                  ? "Upload & Continue"
                  : "Select a file to continue"}
              </button>

              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
