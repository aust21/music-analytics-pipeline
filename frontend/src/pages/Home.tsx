import React, { useEffect, useState } from "react";

const Home = () => {
  const [messages, setMessages] = useState<any>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setMessages((prev: any) => [newMessage, ...prev]);
    };

    return () => ws.close();
  }, []);
  return (
    <div>
      {messages.map((msg, idx) => (
        <li key={idx}>{msg}</li>
      ))}
    </div>
  );
};

export default Home;
