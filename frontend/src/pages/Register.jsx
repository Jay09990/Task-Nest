import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { CheckCircle, AlertCircle, Eye, EyeOff, UserPlus } from "lucide-react";
import axios from "axios";

// Register component for user sign-up
const Register = () => {
  const navigate = useNavigate();

  // State for form fields
  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // State for validation errors
  const [errors, setErrors] = useState({});
  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // State for loading indicator
  const [isLoading, setIsLoading] = useState(false);
  // State for registration error message
  const [registerError, setRegisterError] = useState("");

  // Handle input changes and clear errors for the field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate form fields before submission
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  // Enhanced error handling for different scenarios
  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisterError("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/tasknest/api/users/register",
        {
          name: formData.name,
          userName: formData.userName,
          email: formData.email,
          password: formData.password,
        }
      );

      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      };

      res.cookie("accessToken", accessToken, options);
      res.cookie("refreshToken", refreshToken, options);

      // store it in localstorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Clear form after success
      setFormData({
        name: "",
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      toast.success(`Registration successful! Welcome ${formData.name}`);
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response) {
        // Server responded with error (400, 500, etc.)
        switch (error.response.status) {
          case 400:
            setRegisterError(
              error.response.data.message || "Invalid input data"
            );
            break;
          case 409:
            setRegisterError(
              "Email or user name already exists. Please use a different email."
            );
            break;
          case 500:
            setRegisterError("Server error. Please try again later.");
            break;
          default:
            setRegisterError("Registration failed. Please try again.");
        }
      } else if (error.request) {
        // Network error - no response received
        setRegisterError(
          "Cannot connect to server. Please check your internet connection."
        );
      } else {
        // Something else went wrong
        setRegisterError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-purple-900/10 to-slate-900/20"></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/20">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <UserPlus className="h-7 w-7 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-800">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Or{" "}
              <a href="/login">
                <button className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors underline bg-none border-none cursor-pointer">
                  sign in to your existing account
                </button>
              </a>
            </p>
          </div>

          {/* Registration error message */}
          {registerError && (
            <div className="bg-red-50/80 border-l-4 border-red-400 p-4 mb-4 rounded-r-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700">{registerError}</p>
              </div>
            </div>
          )}

          {/* Registration form */}
          <div className="mt-8 space-y-6">
            <div className="space-y-5">
              {/* Name field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.name ? "border-red-300" : "border-gray-200"
                    } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 bg-white/90`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* UserName field */}
              <div>
                <label
                  htmlFor="userName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  User Name
                </label>
                <div className="relative">
                  <input
                    id="userName"
                    name="userName"
                    type="text"
                    autoComplete="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.userName ? "border-red-300" : "border-gray-200"
                    } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 bg-white/90`}
                    placeholder=""
                  />
                  {errors.userName && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.userName && (
                  <p className="mt-2 text-sm text-red-600">{errors.userName}</p>
                )}
              </div>

              {/* Email field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.email ? "border-red-300" : "border-gray-200"
                    } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 bg-white/90`}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.password ? "border-red-300" : "border-gray-200"
                    } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 bg-white/90 pr-12`}
                    placeholder="Create a secure password"
                  />
                  {/* Toggle password visibility */}
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm password field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.confirmPassword
                        ? "border-red-300"
                        : "border-gray-200"
                    } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 bg-white/90 pr-12`}
                    placeholder="Confirm your password"
                  />
                  {/* Toggle confirm password visibility */}
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Submit button */}
            <a href="/login">
              <div className="pt-4">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      {/* Loading spinner */}
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  console.log(formData);
};

export default Register;
