import { useState } from "react";

function DoubleAddressField({
  leftPlaceholder,
  rightPlaceholder,
}: {
  leftPlaceholder: string;
  rightPlaceholder: string;
}) {
  const [leftVal, setLeftVal] = useState<string>("");
  const [rightVal, setRightVal] = useState<string>("");
  return (
    <div className="p-0 my-0 flex-row">
      <input
        name={leftPlaceholder}
        className="p-1 border-l-2 border-r border-y text-lg w-1/2"
        type="text"
        value={leftVal}
        placeholder={leftPlaceholder}
        onChange={(e) => setLeftVal(e.target.value)}
      />
      <input
        name={rightPlaceholder}
        className="p-1 border-l border-r-2 border-y text-lg w-1/2"
        type="text"
        value={rightVal}
        placeholder={rightPlaceholder}
        onChange={(e) => setRightVal(e.target.value)}
      />
    </div>
  );
}

export default DoubleAddressField;
