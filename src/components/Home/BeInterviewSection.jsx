/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React from "react";
import { ArrowDown } from "lucide-react";
import section11 from "../../assets/Section11.svg";
import section12 from "../../assets/Section12.svg";
import right_arrow from "../../assets/RightArrow.svg";
import left_arrow from "../../assets/LeftArrow.svg";
// import dot from "../../assets/DotImage.svg";

const BeInterviewSection = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 ">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-[40px] leading-[48px] font-semibold font-poppins text-[#B12030] mb-4">
          Be Interview-Ready!
        </h1>
        <p className="text-[18px] leading-[27px] font-light font-poppins text-[#040404] max-w-[1272px] mx-auto">
          Start at your current role, aim higher, and speak your way to success
          with interactive mock interviews.
        </p>
      </div>
      {/* First Section */}

      <div className="bg-white max-w-[1150px] rounded-3xl shadow-lg shadow-[#B120301A]/10 border-[1px] border-[#B120301A]/10 p-8 sm:p-12 mb-12">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="lg:w-1/2 space-y-8">
            <h2 className="text-[36px] leading-[43.2px] font-semibold font-poppins">
              E-Books and Role-Based Interview Guidance
            </h2>

            <p className="text-[#040404] text-[16px] leading-[24px] font-normal font-poppins lg:w-[540px]">
              We provide expertly crafted e-books and tailored role-based
              suggestions to guide you through every step of the interview
              process, ensuring you're fully prepared for your unique career
              path.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FF555547]/30 flex items-center justify-center mt-1">
                  {/* <svg
                    className="w-4 h-4 text-red-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg> */}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.66663 10L3.74996 7.91667L7.91663 12.0833L16.25 3.75L18.3333 5.83333L7.91663 16.25L1.66663 10Z"
                      fill="#B12030"
                      stroke="#B12030"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-[#040404] text-[16px] leading-[24px] font-normal font-poppins">
                  200+ video lessons to guide you through every step of the
                  interviewing process, tailored to 1100+ occupations.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FF555547]/30 flex items-center justify-center mt-1">
                  {/* <svg
                    className="w-4 h-4 text-red-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg> */}
                     <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.66663 10L3.74996 7.91667L7.91663 12.0833L16.25 3.75L18.3333 5.83333L7.91663 16.25L1.66663 10Z"
                      fill="#B12030"
                      stroke="#B12030"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-[#040404] text-[16px] leading-[24px] font-normal font-poppins">
                  Comprehensive e-books covering all aspects of interview
                  preparation, from fundamentals to advanced techniques.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FF555547]/30 flex items-center justify-center mt-1">
                  {/* <svg
                    className="w-4 h-4 text-red-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg> */}
                      <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.66663 10L3.74996 7.91667L7.91663 12.0833L16.25 3.75L18.3333 5.83333L7.91663 16.25L1.66663 10Z"
                      fill="#B12030"
                      stroke="#B12030"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-[#040404] text-[16px] leading-[24px] font-normal font-poppins">
                  Get tailored guidance specific to your chosen role— Learn
                  exactly what to expect and how to excel.
                </p>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:w-1/2">
            <div className=" ">
              <img
                src={section11}
                alt=""
                className="lg:w-[465px] lg:h-[354px] object-cover rounded"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative ">
        <div className="absolute lg:-top-[140px] -top-[70px] lg:-right-5 -right-6 rounded-lg flex justify-end  ">
          <img
            src={right_arrow}
            alt=""
            className=" lg:w-[168px] w-[100px] lg:h-[227px]"
          />
        </div>
      </div>
      {/* <ArrowDown className=" w-16 h-16 text-red-500" /> */}

      {/* Second Section */}
      {/* <div className="flex flex-col lg:flex-row items-center gap-8">
        <div className="lg:w-1/2">
          <div className="bg-white rounded-lg shadow-xl p-6">
            <img
              src="placeholder-dashboard.jpg"
              alt=""
              className="w-full rounded-lg"
            />
          </div>
        </div>

        <div className="lg:w-1/2 space-y-6">
          <h2 className="text-3xl font-bold">
            Interview Practice Like Never Before
          </h2>
          <p className="text-gray-600">
            Choose your level (Current Role, Senior Role, or Target Role) and
            let our virtual interviewers create a personalized experience.
            Interact in real-time by unmuting your mic and answering curated
            questions.
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <p className="font-semibold">
                Select from three customizable levels:
              </p>
              <div className="space-y-2 ml-6">
                <p>
                  1. Current Role - Refine skills for your existing position.
                </p>
                <p>2. Senior Role - Prepare for leadership opportunities.</p>
                <p>
                  3. Target Role - Transition seamlessly into your dream job.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center mt-1">
                <div className="w-3 h-3 rounded-full bg-pink-500"></div>
              </div>
              <p>
                Engage with three simulated interviewers who ask questions
                tailored to your selected role.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center mt-1">
                <div className="w-3 h-3 rounded-full bg-pink-500"></div>
              </div>
              <p>
                Gain unique insights into video interviews and prepare for even
                the most unpredictable scenarios.
              </p>
            </div>
          </div>
        </div>
      </div> */}
      <div className="flex justify-end ">
        <div className="bg-white max-w-[1150px] mt-5 rounded-3xl shadow-lg shadow-[#B120301A]/10 border-[1px] border-[#B120301A]/10 p-8 sm:p-12 mb-12">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Side - Mock Interview Interface */}
            <div className="lg:w-1/2">
              <div className=" ">
                <img
                  src={section12}
                  alt=""
                  className="lg:w-[462px] lg:h-[379px] object-cover rounded"
                />
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="lg:w-1/2 space-y-8">
              <h2 className="text-[36px] leading-[43.2px] font-semibold font-poppins">
                Interview Practice Like Never Before
              </h2>

              <p className="text-[#040404] text-[16px] leading-[24px] font-normal font-poppins lg:w-[540px]">
                Choose your level (Current Role, Senior Role, or Target Role)
                and let our virtual interviewers create a personalized
                experience. Interact in real-time by unmuting your mic and
                answering curated questions.
              </p>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FF555547]/30 flex items-center justify-center mt-1">
                      {/* <svg
                        className="w-4 h-4 text-red-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg> */}
                              <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.66663 10L3.74996 7.91667L7.91663 12.0833L16.25 3.75L18.3333 5.83333L7.91663 16.25L1.66663 10Z"
                      fill="#B12030"
                      stroke="#B12030"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                    </div>
                    <div>
                      <p className="text-[#040404] text-[16px] leading-[24px] font-normal font-poppins mb-2">
                        Select from three customizable levels:
                      </p>
                      <div className="space-y-2 ml-4 text-[#040404] text-[16px] leading-[24px] font-semibold font-poppins">
                        <p>
                          1. Current Role – <span className="text-[#040404] text-[16px] leading-[24px] font-normal font-poppins">Refine skills for your existing position.</span>
                          
                        </p>
                        <p>
                          2. Senior Role – <span className="text-[#040404] text-[16px] leading-[24px] font-normal font-poppins">Prepare for leadership opportunities.</span>
                        </p>
                        <p>
                          3. Target Role – <span className="text-[#040404] text-[16px] leading-[24px] font-normal font-poppins">Transition seamlessly into your dream
                          job.</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FF555547]/30 flex items-center justify-center mt-1">
                      {/* <svg
                        className="w-4 h-4 text-red-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg> */}
                              <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.66663 10L3.74996 7.91667L7.91663 12.0833L16.25 3.75L18.3333 5.83333L7.91663 16.25L1.66663 10Z"
                      fill="#B12030"
                      stroke="#B12030"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                    </div>
                    <p className="text-[#040404] text-[16px] leading-[24px] font-normal font-poppins">
                      Engage with three simulated interviewers who ask questions
                      tailored to your selected role.
                    </p>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FF555547]/30 flex items-center justify-center mt-1">
                      {/* <svg
                        className="w-4 h-4 text-red-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg> */}
                              <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.66663 10L3.74996 7.91667L7.91663 12.0833L16.25 3.75L18.3333 5.83333L7.91663 16.25L1.66663 10Z"
                      fill="#B12030"
                      stroke="#B12030"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                    </div>
                    <p className="text-[#040404] text-[16px] leading-[24px] font-normal font-poppins">
                      Gain unique insights into video interviews and prepare for
                      even the most unpredictable scenarios.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative ">
        <div className="absolute lg:-top-[140px] -top-[70px] -left-5 rounded-lg flex justify-end  ">
          <img src={left_arrow} alt="" className=" lg:w-[168px] w-[100px] lg:h-[227px]" />
        </div>
      </div>

      {/* 3 rd section */}
      <div className="flex justify-start ">
        <div className="bg-white max-w-[1150px] mt-5 rounded-3xl shadow-lg shadow-[#B120301A]/10 border-[1px] border-[#B120301A]/10 p-8 sm:p-12 mb-12">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Side - Mock Interview Interface */}

            <div className="lg:w-1/2 space-y-8">
              <h2 className="text-[36px] leading-[43.2px] font-semibold font-poppins">
                Tailored MCQ Training for Your Career Goals
              </h2>

              <p className="text-[#040404] text-[16px] leading-[24px] font-normal font-poppins lg:w-[540px]">
                Our MCQ platform is built to help you master assessments
                tailored to your career aspirations. Select from three roles to
                align your practice:
              </p>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FF555547]/30 flex items-center justify-center mt-1">
                      {/* <svg
                        className="w-4 h-4 text-red-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg> */}
                              <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.66663 10L3.74996 7.91667L7.91663 12.0833L16.25 3.75L18.3333 5.83333L7.91663 16.25L1.66663 10Z"
                      fill="#B12030"
                      stroke="#B12030"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                    </div>
                    <div>
                      <p className="text-[#040404] text-[16px] leading-[24px] font-normal font-poppins mb-2">
                        Select from three customizable levels:
                      </p>
                      <div className="space-y-2 ml-4 text-[#040404] text-[16px] leading-[24px] font-semibold font-poppins">
                        <p>
                          1. Current Role – <span className="text-[#040404] text-[16px] leading-[24px] font-normal font-poppins">Refine skills for your existing
                          position.</span>
                        </p>
                        <p>
                          2. Senior Role – <span className="text-[#040404] text-[16px] leading-[24px] font-normal font-poppins">Prepare for leadership opportunities.</span>
                        </p>
                        {/* <p>
                          3. Target Role – Transition seamlessly into your dream
                          job.
                        </p> */}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FF555547]/30 flex items-center justify-center mt-1">
                      {/* <svg
                        className="w-4 h-4 text-red-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg> */}
                              <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.66663 10L3.74996 7.91667L7.91663 12.0833L16.25 3.75L18.3333 5.83333L7.91663 16.25L1.66663 10Z"
                      fill="#B12030"
                      stroke="#B12030"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                    </div>
                    <p className="text-[#040404] text-[16px] leading-[24px] font-normal font-poppins">
                      Custom question banks for over 100 industries and
                      professions.
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FF555547]/30 flex items-center justify-center mt-1">
                      {/* <svg
                        className="w-4 h-4 text-red-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg> */}
                              <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.66663 10L3.74996 7.91667L7.91663 12.0833L16.25 3.75L18.3333 5.83333L7.91663 16.25L1.66663 10Z"
                      fill="#B12030"
                      stroke="#B12030"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                    </div>
                    <p className="text-[#040404] text-[16px] leading-[24px] font-normal font-poppins">Detailed explanations to ensure deep learning.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="lg:w-1/2">
              <div className=" ">
                <img
                  src={section11}
                  alt=""
                  className="lg:w-[465px] lg:h-[354px] object-cover rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-white lg:py-16 py-8 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-black text-[24px] leading-[24px] font-light font-poppins mb-4">Not convinced yet?</h2>

        <h1 className="text-3xl md:text-4xl lg:text-[36px]   leading-[36px] font-semibold font-poppins text-black mb-8">
          Start your career success journey{" "}
          <span
            role="img"
            aria-label="pointing finger"
            className="inline-block "
          >
          👇
          </span>
        </h1>

        <button className="bg-[#B12030] hover:bg-red-700 text-white font-medium px-5 py-2 text-[16px]   leading-[24px]  font-poppins rounded-full transition-colors duration-200">
          Start Your Journey
        </button>
      </div>
      </div>
    </div>
  );
};

export default BeInterviewSection;
