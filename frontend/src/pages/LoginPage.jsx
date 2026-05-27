import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import axiosInstance from "../lib/axios";

const LoginPage = () => {
  const navigate =
    useNavigate();

  const [showPassword,
    setShowPassword] =
    useState(false);

  const [formData,
    setFormData] =
    useState({
      email: "",
      password: "",
    });

  // =========================================
  // HANDLE CHANGE
  // =========================================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // =========================================
  // HANDLE LOGIN
  // =========================================
  const handleLogin =
    async (e) => {
      e.preventDefault();

      try {
        const response =
          await axiosInstance.post(
            "/auth/login",
            formData
          );

        console.log(
          "LOGIN RESPONSE:",
          response.data
        );

        // =====================================
        // TOKEN
        // =====================================
        const token =
          response.data.token ||
          response.data.accessToken;

        if (!token) {
          alert(
            "Token not found in response"
          );

          return;
        }

        // =====================================
        // STORE TOKEN
        // =====================================
        localStorage.setItem(
          "accessToken",
          token
        );

        // =====================================
        // NAVIGATE
        // =====================================
        navigate("/");
      } catch (error) {
        console.log(error);

        alert(
          error?.response?.data
            ?.message ||
            "Login failed"
        );
      }
    };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-10">
        {/* LOGO */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-blue-500">
            ChatFlow
          </h1>

          <p className="text-slate-500 mt-3">
            Welcome back
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={
            handleLogin
          }
          className="space-y-5"
        >
          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-slate-600">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              placeholder="Enter email"
              className="w-full mt-2 bg-slate-100 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-blue-400 text-slate-700"
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium text-slate-600">
              Password
            </label>

            <div className="relative mt-2">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={
                  formData.password
                }
                onChange={
                  handleChange
                }
                placeholder="Enter password"
                className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-blue-400 text-slate-700"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showPassword
                  ? "🙈"
                  : "👁️"}
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 transition text-white py-4 rounded-2xl font-semibold text-lg shadow-sm"
          >
            Login
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-slate-500 mt-8">
          Don’t have an
          account?{" "}
          <Link
            to="/register"
            className="text-blue-500 font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;