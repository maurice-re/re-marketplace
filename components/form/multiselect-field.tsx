"use client";
import { ChangeEvent, useState } from "react";
import { Location } from "@prisma/client";

function MultiselectField({
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
    "p-1 border-x-2 border-y text-lg w-full bg-stripe-gray border-gray-500 outline-re-green-800";
  if (top) {
    selectClass += " border-t-2 mt-2 rounded-t";
  }
  if (bottom) {
    selectClass += " border-b-2 mb-2 rounded-b";
  }

  const [open, setOpen] = useState<boolean>(false);

  const [selected, setSelected] = useState<string[]>([]);

  const toggleOption = (id: string) => {
    setSelected((prevSelected: string[]) => {
      // if it's in, remove
      const newArray = [...prevSelected];
      if (newArray.includes(id)) {
        return newArray.filter(item => item != id);
        // else, add
      } else {
        newArray.push(id);
        return newArray;
      }
    });
  };
  return (
    <div className="p-0 my-0 relative w-full">
      <div className="cursor-pointer px-1 py-2 border-x-2 border-y text-lg w-full bg-stripe-gray border-gray-500 outline-re-green-800 border-t-2 mt-2 rounded-t border-b-2 mb-2 rounded-b" onClick={() => setOpen(!open)}>
        {selected.length} selected
      </div>
      <ul className={`${open ? "block" : "hidden"} hover:block absolute left-0 w-full `}>
        {options.map((locationId, index) => {
          const isSelected = selected.includes(locationId);
          return (
            <li key={index} className="flex items-center px-2 py-4 cursor-pointer hover:bg-re-gray-500 rounded" onClick={() => toggleOption(locationId)}>
              <input type="checkbox" checked={isSelected} className="mr-2" readOnly />
              <span>{locationId}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default MultiselectField;
