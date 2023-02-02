import { ChangeEvent } from "react";

function DoubleInputField({
  leftName,
  leftPlaceholder,
  leftValue,
  required,
  rightName,
  rightPlaceholder,
  rightValue,
  top,
  onChange,
}: {
  leftName: string;
  leftPlaceholder: string;
  leftValue?: string;
  required?: boolean;
  rightName: string;
  rightPlaceholder: string;
  rightValue?: string;
  top?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  let leftInputClass =
    "p-1 border-l-2 border-r border-y text-lg w-1/2 bg-stripe-gray border-gray-500 outline-re-green-800";
  let rightInputClass =
    "p-1 border-l border-r-2 border-y text-lg w-1/2 bg-stripe-gray border-gray-500 outline-re-green-800";
  if (top) {
    leftInputClass += " rounded-tl mt-2";
    rightInputClass += " rounded-tr mt-2";
  }
  return (
    <div className="p-0 my-0 flex-row">
      <input
        name={leftName}
        className={leftInputClass}
        type="text"
        value={leftValue}
        placeholder={leftPlaceholder}
        onChange={onChange}
        required={required}
      />
      <input
        name={rightName}
        className={rightInputClass}
        type="text"
        value={rightValue}
        placeholder={rightPlaceholder}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}

export default DoubleInputField;
