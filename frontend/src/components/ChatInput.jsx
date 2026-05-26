import { useState } from "react";

import useChatStore from "../store/useChatStore";

import useAuthStore from "../store/useAuthStore";

import socket from "../sockets/socket";

const ChatInput = () => {
  const [message, setMessage] =
    useState("");

  const selectedUser =
    useChatStore(
      (state) => state.selectedUser
    );

  const addMessage = useChatStore(
    (state) => state.addMessage
  );

  const user = useAuthStore(
    (state) => state.user
  );

  const sendMessage = () => {
    if (!message.trim()) return;

    // Emit Socket Event
    socket.emit("private_message", {
      receiverId: selectedUser._id,
      content: message,
    });

    setMessage("");
  };

  return (
    <div className="p-4 border-t border-slate-800 flex gap-3">
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) =>
          setMessage(e.target.value)
        }
        className="flex-1 bg-slate-800 rounded-xl px-4 py-3 outline-none"
      />

      <button
        onClick={sendMessage}
        className="bg-blue-600 hover:bg-blue-700 transition px-6 rounded-xl font-semibold"
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;