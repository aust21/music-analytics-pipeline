import { Trash2 } from "lucide-react";

const Controls = ({ toggleDataView, isRawData, clearMessages }: any) => {
  return (
    <div className="flex items-center space-x-3 mt-4">
      <button
        onClick={toggleDataView}
        className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium ${
          isRawData
            ? "bg-green-100 text-green-700 hover:bg-green-200"
            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
        }`}
      >
        <span>{isRawData ? "Pretty data" : "Raw data"}</span>
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
