import { useState } from "react";

function DoubleAddressField({
  leftPlaceholder,
  rightPlaceholder,
  top,
}: {
  leftPlaceholder: string;
  rightPlaceholder: string;
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
        value={leftVal}
        placeholder={leftPlaceholder}
        onChange={(e) => setLeftVal(e.target.value)}
      />
      <input
        name={rightPlaceholder}
        className={rightInputClass}
        type="text"
        value={rightVal}
        placeholder={rightPlaceholder}
        onChange={(e) => setRightVal(e.target.value)}
      />
    </div>
  );
}

export default DoubleAddressField;
