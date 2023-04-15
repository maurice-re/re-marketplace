export default function InventoryStatistic({ numericalValue, stringValue, description }: { numericalValue: Number | null; stringValue: String | null; description: String; }) {
    return (
        <div className="flex flex-col max-w-24 h-20 border-re-dark-green-100 border-2 text-white rounded-lg bg-re-dark-green-200">
            <h1>{description}</h1>
            <h2>{numericalValue ? numericalValue.toString() : stringValue}</h2>
        </div>
    );
}
