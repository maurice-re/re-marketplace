export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="flex animate-pulse gap-2 w-1/2 h-1/3 mb-2">
        <div className="w-full bg-re-dark-green-300 border border-re-gray-300" />
        <div className="w-full h-full bg-re-dark-green-300 border border-re-gray-300" />
      </div>
      <div className=" animate-pulse w-1/2 h-1/2 bg-re-dark-green-300 border border-re-gray-300" />
    </div>
  );
}
