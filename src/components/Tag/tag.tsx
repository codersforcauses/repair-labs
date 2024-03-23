import React from "react";

interface SelectedOptionProps {
  option: string;
  onRemove: (option: string) => void;
}

const SelectedOption: React.FC<SelectedOptionProps> = ({
  option,
  onRemove
}) => {
  return (
    <div className="flex items-center bg-lightAqua-100 text-slate-600 text-xs font-medium rounded px-2 py-1 m-1">
      <span>{option}</span>
      <button
        onClick={() => onRemove(option)}
        className="bg-lightAqua-100 text-slate-600 text-xs hover:text-darkAqua-500 rounded ml-1 p-0.5 inline-flex items-center justify-center focus:outline-none"
      >
        &times;
      </button>
    </div>
  );
};

export default SelectedOption;
