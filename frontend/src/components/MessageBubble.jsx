const MessageBubble = ({
  ownMessage,
  content,
  time,
  status,
}) => {
  return (
    <div
      className={`flex ${
        ownMessage
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`max-w-[60%] px-4 py-3 rounded-3xl shadow-sm ${
          ownMessage
            ? "bg-blue-500 text-white rounded-br-md"
            : "bg-white border border-slate-200 text-slate-800 rounded-bl-md"
        }`}
      >
        <p className="text-[15px] leading-relaxed break-words">
          {content}
        </p>

        <div className="flex items-center justify-end gap-1 mt-2">
          <span
            className={`text-[11px] ${
              ownMessage
                ? "text-blue-100"
                : "text-slate-400"
            }`}
          >
            {time}
          </span>

          {ownMessage && (
            <span className="text-[11px] text-blue-100">
              {status === "seen"
                ? "✓✓"
                : status ===
                  "delivered"
                ? "✓✓"
                : "✓"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;