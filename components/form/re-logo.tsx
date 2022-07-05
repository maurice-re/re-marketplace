import Image from "next/image";

function ReLogo() {
  return (
    <div className="absolute right-6 top-6 flex">
      <Image
        src={"/images/logo.png"}
        height={54}
        width={71.12}
        alt={"Re Company Logo"}
      />
    </div>
  );
}

export default ReLogo;
