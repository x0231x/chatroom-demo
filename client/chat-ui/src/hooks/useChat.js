import { useEffect, useRef, useState, useCallback } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

export default function useChat() {
  const [messages, setMessages] = useState([]);
  const connRef = useRef(null);
  const apiBase = import.meta.env.VITE_API_BASE ?? 'http://localhost:5000';

  // 建立連線
  useEffect(() => {
    const conn = new HubConnectionBuilder()
      .withUrl(`${apiBase}/chat`, { withCredentials: true })
      .withAutomaticReconnect()
      .build();

    conn.start();
    conn.on('Receive', (user, message) => setMessages((prev) => [...prev, { user, message }]));
    connRef.current = conn;

    return () => { conn.stop(); };
  }, []);

  const send = useCallback((user, text) => {
    connRef.current?.invoke('Send', user, text);
  }, []);

  return { messages, send };
}