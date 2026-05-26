const users = [
  {
    id: 1,
    username: "Alex",
    online: true,
  },
  {
    id: 2,
    username: "Sarah",
    online: false,
  },
];

const Sidebar = () => {
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
            key={user.id}
            className="flex items-center justify-between px-5 py-4 hover:bg-slate-800 cursor-pointer transition"
          >
            <div>
              <h2 className="font-semibold">
                {user.username}
              </h2>

              <p className="text-sm text-slate-400">
                {user.online
                  ? "Online"
                  : "Offline"}
              </p>
            </div>

            <div
              className={`w-3 h-3 rounded-full ${
                user.online
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