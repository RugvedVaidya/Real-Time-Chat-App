import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,

  accessToken: null,

  setUser: (user) =>
    set({
      user,
    }),

  setAccessToken: (token) =>
    set({
      accessToken: token,
    }),

  logout: () =>
    set({
      user: null,
      accessToken: null,
    }),
}));

export default useAuthStore;