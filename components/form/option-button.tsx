function FormOptionButton({
  handleClick,
  label,
  selected,
}: {
  handleClick: () => void;
  label: string;
  selected: boolean;
}) {
  return (
    <button
      className={
        " border border-gray-200 p-4 rounded-md w-36 h-20 shadow-sm m-2 text-base mb-4" +
        (selected ? " border-blue-500" : "")
      }
      onClick={handleClick}
    >
      {label}
    </button>
  );
}

export default FormOptionButton;
