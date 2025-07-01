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
  const [replyTo, setReplyTo] = useState(null); // 目前選取的回覆對象
  const { messages, send, recall, connected } = useChat();
  const username = localStorage.getItem("username");

  return (
    <main className="flex flex-col mx-auto p-4 justify-center items-center w-full">
      {/* 若正在回覆，顯示提示框 */}
      {replyTo && (
        <div className="w-full mb-2 p-2 bg-gray-400 text-black rounded">
          回覆 <b>{replyTo.user}</b>：{replyTo.content.slice(0, 30)}…
          <button
            className="ml-2 text-black dark:text-white bg-gray-500 p-1 rounded"
            onClick={() => setReplyTo(null)}
          >
            取消
          </button>
        </div>
      )}

      <ul className="flex flex-col overflow-y-auto mb-4 border rounded border-black dark:border-white w-full p-4">
        {messages.map((m) => {
          const isMe = m.user === username; // 判斷自己

          return (
            <li
              key={m.id}
              onClick={() => !m.recall && setReplyTo(m)} // 點一下選為回覆對象
              className={[
                "mb-2 max-w-[60%] p-4 rounded-xl shadow cursor-pointer",
                m.recall
                  ? "italic text-gray-400 bg-transparent self-center"
                  : isMe
                  ? "bg-blue-400 self-end"
                  : "bg-gray-200 dark:bg-amber-50 text-black self-start",
                isMe ? "text-right" : "text-left",
              ].join(" ")}
            >
              {m.recall ? (
                "訊息已收回"
              ) : (
                <>
                  {m.replyToId && (
                    <div className="mb-1 p-1 text-xs  rounded">
                      ↪︎ 回覆 #{m.replyToId}
                    </div>
                  )}
                  <b className="text-primary-600">{m.user}：</b>
                  {m.content}
                  {/* 自己的訊息才顯示收回按鈕 */}
                  {isMe && !m.recall && (
                    <button
                      className="ml-2 bg-gray-500 p-1 rounded"
                      onClick={() => recall(m.id)}
                    >
                      收回
                    </button>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ul>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const msg = text.trim();
          if (!connected || !msg) return; // 未連線或空字串時不送
          send(user, msg, replyTo?.id); // 帶入 replyToId
          setText("");
          setReplyTo(null); // 送出後清除回覆狀態
        }}
        className="w-full p-8"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border rounded w-full p-2 disabled:opacity-50"
          placeholder={connected ? "Type..." : "Connecting..."}
          disabled={!connected} // 連線前禁用
        />
      </form>
    </main>
  );
}
