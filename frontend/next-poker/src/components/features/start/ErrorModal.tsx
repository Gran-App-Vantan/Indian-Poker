import React from "react";

interface ErrorModalProps {
  message: string;
  onClose: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ message, onClose }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-xl max-w-md mx-auto">
      <div className="mb-6 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-red-600 mb-4">エラー</h2>
        <p className="text-gray-700 text-lg">{message}</p>
      </div>
      
      <button
        onClick={onClose}
        className="px-8 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
      >
        閉じる
      </button>
    </div>
  );
};
