import { FullLocation } from "../../app/server-store";
import InventoryStatistic from "./inventoryStatistic";

export default function Inventory({ location, inUseContainerCount, lostContainerCount, returnStationCount, borrowStationCount }: { location: FullLocation; inUseContainerCount: Number, lostContainerCount: Number, returnStationCount: Number, borrowStationCount: Number; }) {
    return location && (
        <div className="justify-center items-center flex w-full flex-col">
            <h1 className="pt-3 text-xl pb-1">Inventory</h1>
            <div className="pt-4 grid gap-2 overflow-x-auto w-full pr-1 items-start grid-flow-col">
                <InventoryStatistic numericalValue={inUseContainerCount} stringValue={null} description={"# of Containers In Use"} />
                <InventoryStatistic numericalValue={lostContainerCount} stringValue={null} description={"# of Containers Lost"} />
                <InventoryStatistic numericalValue={returnStationCount} stringValue={null} description={"# of Return Stations"} />
                <InventoryStatistic numericalValue={borrowStationCount} stringValue={null} description={"# of Borrow Stations"} />
            </div>
            <h1 className="pt-6">Borrow/Return Stations</h1>
            {/* <HardwareStatusTable /> */}
            {/* TODO(Suhana): Show the containerCount, lastReplaced date. */}
        </div>
    );
}
