import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import axiosInstance from "../lib/axios";

const RegisterPage = () => {
  const navigate =
    useNavigate();

  const [showPassword,
    setShowPassword] =
    useState(false);

  const [formData,
    setFormData] =
    useState({
      username: "",
      email: "",
      password: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleRegister =
    async (e) => {
      e.preventDefault();

      try {
        await axiosInstance.post(
          "/auth/register",
          formData
        );

        navigate(
          "/login"
        );
      } catch (error) {
        console.error(error);
        alert(
          "Registration failed"
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
            Create account
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={
            handleRegister
          }
          className="space-y-5"
        >
          {/* USERNAME */}
          <div>
            <label className="text-sm font-medium text-slate-600">
              Username
            </label>

            <input
              type="text"
              name="username"
              value={
                formData.username
              }
              onChange={
                handleChange
              }
              placeholder="Enter username"
              className="w-full mt-2 bg-slate-100 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-blue-400 text-slate-700"
            />
          </div>

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
            Register
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-slate-500 mt-8">
          Already have an
          account?{" "}
          <Link
            to="/login"
            className="text-blue-500 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;