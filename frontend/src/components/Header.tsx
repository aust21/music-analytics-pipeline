import { Wifi, WifiOff } from "lucide-react";
import React from "react";

const Header = ({messageCount, connectionStatus}:any) => {
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
          <span className="font-medium capitalize">{connectionStatus}</span>
        </div>

        <div className="text-sm text-gray-600">
          Messages: <span className="font-medium">{messageCount}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
