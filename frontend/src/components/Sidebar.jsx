import { useEffect } from "react";

import axiosInstance from "../lib/axios";

import useChatStore from "../store/useChatStore";

const Sidebar = () => {
  const {
    users,
    setUsers,
    selectedUser,
    setSelectedUser,
  } = useChatStore();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token =
          localStorage.getItem(
            "accessToken"
          );

        const response =
          await axiosInstance.get(
            "/users",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="w-[320px] bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="p-5 border-b border-slate-800">
        <h1 className="text-2xl font-bold">
          Chats
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {users.map((user) => (
          <div
            key={user._id}
            onClick={() =>
              setSelectedUser(user)
            }
            className={`flex items-center justify-between px-5 py-4 cursor-pointer transition ${
              selectedUser?._id ===
              user._id
                ? "bg-slate-800"
                : "hover:bg-slate-800"
            }`}
          >
            <div>
              <h2 className="font-semibold">
                {user.username}
              </h2>

              <p className="text-sm text-slate-400">
                {user.status}
              </p>
            </div>

            <div
              className={`w-3 h-3 rounded-full ${
                user.status === "online"
                  ? "bg-green-500"
                  : "bg-slate-600"
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;