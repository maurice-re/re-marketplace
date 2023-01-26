import { ReactNode } from "react";

export function FullContainer({ children }: { children: ReactNode }) {
  return (
    <div className="flex px-4 py-3 bg-re-dark-green-300 border border-re-gray-300 rounded-md w-full">
      {children}
    </div>
  );
}
export function HalfContainer({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col px-4 py-3 border border-re-gray-300 rounded-md w-[49%] bg-re-dark-green-300 h-min">
      {children}
    </div>
  );
}
