import Image from "next/future/image";

function FormCircleButton({
  handleClick,
  title,
  selected,
  image,
}: {
  handleClick: () => void;
  title: string;
  selected: boolean;
  image?: string;
}) {
  const borderColor = selected
    ? " border-re-green-500 group-hover:border-re-green-700"
    : " border-white group-hover:border-re-green-500";

  return (
    <div className="flex flex-col relative pt-2 group">
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
          "w-52 h-52 rounded-10 border-2 flex flex-col items-center justify-end mb-4 mx-4 active:border-re-green-500" +
          borderColor
        }
        onClick={handleClick}
      >
        {image ? (
          <Image
            src={image}
            height={112}
            width={112}
            alt={title}
            priority
            className=" invert"
          />
        ) : (
          <Image src={"/"} height={100} width={100} alt={"placeholder"} />
        )}
        <p className="text-white font-theinhardt text-25 py-3">{title}</p>
      </button>
    </div>
  );
}

export default FormCircleButton;
