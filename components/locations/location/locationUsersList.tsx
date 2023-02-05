"use client";
import { User } from "@prisma/client";
import { FormEvent } from "react";

export default function LocationUsersList({ locationId, users, owned }: { locationId: string; users: User[]; owned: boolean; }) {
    const handleRemoveUser = async (e: FormEvent<HTMLFormElement>, userId: string, owned: boolean) => {
        e.preventDefault();
        const res = await fetch("/api/locations/remove-users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                locationId: locationId, userIds: [userId], owned: owned
            }),
        });
        if (res.status != 200) {
            // setErrorInputValues(inputValues);
        } else {
            // setSuccessInputValues(inputValues);
        }
        const { message } = await res.json();
        console.log(message);
    };
    return users && (
        <div className='flex space-x-2 items-center justify-center overflow-x-auto'>
            {users.map((user) => (
                <form
                    onSubmit={(e) => { handleRemoveUser(e, user.id, owned); }}
                    key={user.id}
                    className="tooltip tooltip-bottom w-48"
                >
                    {/* Need to disconnect the user from the location. */}
                    {/* TODO(Suhana): Make this button an "X" and clean up this UI */}
                    <button id="submit" className=" flex items-start items-justify flex-col bg-re-table-odd rounded-md py-4 pl-3 transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-105  duration-300 hover:bg-re-green-500 text-white hover:text-black">
                        <div className="font-thin text-lg tracking-wide leading-none">
                            {user.firstName + " " + user.lastName}
                        </div>
                    </button>
                </form>
            ))}
        </div>
    );
}
