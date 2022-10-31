import { ReactNode } from "react";

export function FullContainer({ children }: { children: ReactNode }) {
  return (
    <div className="flex my-4 px-4 py-4 bg-re-gray-500 bg-opacity-70 rounded-xl w-full">
      {children}
    </div>
  );
}
export function HalfContainer({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col my-4 px-4 py-4 bg-re-gray-500 bg-opacity-70 rounded-xl w-[48%]">
      {children}
    </div>
  );
}
