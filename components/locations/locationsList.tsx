import { ChangeEvent, FormEvent, useState } from "react";
import { User, Location } from "@prisma/client";

export default function LocationsList({ user, locations, owned }: { user: User; locations: Location[]; owned: boolean; }) {
    const [loading, setIsLoading] = useState<boolean>(false);
    return (
        <div className="justify-center items-center flex w-1/2 flex-col">
            <h1>{owned ? `Owned` : `Viewable`} Locations</h1>
            <div className="w-full flex space-x-3">
                {locations.map((location, index) => (
                    <div
                        className="flex justify-between items-center px-4 py-4 border-2 border-re-green-300 rounded-lg"
                        key={index}
                    >
                        <h1>{location.displayName}</h1>
                        <div>
                            <input
                                type="checkbox"
                                id="location-modal"
                                className="modal-toggle"
                            />
                            <div className="modal">
                                <div className="modal-box">
                                    <h3 className="font-bold text-lg">Remove a User</h3>
                                    <form id="remove-user-form" onSubmit={undefined}>
                                        {/* TODO(Suhana): Get modal working to allow them to view owners and/or viewers, and allow owners to remove either owners or viewers. */}
                                        <div className="modal-action flex">
                                            <button
                                                className="btn btn-outline btn-error"
                                                type="button"
                                                disabled={loading}
                                                onClick={() =>
                                                    document.getElementById("location-modal")?.click()
                                                }
                                            >
                                                Close
                                            </button>
                                            <button
                                                className={`btn btn-outline btn-accent ${loading ? "loading" : ""
                                                    }`}
                                                type="submit"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
