const MessageBubble = ({
  ownMessage,
  content,
  time,
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

        <p className="text-xs text-slate-300 mt-1 text-right">
          {time}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;