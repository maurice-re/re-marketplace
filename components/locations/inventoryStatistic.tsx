export default function InventoryStatistic({
  numericalValue,
  stringValue,
  description,
}: {
  numericalValue: number | null;
  stringValue: string | null;
  description: string;
}) {
  return (
    <div className="max-w-24 hover:border-1 flex h-20 flex-col items-center justify-center rounded-lg border-[1px] border-re-dark-green-100 bg-re-dark-green-200 text-center text-white transition delay-100 ease-in-out hover:border-re-green-300 hover:bg-black">
      <h1 className="text-sm">{description}</h1>
      <h2 className="text-3xl text-re-green-300">
        {numericalValue !== null ? numericalValue.toString() : stringValue}
      </h2>
    </div>
  );
}
