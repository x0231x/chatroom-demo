import { useState, useEffect } from "react";
import useChat from "./hooks/useChat";

export default function App() {
  const [user] = useState(() => {
    const cached = localStorage.getItem("username");
    if (cached) return cached;

    const username = prompt("請輸入使用者名稱")?.trim() || "Anonymous";
    localStorage.setItem('username', username); // 不關閉嚴格模式時他會mount兩次，我先在這裡就寫入localStorage讓第二次mount時不會再次跳出prompt
    return username ;
  });

  //只要 user 改變就同步到 localStorage
  useEffect(() => {
    localStorage.setItem('username', user);
  }, [user]);



  const [text, setText] = useState("");
  const { messages, send } = useChat();

  return (
    <main className="flex flex-col max-w-lg mx-auto p-4">
      <ul className="flex-1 overflow-y-auto mb-4">
        {messages.map((message, i) => (
          <li key={i} className="mb-2">
            <b className="text-primary-600">{message.user}：</b>
            {message.message}
          </li>
        ))}
      </ul>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(user, text);
          setText("");
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border rounded w-full p-2"
          placeholder="Type..."
        />
      </form>
    </main>
  );
}
