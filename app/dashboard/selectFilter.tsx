"use client";

import { ChangeEvent, useState } from "react";
import { FullLocation } from "../server-store";

export default function SelectFilter({ locations, selectedFilter }: { locations: FullLocation[]; selectedFilter: Filter | null; }) {
    const [location, setLocation] = useState<FullLocation>(selectedFilter ?? locations[0]);

    const handleChange = async (
        e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
    ) => {
        const { value } = e.target;
        console.log("Looking for ID ", value);
        const newLocation = locations.find(
            (location) => location.id === value
        );
        if (newLocation) {
            setLocation(newLocation);
            // await useServerStore.getState().setFilter(newLocation);
        }
    };

    return (
        <div className="p-0 my-0">
            <select
                name="location"
                className="px-1 py-2 border-x-2 border-y text-lg w-full bg-stripe-gray border-gray-500 outline-re-green-800 border-t-2 mt-2 rounded-t border-b-2 mb-2 rounded-b"
                onChange={handleChange}
                required
                placeholder="Location"
                value={location.id}
            >
                {locations.map((val) => (
                    <option key={val.id} value={val.id}>
                        {val.id}
                    </option>
                ))}
            </select>
        </div>
    );
}