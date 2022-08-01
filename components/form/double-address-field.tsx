import { useState } from "react";

function DoubleAddressField({
  leftPlaceholder,
  leftValue,
  required,
  rightPlaceholder,
  rightValue,
  top,
}: {
  leftPlaceholder: string;
  leftValue?: string;
  required?: boolean;
  rightPlaceholder: string;
  rightValue?: string;
  top?: boolean;
}) {
  const [leftVal, setLeftVal] = useState<string>("");
  const [rightVal, setRightVal] = useState<string>("");

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
        name={leftPlaceholder}
        className={leftInputClass}
        type="text"
        value={leftValue ?? leftVal}
        placeholder={leftPlaceholder}
        onChange={(e) => setLeftVal(e.target.value)}
        required={required}
        disabled={leftValue != undefined}
      />
      <input
        name={rightPlaceholder}
        className={rightInputClass}
        type="text"
        value={rightValue ?? rightVal}
        placeholder={rightPlaceholder}
        onChange={(e) => setRightVal(e.target.value)}
        required={required}
        disabled={rightValue != undefined}
      />
    </div>
  );
}

export default DoubleAddressField;
