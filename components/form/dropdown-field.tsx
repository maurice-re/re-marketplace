import { ChangeEvent } from "react";

function DropdownField({
  bottom,
  name,
  placeholder,
  required,
  top,
  value,
  options,
  onChange
}: {
  bottom?: boolean;
  name: string;
  placeholder: string;
  required?: boolean;
  top?: boolean;
  value?: string;
  options: string[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}) {
  let selectClass =
    "px-1 py-2 border-x-2 border-y text-lg w-full bg-stripe-gray border-gray-500 outline-re-green-800 border-t-2 mt-2 rounded-t border-b-2 mb-2 rounded-b";
  if (top) {
    selectClass += " border-t-2 mt-2 rounded-t";
  }
  if (bottom) {
    selectClass += " border-b-2 mb-2 rounded-b";
  }
  return (
    <div className="p-0 my-0 w-full">
      <select
        name={name}
        className={selectClass}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        value={value}
      >
        {options.map((val) => (
          <option key={val} value={val}>
            {val}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DropdownField;
