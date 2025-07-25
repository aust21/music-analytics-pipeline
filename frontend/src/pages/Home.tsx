import React, { useEffect, useState, useRef } from "react";
import { Clock, Wifi, WifiOff, Trash2, Play, Pause } from "lucide-react";

const Home = () => {
  const [messages, setMessages] = useState<any>([]);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [isPaused, setIsPaused] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const wsRef = useRef<any>(null);
  const reconnectTimeoutRef = useRef<any>(null);

  const connectWebSocket = () => {
    try {
      wsRef.current = new WebSocket("ws://localhost:5000");

      wsRef.current.onopen = () => {
        setConnectionStatus("connected");
        console.log("WebSocket connected");
      };

      wsRef.current.onmessage = (event: any) => {
        if (!isPaused) {
          try {
            const messageData = JSON.parse(event.data);
            const newMessage = {
              id: Date.now() + Math.random(),
              timestamp: new Date().toISOString(),
              data: messageData,
              raw: event.data,
            };

            setMessages((prev: any) => [newMessage, ...prev.slice(0, 999)]); // Keep only last 1000 messages
            setMessageCount((count) => count + 1);
          } catch (error) {
            // If not JSON, treat as plain text
            const newMessage = {
              id: Date.now() + Math.random(),
              timestamp: new Date().toISOString(),
              data: event.data,
              raw: event.data,
            };
            setMessages((prev: any) => [newMessage, ...prev.slice(0, 999)]);
            setMessageCount((count) => count + 1);
          }
        }
      };

      wsRef.current.onclose = () => {
        setConnectionStatus("disconnected");
        console.log("WebSocket disconnected");

        // Auto-reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log("Attempting to reconnect...");
          connectWebSocket();
        }, 3000);
      };

      wsRef.current.onerror = (error: any) => {
        setConnectionStatus("error");
        console.error("WebSocket error:", error);
      };
    } catch (error) {
      setConnectionStatus("error");
      console.error("Failed to create WebSocket:", error);
    }
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const clearMessages = () => {
    setMessages([]);
    setMessageCount(0);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const formatTimestamp = (timestamp: any) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const renderMessageContent = (message: any) => {
    if (typeof message.data === "object") {
      return (
        <pre className="text-sm text-gray-700 overflow-x-auto bg-gray-50 p-2 rounded mt-1">
          {JSON.stringify(message.data, null, 2)}
        </pre>
      );
    }
    return (
      <div className="text-sm text-gray-700 mt-1 break-words">
        {message.data}
      </div>
    );
  };

  const getStatusColor = (status: any) => {
    switch (status) {
      case "connected":
        return "text-green-600";
      case "disconnected":
        return "text-red-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status: any) => {
    return status === "connected" ? <Wifi size={16} /> : <WifiOff size={16} />;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Kafka Message Stream
              </h1>
              <p className="text-gray-600 mt-1">Topic: music-analytics</p>
            </div>

            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center space-x-2 ${getStatusColor(
                  connectionStatus
                )}`}
              >
                {getStatusIcon(connectionStatus)}
                <span className="font-medium capitalize">
                  {connectionStatus}
                </span>
              </div>

              <div className="text-sm text-gray-600">
                Messages: <span className="font-medium">{messageCount}</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3 mt-4">
            <button
              onClick={togglePause}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium ${
                isPaused
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
              }`}
            >
              {isPaused ? <Play size={16} /> : <Pause size={16} />}
              <span>{isPaused ? "Resume" : "Pause"}</span>
            </button>

            <button
              onClick={clearMessages}
              className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-md font-medium hover:bg-red-200"
            >
              <Trash2 size={16} />
              <span>Clear</span>
            </button>

            {isPaused && (
              <div className="text-sm text-yellow-600 font-medium">
                Stream paused - new messages are being buffered
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white rounded-lg shadow-sm">
          {messages.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="text-lg font-medium">No messages yet</div>
              <div className="text-sm mt-1">
                {connectionStatus === "connected"
                  ? "Waiting for messages from Kafka topic..."
                  : "Connecting to WebSocket server..."}
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {messages.map((message: any) => (
                <div key={message.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Clock size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-500 font-mono">
                          {formatTimestamp(message.timestamp)}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          #{messageCount - messages.indexOf(message)}
                        </span>
                      </div>
                      {renderMessageContent(message)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-4 text-center text-xs text-gray-500">
          Displaying last {Math.min(messages.length, 1000)} messages •
          Auto-reconnect enabled
        </div>
      </div>
    </div>
  );
};

export default Home;
