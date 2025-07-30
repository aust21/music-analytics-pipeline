import { Clock } from "lucide-react";
import React from "react";

const JsonRender = ({
  messages,
  connectionStatus,
  formatTimestamp,
  messageCount,
  renderMessageContent,
}: any) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                <div className="flex-1 min-w-0">
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
  );
};

export default JsonRender;
