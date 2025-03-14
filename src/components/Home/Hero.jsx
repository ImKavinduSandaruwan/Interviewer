/* eslint-disable no-unused-vars */
import React from 'react';
import hero_bg from "../../assets/Hero_bg.svg";

const Hero = () => {
  return (
    <div className="relative lg:min-h-screen min-h-0 lg:max-h-0 max-h-[580px] bg-white overflow-hidden">
      {/* Wave Pattern */}
      <div className="absolute top-0 right-0 w-1/2 ">
        {/* <svg
          className="h-full w-full"
          viewBox="0 0 600 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 0H600V800C500 750 400 780 300 700C200 620 100 680 0 600V0Z"
            fill="url(#gradient)"
          />
          <defs>
            <linearGradient
              id="gradient"
              x1="300"
              y1="0"
              x2="300"
              y2="800"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FEE2E2" />
              <stop offset="20%" stopColor="#FECACA" />
              <stop offset="40%" stopColor="#FCA5A5" />
              <stop offset="60%" stopColor="#EF4444" />
              <stop offset="80%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#1F2937" />
            </linearGradient>
          </defs>
        </svg> */}
        <img src={hero_bg} alt="" className='h-full w-full'/>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-32">
        <div className="max-w-xl">
          <h1 className="text-5xl sm:text-[80px] font-semibold font-poppins leading-[96px] tracking-tight mb-6">
            Step Into Your{' '}
            <span className="text-[#B12030]">Dream Role</span>
          </h1>
          <p className="text-[#040404] max-w-[566px] mx-auto text-lg sm:text-[18px] leading-[27px] font-light font-poppins mb-8">
            Discover opportunities that align with your ambitions, showcase your
            unique skills, and connect with roles tailored to your expertise. Take
            the first step toward a thriving career, unlock your potential, and
            achieve the professional success you deserve
          </p>
          <button className="bg-[#B12030] text-white px-5 py-2 rounded-[20px] text-[16px] leading-[24px] font-poppins font-medium hover:bg-red-700 transition-colors duration-200">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;