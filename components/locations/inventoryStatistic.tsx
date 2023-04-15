export default function InventoryStatistic({ numericalValue, stringValue, description }: { numericalValue: Number | null; stringValue: String | null; description: String; }) {
    return (
        <div className="flex flex-col max-w-24 h-20 border-re-dark-green-100 hover:border-re-green-300 border-[1px] hover:border-1 text-white rounded-lg bg-re-dark-green-200 items-center justify-center text-center hover:bg-black transition ease-in-out delay-100">
            <h1 className="text-sm">{description}</h1>
            <h2 className="text-re-green-300 text-3xl">{(numericalValue !== null) ? numericalValue.toString() : stringValue}</h2>
        </div>
    );
}
