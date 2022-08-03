import { useState } from "react";

function AddressField({
  bottom,
  placeholder,
  required,
  top,
  value,
}: {
  bottom?: boolean;
  placeholder: string;
  required?: boolean;
  top?: boolean;
  value?: string;
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
        value={value ?? val}
        placeholder={placeholder}
        onChange={(e) => setVal(e.target.value)}
        required={required}
        disabled={value != undefined}
      />
    </div>
  );
}

export default AddressField;
