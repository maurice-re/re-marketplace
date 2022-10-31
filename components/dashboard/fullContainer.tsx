import { ReactNode } from "react";

function FullContainer({ children }: { children: ReactNode }) {
  return (
    <div className="flex my-4 px-4 py-4 bg-re-gray-500 bg-opacity-70 rounded-xl w-full">
      {children}
    </div>
  );
}

export default FullContainer;
