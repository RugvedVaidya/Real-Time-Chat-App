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
        className={`max-w-[70%] px-4 py-3 rounded-2xl ${
          ownMessage
            ? "bg-blue-600"
            : "bg-slate-800"
        }`}
      >
        <p>{content}</p>

        <div className="flex items-center justify-end gap-2 mt-1">
          <p className="text-xs text-slate-300">
            {time}
          </p>

          {ownMessage && (
            <p className="text-xs text-slate-200">
              {status === "seen"
                ? "Seen"
                : status ===
                  "delivered"
                ? "Delivered"
                : "Sent"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;