import React, { useEffect, useState, useRef } from "react";
import { Clock, Wifi, WifiOff, Trash2, Play, Pause } from "lucide-react";
import JsonRender from "../components/JsonRender";
import Controls from "../components/Controls";
import Header from "../components/Header";
import SimplifiedData from "../components/SimplifiedData";

const Home = () => {
  const [messages, setMessages] = useState<any>([]);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [isRawData, setIsRawData] = useState(false);
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
        try {
          const messageData = JSON.parse(event.data);
          const newMessage = {
            id: Date.now() + Math.random(),
            timestamp: new Date().toISOString(),
            data: messageData,
            raw: event.data,
          };

          setMessages((prev: any) => [newMessage, ...prev.slice(0, 999)]);
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

  const toggleDataView = () => {
    setIsRawData(!isRawData);
  };

  const formatTimestamp = (timestamp: any) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  // Component to render JSON as interactive tree
  const JsonRenderer = ({ data, depth = 0 }: { data: any; depth?: number }) => {
    const [collapsed, setCollapsed] = useState(depth > 2); // Auto-collapse deep levels

    if (data === null)
      return <span className="text-gray-500 italic">null</span>;
    if (data === undefined)
      return <span className="text-gray-500 italic">undefined</span>;

    // Primitive types
    if (typeof data === "string") {
      return <span className="text-green-600">"{data}"</span>;
    }
    if (typeof data === "number") {
      return <span className="text-blue-600">{data}</span>;
    }
    if (typeof data === "boolean") {
      return <span className="text-purple-600">{data.toString()}</span>;
    }

    // Arrays
    if (Array.isArray(data)) {
      if (data.length === 0) return <span className="text-gray-500">[]</span>;

      return (
        <div className="inline-block">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            <span className="mr-1">{collapsed ? "▶" : "▼"}</span>
            <span className="text-gray-500">[{data.length}]</span>
          </button>
          {!collapsed && (
            <div className="ml-4 mt-1 border-l-2 border-gray-200 pl-2">
              {data.map((item, index) => (
                <div key={index} className="mb-1">
                  <span className="text-gray-400 text-xs mr-2">{index}:</span>
                  <JsonRenderer data={item} depth={depth + 1} />
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Objects
    if (typeof data === "object") {
      const keys = Object.keys(data);
      if (keys.length === 0)
        return <span className="text-gray-500">{"{}"}</span>;

      return (
        <div className="inline-block">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            <span className="mr-1">{collapsed ? "▶" : "▼"}</span>
            <span className="text-gray-500">
              {"{"}
              {keys.length}
              {"}"}
            </span>
          </button>
          {!collapsed && (
            <div className="ml-4 mt-1 border-l-2 border-gray-200 pl-2">
              {keys.map((key) => (
                <div key={key} className="mb-1">
                  <span className="text-orange-600 font-medium mr-1">
                    {key}
                  </span>
                  <span className="text-gray-500 mr-2">:</span>
                  <JsonRenderer data={data[key]} depth={depth + 1} />
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Fallback
    return <span className="text-gray-700">{String(data)}</span>;
  };

  const RenderSimplifiedData = ({ data }: any) => {
    let parsedData;
    try {
      if (typeof data === "string" && data.trim() !== "") {
        parsedData = JSON.parse(data);
      } else {
        parsedData = null;
      }
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      parsedData = null;
    }
    if (data === null)
      return <span className="text-gray-500 italic">null</span>;
    if (data === undefined)
      return <span className="text-gray-500 italic">undefined</span>;

    return (
      <div className="max-w-md">

        <div className="space-y-4">
          <div className="flex gap-3 items-baseline">
            <p className="text-gray-600 font-medium min-w-[80px]">User ID:</p>
            <span className="text-green-600 font-mono">
              {parsedData?.userId ?? "No user ID"}
            </span>
          </div>

          <div className="flex gap-3 items-baseline">
            <p className="text-gray-600 font-medium min-w-[80px]">Artist:</p>
            <span className="text-green-600">
              {parsedData?.song.title ? (
                <>
                  {parsedData.song.title} by {parsedData.song.artist}
                </>
              ) : (
                "N/A"
              )}
            </span>
          </div>

          <div className="flex gap-3 items-baseline">
            <p className="text-gray-600 font-medium min-w-[80px]">Album:</p>
            <span className="text-green-600">
              {parsedData?.song.album ?? "N/A"}
            </span>
          </div>

          <div className="flex gap-3 items-baseline">
            <p className="text-gray-600 font-medium min-w-[80px]">Action:</p>
            <span className="text-green-600 capitalize">
              {parsedData?.action ?? "N/A"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Usage in your component:
  const renderMessageContent = (message: any) => {
    return (
      <div className="text-sm bg-gray-50 p-3 rounded mt-1 max-w-full overflow-hidden">
        {isRawData ? (
          <JsonRenderer data={message.data} />
        ) : (
          <RenderSimplifiedData data={message.data["value"]} />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <Header
            connectionStatus={connectionStatus}
            messageCount={messageCount}
          />

          {/* Controls */}
          <Controls
            toggleDataView={toggleDataView}
            isRawData={isRawData}
            clearMessages={clearMessages}
          />
        </div>

        {isRawData ? (
          <JsonRender
            messages={messages}
            connectionStatus={connectionStatus}
            formatTimestamp={formatTimestamp}
            messageCount={messageCount}
            renderMessageContent={renderMessageContent}
          />
        ) : (
          <SimplifiedData
            messages={messages}
            connectionStatus={connectionStatus}
            formatTimestamp={formatTimestamp}
            messageCount={messageCount}
            renderMessageContent={renderMessageContent}
          />
        )}

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
