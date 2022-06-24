import { useState } from "react";

function AddressField({
  bottom,
  top,
  placeholder,
}: {
  bottom?: boolean;
  top?: boolean;
  placeholder: string;
}) {
  const [val, setVal] = useState<string>("");

  let c = "p-1 border-x-2 border-y text-lg w-full";
  if (top) {
    c += " border-t-2 mt-2 rounded-t";
  }
  if (bottom) {
    c += " border-b-2 mb-2 rounded-b";
  }
  return (
    <div className="p-0 my-0">
      <input
        name={placeholder}
        className={c}
        type="text"
        value={val}
        placeholder={placeholder}
        onChange={(e) => setVal(e.target.value)}
      />
    </div>
  );
}

export default AddressField;
