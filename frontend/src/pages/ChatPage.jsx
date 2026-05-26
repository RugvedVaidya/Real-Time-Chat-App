import Sidebar from "../components/Sidebar";

import ChatContainer from "../components/ChatContainer";

const ChatPage = () => {
  return (
    <div className="h-screen flex bg-[#f8fafc] text-black overflow-hidden">
      <Sidebar />

      <ChatContainer />
    </div>
  );
};

export default ChatPage;