import Sidebar from "../components/Sidebar";

import ChatContainer from "../components/ChatContainer";

const ChatPage = () => {
  return (
    <div className="h-screen flex bg-slate-950 text-white">
      <Sidebar />

      <ChatContainer />
    </div>
  );
};

export default ChatPage;