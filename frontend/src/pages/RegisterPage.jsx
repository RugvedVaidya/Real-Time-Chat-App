import { useForm } from "react-hook-form";

import { useNavigate, Link } from "react-router-dom";

import toast from "react-hot-toast";

import axiosInstance from "../lib/axios";

import AuthLayout from "../layouts/AuthLayout";

const RegisterPage = () => {
  const navigate = useNavigate();

  const { register, handleSubmit } =
    useForm();

  const onSubmit = async (data) => {
    try {
      await axiosInstance.post(
        "/auth/register",
        data
      );

      toast.success(
        "Registration successful"
      );

      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed"
      );
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-3xl font-bold text-center mb-8">
        Create Account
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <input
          type="text"
          placeholder="Username"
          {...register("username")}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
        />

        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-xl py-3 font-semibold"
        >
          Register
        </button>
      </form>

      <p className="text-center mt-6 text-slate-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-blue-500"
        >
          Login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;