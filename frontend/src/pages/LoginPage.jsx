import { useForm } from "react-hook-form";

import { useNavigate, Link } from "react-router-dom";

import toast from "react-hot-toast";

import axiosInstance from "../lib/axios";

import useAuthStore from "../store/useAuthStore";

import socket from "../sockets/socket";

import AuthLayout from "../layouts/AuthLayout";

const LoginPage = () => {
  const navigate = useNavigate();

  const { register, handleSubmit } =
    useForm();

  const setUser = useAuthStore(
    (state) => state.setUser
  );

  const setAccessToken =
    useAuthStore(
      (state) => state.setAccessToken
    );

  const onSubmit = async (data) => {
    try {
      const response =
        await axiosInstance.post(
          "/auth/login",
          data
        );

        console.log(response.data);
        
      const {
        user,
        accessToken,
      } = response.data;

      // Save To Zustand
      setUser(user);

      setAccessToken(accessToken);

      // Save Token
      localStorage.setItem(
        "accessToken",
        accessToken
      );

      // Connect Socket
      socket.auth = {
        token: accessToken,
      };

      socket.connect();

      toast.success(
        "Login successful"
      );

      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Login failed"
      );
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-3xl font-bold text-center mb-8">
        Welcome Back
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
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
          Login
        </button>
      </form>

      <p className="text-center mt-6 text-slate-400">
        Don’t have an account?{" "}
        <Link
          to="/register"
          className="text-blue-500"
        >
          Register
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;