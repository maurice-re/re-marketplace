import { ChangeEvent } from "react";

function InputField({
  bottom,
  name,
  placeholder,
  required,
  top,
  value,
  onChange
}: {
  bottom?: boolean;
  name: string;
  placeholder: string;
  required?: boolean;
  top?: boolean;
  value?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
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
        name={name}
        className={inputClass}
        type="text"
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={onChange}
      />
    </div>
  );
}

export default InputField;
