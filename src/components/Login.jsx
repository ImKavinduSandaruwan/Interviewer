import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import login_bg from "../assets/Login_bg.svg";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError("All fields are required.");
      return;
    }

    const payload = {
      username: formData.username,
      password: formData.password,
    };

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/v1/auth/login", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Login successful:", response.data);
      console.log("Token:", response.data.token);
      console.log("user id:", response.data.userId);

      sessionStorage.setItem("userId", response.data.userId);
      sessionStorage.setItem("token", response.data.token);

      const userId = response.data.userId;
      const calibrationCompleted = localStorage.getItem(
        `calibrationCompleted_${userId}`
      );
      console.log("calibrationCompleted", calibrationCompleted);
      navigate("/home"); 

      // navigate("/details");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white ">
      {/* Left side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center lg:px-16 px-6 lg:py-6 py-10 mb-5">
        <div className="w-full max-w-[500px] space-y-8 rounded-[50px] bg-[#FBE6E61A]/10 p-8 shadow-xl">
          <h1 className="lg:text-[36px] text-[24px] leading-[54px] font-poppins font-semibold text-[#263238] mb-8 text-center">
            Welcome Back!
          </h1>

          {/* Display error message if there's an error */}
          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="">
            <div className="space-y-12">
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-3 py-2 border-b text-[16px] leading-[24px] font-semibold font-poppins text-[#564D4D80]/50 border-gray-300 focus:border-red-600 outline-none"
                  placeholder="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  disabled={loading}
                />
                <div className="absolute right-3 top-2 h-5 w-5 text-gray-400">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 6C2 5.46957 2.21071 4.96086 2.58579 4.58579C2.96086 4.21071 3.46957 4 4 4H20C20.5304 4 21.0391 4.21071 21.4142 4.58579C21.7893 4.96086 22 5.46957 22 6V18C22 18.5304 21.7893 19.0391 21.4142 19.4142C21.0391 19.7893 20.5304 20 20 20H4C3.46957 20 2.96086 19.7893 2.58579 19.4142C2.21071 19.0391 2 18.5304 2 18V6ZM5.519 6L12 11.671L18.481 6H5.519ZM20 7.329L12.659 13.753C12.4766 13.9128 12.2424 14.0009 12 14.0009C11.7576 14.0009 11.5234 13.9128 11.341 13.753L4 7.329V18H20V7.329Z"
                      fill="#263238"
                      fillOpacity="0.5"
                    />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <input
                  type="password"
                  className="w-full px-3 py-2 border-b text-[16px] leading-[24px] font-semibold font-poppins text-[#564D4D80]/50 border-gray-300 focus:border-red-600 outline-none"
                  placeholder="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  disabled={loading}
                />
                <div className="absolute right-3 top-2 h-5 w-5 text-gray-400">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 17C11.4696 17 10.9609 16.7893 10.5858 16.4142C10.2107 16.0391 10 15.5304 10 15C10 13.89 10.89 13 12 13C12.5304 13 13.0391 13.2107 13.4142 13.5858C13.7893 13.9609 14 14.4696 14 15C14 15.5304 13.7893 16.0391 13.4142 16.4142C13.0391 16.7893 12.5304 17 12 17ZM18 20V10H6V20H18ZM18 8C18.5304 8 19.0391 8.21071 19.4142 8.58579C19.7893 8.96086 20 9.46957 20 10V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V10C4 8.89 4.89 8 6 8H7V6C7 4.67392 7.52678 3.40215 8.46447 2.46447C9.40215 1.52678 10.6739 1 12 1C12.6566 1 13.3068 1.12933 13.9134 1.3806C14.52 1.63188 15.0712 2.00017 15.5355 2.46447C15.9998 2.92876 16.3681 3.47995 16.6194 4.08658C16.8707 4.69321 17 5.34339 17 6V8H18ZM12 3C11.2044 3 10.4413 3.31607 9.87868 3.87868C9.31607 4.44129 9 5.20435 9 6V8H15V6C15 5.20435 14.6839 4.44129 14.1213 3.87868C13.5587 3.31607 12.7956 3 12 3Z"
                      fill="#263238"
                      fillOpacity="0.5"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 border-[#B12030] rounded text-red-600 focus:ring-red-500"
                    checked={formData.rememberMe}
                    onChange={(e) =>
                      setFormData({ ...formData, rememberMe: e.target.checked })
                    }
                    disabled={loading}
                  />
                  <label className="ml-2 text-[14px] leading-[21px] font-semibold font-poppins text-[#564D4DB2]/70">
                    Remember Me
                  </label>
                </div>
                <button
                  type="button"
                  className="text-[14px] leading-[21px] font-semibold font-poppins text-[#B12030] hover:text-red-500"
                  disabled={loading}
                >
                  Forget Password?
                </button>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className={`py-3 px-16 bg-[#B12030] text-[20px] leading-[30px] font-poppins text-white font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors ${
                    loading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-red-700"
                  }`}
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Log in"}
                </button>
              </div>
            </div>
            <div className="text-center text-[14px] leading-[21px] font-semibold font-poppins text-[#564D4DB2]/70 mt-40">
              Don't have an account yet?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-[#B12030] hover:text-red-500 text-[14px] leading-[21px] font-semibold font-poppins underline"
                disabled={loading}
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Decorative Wave Pattern */}
      <div className="hidden md:block md:w-1/2">
        <div className="w-full h-full overflow-hidden">
          <img
            src={login_bg}
            alt="Decorative waves"
            className="w-full h-full object-cover bg-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
