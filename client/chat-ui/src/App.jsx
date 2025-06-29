import { useState, useEffect } from "react";
import useChat from "./hooks/useChat";

export default function App() {
  const [user] = useState(() => {
    const cached = localStorage.getItem("username");
    if (cached) return cached;

    const username = prompt("請輸入使用者名稱")?.trim() || "Anonymous";
    localStorage.setItem("username", username); // 不關閉嚴格模式時他會mount兩次，我先在這裡就寫入localStorage讓第二次mount時不會再次跳出prompt
    return username;
  });

  //只要 user 改變就同步到 localStorage
  useEffect(() => {
    localStorage.setItem("username", user);
  }, [user]);

  const [text, setText] = useState("");
  const { messages, send } = useChat();
  const username = localStorage.getItem('username');

  return (
    <>
      <main className="flex flex-col mx-auto p-4 justify-center items-center w-full">
        <ul className="flex flex-col overflow-y-auto mb-4 border rounded border-black dark:border-white w-full p-4">
          {messages.map((m, i) => {
            const isMe = m.user === username; // 判斷自己

            return (
              <li
                key={i}
                className={
                  [
                    "mb-2 text-black   p-4 rounded-xl shadow max-w-[60%]",
                    isMe ? "bg-blue-400 self-end" : "bg-gray-200 dark:bg-amber-50 self-start",
                  ].join(" ")
                }
              >
                <b className="text-primary-600">{m.user}：</b>
                {m.message}
              </li>
            );
          })}
        </ul>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(user, text);
            setText("");
          }}
          className="w-full p-8"
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border rounded w-full p-2"
            placeholder="Type..."
          />
        </form>
      </main>
    </>
  );
}
