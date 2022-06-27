import { useState } from "react";

function FormOptionButton({
  handleClick,
  label,
  selected,
}: {
  handleClick: () => void;
  label: string;
  selected: boolean;
}) {
  const [_, forceRender] = useState<number>(0);
  let buttonClass =
    "border border-gray-200 p-4 rounded-md w-36 h-20 shadow-sm m-2 text-base mb-4";

  if (selected) {
    buttonClass += " border-blue-500";
  }

  // function _handleClick() {
  //   handleClick();
  //   forceRender((prev) => prev + 1);
  // }

  return (
    <button className={buttonClass} onClick={handleClick}>
      {label}
    </button>
  );
}

export default FormOptionButton;
