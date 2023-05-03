import { FullHardware } from "../../app/server-store";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

export default function HardwareStatusTable({ allHardware }: { allHardware: FullHardware[]; }) {
    return (allHardware && allHardware.length > 0) ? (
        <div className="flex w-3/4 max-h-148 overflow-scroll border border-re-gray-300 rounded-md">
            <table className="w-full h-min font-theinhardt-300">
                <thead>
                    <tr className="text-re-gray-text text-lg text-left p-4">
                        <th className="py-2 pl-2 sticky top-0 bg-re-black">Notes</th>
                        <th className="pl-2 sticky top-0 bg-re-black">Type</th>
                        <th className="pl-2 sticky top-0 bg-re-black">Last Replaced</th>
                        <th className="pl-2 sticky top-0 bg-re-black"># of Containers</th>
                        <th className="pl-2 sticky top-0 bg-re-black">Full</th>
                    </tr>
                </thead>
                <tbody className="text-left">
                    {allHardware.map((hardware) => (
                        <tr
                            key={hardware.id}
                            className="even:bg-re-table-even odd:bg-re-table-odd hover:bg-re-table-hover"
                        >
                            <td className="py-3 pl-2">{hardware.notes}</td>
                            <td className="pl-2">{hardware.return ? "Return" : "Borrow"}</td>
                            <td className="pl-2">
                                {hardware.lastReplaced.toUTCString()}
                            </td>
                            <td className="pl-2">{hardware.containerCount}</td>
                            <td className="pl-2">{hardware.capacity === hardware.containerCount ? <AiOutlineCheck className="text-white" /> : <AiOutlineClose className="text-white" />}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    ) : (<div>
        Purchase hardware to see data here.
    </div>);
}