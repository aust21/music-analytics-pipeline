import { Trash2 } from "lucide-react";

const Controls = ({ togglePause, isPaused, clearMessages }: any) => {
  return (
    <div className="flex items-center space-x-3 mt-4">
      <button
        onClick={togglePause}
        className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium ${
          isPaused
            ? "bg-green-100 text-green-700 hover:bg-green-200"
            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
        }`}
      >
        <span>{isPaused ? "Pretty data" : "Raw data"}</span>
      </button>

      <button
        onClick={clearMessages}
        className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-md font-medium hover:bg-red-200"
      >
        <Trash2 size={16} />
        <span>Clear</span>
      </button>
    </div>
  );
};

export default Controls;
