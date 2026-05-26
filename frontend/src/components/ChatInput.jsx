const ChatInput = () => {
  return (
    <div className="p-4 border-t border-slate-800 flex gap-3">
      <input
        type="text"
        placeholder="Type a message..."
        className="flex-1 bg-slate-800 rounded-xl px-4 py-3 outline-none"
      />

      <button className="bg-blue-600 hover:bg-blue-700 transition px-6 rounded-xl font-semibold">
        Send
      </button>
    </div>
  );
};

export default ChatInput;