import { useState } from "react";
import { User, Mail, Lock } from "lucide-react";
import signup_bg from "../../assets/SignUp_bg.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    agreeToTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      setError("All fields are required.");
      return;
    }
    if (!formData.agreeToTerms) {
      setError("You must agree to the Terms & Conditions.");
      return;
    }

    const payload = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/v1/auth/signup", payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Register successful:", response.data);
      console.log("Token:", response.data.token);
      console.log("user id:", response.data.userId);

      sessionStorage.setItem("userId", response.data.userId);
      sessionStorage.setItem("token", response.data.token);

      const userId = response.data.userId;
      const calibrationCompleted = localStorage.getItem(
        `calibrationCompleted_${userId}`
      );
      console.log("calibrationCompleted", calibrationCompleted);
      navigate(calibrationCompleted ? "/home" : "/details");
    } catch (err) {
      console.error("Signup error:", err);
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white flex h-screen w-full">
      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center lg:px-16 px-6 lg:py-6 py-10 mb-5">
        <div className="bg-[#FBE6E61A]/10 max-w-[500px] w-full rounded-[50px] p-8 shadow-xl">
          <h1 className="lg:text-[36px] text-[24px] leading-[54px] font-poppins text-center font-semibold text-[#263238] mb-8">
            Create an Account
          </h1>

          {/* Display error message if there's an error */}
          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username field */}
            <div className="relative">
              <input
                type="text"
                placeholder="user name"
                className="w-full border-b-2 text-[16px] leading-[24px] font-semibold font-poppins border-gray-200 py-2 text-[#564D4D80]/50 pl-2 pr-10 focus:outline-none focus:border-red-500 bg-transparent"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                disabled={loading} // Disable input while loading
              />
              <div className="absolute right-2 top-2 text-gray-400">
                <svg
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 13.5C14.7614 13.5 17 11.2614 17 8.5C17 5.73858 14.7614 3.5 12 3.5C9.23858 3.5 7 5.73858 7 8.5C7 11.2614 9.23858 13.5 12 13.5Z"
                    stroke="#564D4D"
                    strokeOpacity="0.5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20 21.5C20 19.3783 19.1571 17.3434 17.6569 15.8431C16.1566 14.3429 14.1217 13.5 12 13.5C9.87827 13.5 7.84344 14.3429 6.34315 15.8431C4.84285 17.3434 4 19.3783 4 21.5"
                    stroke="#564D4D"
                    strokeOpacity="0.5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Email field */}
            <div className="relative">
              <input
                type="email"
                placeholder="email"
                className="w-full border-b-2 text-[16px] leading-[24px] font-semibold font-poppins text-[#564D4D80]/50 border-gray-200 py-2 pl-2 pr-10 focus:outline-none focus:border-red-500 bg-transparent"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={loading}
              />
              <div className="absolute right-2 top-2 text-gray-400">
                <svg
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 6.5C2 5.96957 2.21071 5.46086 2.58579 5.08579C2.96086 4.71071 3.46957 4.5 4 4.5H20C20.5304 4.5 21.0391 4.71071 21.4142 5.08579C21.7893 5.46086 22 5.96957 22 6.5V18.5C22 19.0304 21.7893 19.5391 21.4142 19.9142C21.0391 20.2893 20.5304 20.5 20 20.5H4C3.46957 20.5 2.96086 20.2893 2.58579 19.9142C2.21071 19.5391 2 19.0304 2 18.5V6.5ZM5.519 6.5L12 12.171L18.481 6.5H5.519ZM20 7.829L12.659 14.253C12.4766 14.4128 12.2424 14.5009 12 14.5009C11.7576 14.5009 11.5234 14.4128 11.341 14.253L4 7.829V18.5H20V7.829Z"
                    fill="#263238"
                    fillOpacity="0.5"
                  />
                </svg>
              </div>
            </div>

            {/* Password field */}
            <div className="relative">
              <input
                type="password"
                placeholder="password"
                className="w-full border-b-2 text-[16px] leading-[24px] font-semibold font-poppins text-[#564D4D80]/50 border-gray-200 py-2 pl-2 pr-10 focus:outline-none focus:border-red-500 bg-transparent"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                disabled={loading}
              />
              <div className="absolute right-2 top-2 text-gray-400">
                <svg
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 17.5C11.4696 17.5 10.9609 17.2893 10.5858 16.9142C10.2107 16.5391 10 16.0304 10 15.5C10 14.39 10.89 13.5 12 13.5C12.5304 13.5 13.0391 13.7107 13.4142 14.0858C13.7893 14.4609 14 14.9696 14 15.5C14 16.0304 13.7893 16.5391 13.4142 16.9142C13.0391 17.2893 12.5304 17.5 12 17.5ZM18 20.5V10.5H6V20.5H18ZM18 8.5C18.5304 8.5 19.0391 8.71071 19.4142 9.08579C19.7893 9.46086 20 9.96957 20 10.5V20.5C20 21.0304 19.7893 21.5391 19.4142 21.9142C19.0391 22.2893 18.5304 22.5 18 22.5H6C5.46957 22.5 4.96086 22.2893 4.58579 21.9142C4.21071 21.5391 4 21.0304 4 20.5V10.5C4 9.39 4.89 8.5 6 8.5H7V6.5C7 5.17392 7.52678 3.90215 8.46447 2.96447C9.40215 2.02678 10.6739 1.5 12 1.5C12.6566 1.5 13.3068 1.62933 13.9134 1.8806C14.52 2.13188 15.0712 2.50017 15.5355 2.96447C15.9998 3.42876 16.3681 3.97995 16.6194 4.58658C16.8707 5.19321 17 5.84339 17 6.5V8.5H18ZM12 3.5C11.2044 3.5 10.4413 3.81607 9.87868 4.37868C9.31607 4.94129 9 5.70435 9 6.5V8.5H15V6.5C15 5.70435 14.6839 4.94129 14.1213 4.37868C13.5587 3.81607 12.7956 3.5 12 3.5Z"
                    fill="#263238"
                    fillOpacity="0.5"
                  />
                </svg>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 accent-[#B12030]"
                checked={formData.agreeToTerms}
                onChange={(e) =>
                  setFormData({ ...formData, agreeToTerms: e.target.checked })
                }
                disabled={loading}
              />
              <label
                htmlFor="terms"
                className="text-[14px] leading-[21px] font-semibold font-poppins text-[#564D4DB2]/70"
              >
                I agree to{" "}
                <span className="text-[#B12030] text-[14px] leading-[21px] font-semibold font-poppins cursor-pointer">
                  Terms & Conditions
                </span>
              </label>
            </div>

            {/* Submit button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className={`bg-[#B12030] text-white text-[20px] leading-[30px] font-poppins rounded-full px-16 py-3 font-medium transition-colors ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"
                }`}
                disabled={loading}
              >
                {loading ? "Signing up..." : "Sign up"}
              </button>
            </div>

            {/* Login link */}
            <div className="text-center text-[14px] leading-[21px] font-semibold font-poppins text-[#564D4DB2]/70">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/")}
                className="text-[#B12030] text-[14px] leading-[21px] font-semibold font-poppins underline cursor-pointer"
              >
                Log in
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* Image Section */}
      <div className="hidden md:block md:w-1/2 lg:py-6 py-10">
        <div className="w-full overflow-hidden">
          <img
            src={signup_bg}
            alt="Decorative waves"
            className="w-full h-full object-cover bg-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
