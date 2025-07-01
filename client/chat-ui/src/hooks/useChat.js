// src/hooks/useChat.js
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';

export default function useChat() {
  /* state */
  const [messages, setMessages]   = useState([]);
  const [connected, setConnected] = useState(false);

  const connRef = useRef(null);
  const apiBase = import.meta.env.VITE_API_BASE ?? 'http://localhost:5111';

  /* 建立連線 */
  useEffect(() => {
    const conn = new HubConnectionBuilder()
      .withUrl(`${apiBase}/chat`)
      .withAutomaticReconnect()
      .build();

    async function start() {
      try {
        await conn.start();
        setConnected(true);
        console.log('成功連線');
      } catch (err) {
        console.error('連線失敗，3秒後重試', err);
        setTimeout(start, 3000);
      }
    }
    start();

    /* 接收新訊息 */
    conn.on(
      'Receive',
      (id, user, content, sentAt, replyToId) => {
        setMessages(prev => [
          ...prev,
          {
            id,
            user,
            content,
            sentAt,
            replyToId,   // 可能為 null
            recall: false,
          },
        ]);
      },
    );

    /* 接收收回事件 */
    conn.on('Recall', id => {
      setMessages(prev =>
        prev.map(m => (m.id === id ? { ...m, recall: true } : m)),
      );
    });

    connRef.current = conn;
    return () => conn.stop();
  }, [apiBase]);

  /* 傳送訊息 */
  const send = useCallback((user, text, replyToId = null) => {
    const conn = connRef.current;
    if (!conn || conn.state !== HubConnectionState.Connected) return;
    conn.invoke('Send', user, text, replyToId).catch(console.error);
  }, []);

  /* 收回訊息 */
  const recall = useCallback(id => {
    connRef.current?.invoke('Recall', id).catch(console.error);
  }, []);

  return { messages, send, recall, connected };
}