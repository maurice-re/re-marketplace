import { FullHardware, FullLocation } from "../../app/server-store";
import { getItemsInUse, getTotals } from "../../utils/tracking/trackingUtils";
import HardwareStatusTable from "./hardwareStatusTable";
import InventoryStatistic from "./inventoryStatistic";

export default function Inventory({ location, allHardware }: { location: FullLocation; allHardware: FullHardware[]; }) {
    const returnStations: FullHardware[] = allHardware.filter((hardware: FullHardware) => hardware.return);
    const borrowStations: FullHardware[] = allHardware.filter((hardware: FullHardware) => !hardware.return);

    return location && (
        <div className="justify-center items-center flex w-full flex-col">
            <h1 className="pt-3 text-xl pb-1">Inventory</h1>
            <div className="pt-4 grid gap-2 overflow-x-auto w-full pr-1 items-start grid-flow-col">
                <InventoryStatistic numericalValue={getItemsInUse(location.events)} stringValue={null} description={"# of Containers In Use"} />
                <InventoryStatistic numericalValue={getTotals(location.events).lost} stringValue={null} description={"# of Containers Lost"} />
                <InventoryStatistic numericalValue={returnStations ? returnStations.length : 0} stringValue={null} description={"# of Return Stations"} />
                <InventoryStatistic numericalValue={borrowStations ? borrowStations.length : 0} stringValue={null} description={"# of Borrow Stations"} />
            </div>
            <h1 className="py-6">Borrow/Return Stations</h1>
            <HardwareStatusTable allHardware={allHardware} />
        </div>
    );
}
