import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import axiosInstance from "../lib/axios";

import useChatStore from "../store/useChatStore";

import socket from "../sockets/socket";

const Sidebar = () => {
  const navigate = useNavigate();

  const {
    conversations,
    setConversations,
    selectedUser,
    setSelectedUser,
    onlineUsers,
    setOnlineUsers,
  } = useChatStore();

  useEffect(() => {
    const fetchConversations =
      async () => {
        try {
          const token =
            localStorage.getItem(
              "accessToken"
            );

          const response =
            await axiosInstance.get(
              "/users/conversations",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

          setConversations(
            response.data
          );
        } catch (error) {
          console.error(error);
        }
      };

    fetchConversations();
  }, []);

  useEffect(() => {
    socket.on(
      "online_users",
      (onlineUsers) => {
        setOnlineUsers(
          onlineUsers
        );
      }
    );

    return () => {
      socket.off(
        "online_users"
      );
    };
  }, []);

  // =====================================
  // LOGOUT
  // =====================================
  const handleLogout = () => {
    localStorage.removeItem(
      "accessToken"
    );

    navigate("/login");
  };

  return (
    <div className="w-[340px] bg-white border-r border-slate-200 flex flex-col">
      {/* HEADER */}
      <div className="h-[90px] px-6 flex items-center justify-between border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            ChatFlow
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Messages
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-xl transition"
        >
          Logout
        </button>
      </div>

      {/* SEARCH */}
      <div className="p-4 border-b border-slate-100">
        <input
          type="text"
          placeholder="Search conversations..."
          className="w-full bg-slate-100 rounded-2xl px-5 py-3 outline-none text-slate-700 placeholder:text-slate-400"
        />
      </div>

      {/* USERS */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {conversations.map(
          (user) => (
            <div
              key={user._id}
              onClick={() =>
                setSelectedUser(user)
              }
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl cursor-pointer transition-all mb-1 ${
                selectedUser?._id ===
                user._id
                  ? "bg-blue-50"
                  : "hover:bg-slate-100"
              }`}
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg">
                  {user.username
                    ?.charAt(0)
                    ?.toUpperCase()}
                </div>

                <div
                  className={`absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-white ${
                    onlineUsers.includes(
                      user._id
                    )
                      ? "bg-green-500"
                      : "bg-slate-400"
                  }`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900 truncate">
                    {user.username}
                  </h2>
                </div>

                <p className="text-sm text-slate-500 truncate mt-1">
                  {user.lastMessage
                    ? user
                        .lastMessage
                        .content
                    : "Start chatting"}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Sidebar;