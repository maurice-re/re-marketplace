import Image from "next/future/image";

function FormOptionButton({
  handleClick,
  label,
  selected,
}: {
  handleClick: () => void;
  label: string;
  selected: boolean;
}) {
  const borderColor = selected
    ? " border-re-green-500 group-hover:border-re-green-700"
    : " border-white group-hover:border-re-green-500";

  return (
    <div className="flex group relative w-52 mr-8 pt-2">
      {selected && (
        <div className="bg-re-green-500 h-6 w-6 z-10 rounded-full pl-1 absolute right-2 top-0 group-hover:bg-re-green-700">
          <Image
            src="/icons/check.png"
            height={10}
            width={15}
            alt="check mark"
          />
        </div>
      )}
      <button
        className={
          " border-2 rounded-10 w-48 py-1 text-25 font-theinhardt text-white active:border-re-green-400" +
          borderColor
        }
        onClick={handleClick}
      >
        {label}
      </button>
    </div>
  );
}

export default FormOptionButton;
