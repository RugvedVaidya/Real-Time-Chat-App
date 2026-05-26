import MessageBubble from "./MessageBubble";

import ChatInput from "./ChatInput";

const ChatContainer = () => {
  return (
    <div className="flex-1 flex flex-col bg-slate-950">
      {/* Header */}
      <div className="h-[80px] border-b border-slate-800 flex items-center px-6">
        <div>
          <h2 className="font-bold text-lg">
            Alex
          </h2>

          <p className="text-sm text-green-500">
            Online
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <MessageBubble
          ownMessage={false}
          content="Hello bro"
          time="10:30 PM"
        />

        <MessageBubble
          ownMessage={true}
          content="Hey!"
          time="10:31 PM"
        />

        <MessageBubble
          ownMessage={false}
          content="Socket.IO working?"
          time="10:32 PM"
        />
      </div>

      {/* Input */}
      <ChatInput />
    </div>
  );
};

export default ChatContainer;