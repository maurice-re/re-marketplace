import { useState } from "react";

function AddressField({
  bottom,
  top,
  placeholder,
}: {
  bottom?: boolean;
  placeholder: string;
  top?: boolean;
}) {
  const [val, setVal] = useState<string>("");

  let inputClass =
    "p-1 border-x-2 border-y text-lg w-full bg-stripe-gray border-gray-500 outline-re-green-800";
  if (top) {
    inputClass += " border-t-2 mt-2 rounded-t";
  }
  if (bottom) {
    inputClass += " border-b-2 mb-2 rounded-b";
  }
  return (
    <div className="p-0 my-0">
      <input
        name={placeholder}
        className={inputClass}
        type="text"
        value={val}
        placeholder={placeholder}
        onChange={(e) => setVal(e.target.value)}
      />
    </div>
  );
}

export default AddressField;
