"use client";
import { User } from "@prisma/client";
import { FormEvent } from "react";
import { GrClose } from "react-icons/gr";

// owned = is the location in question owned by the logged in user
// owner = is the user being displayed an owner of the location in question

export default function LocationUsersList({ locationId, users, owned, owner }: { locationId: string; users: User[]; owned: string; owner: boolean; }) {
    const handleRemoveUser = async (e: FormEvent<HTMLFormElement>, userId: string) => {
        e.preventDefault();
        const res = await fetch(`/api/locations/location?locationId=${locationId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userIds: [userId], owner
            }),
        });
        if (res.status == 200) {
            // TODO(Suhana): Get dynamic update working
        }
        const { message } = await res.json();
        console.log(message);
    };
    return users && (
        <div className='flex space-x-2 items-center justify-center overflow-x-auto mt-4'>
            {users.map((user) => (
                <form
                    onSubmit={(e) => { handleRemoveUser(e, user.id); }}
                    key={user.id}
                    className="tooltip tooltip-bottom w-48"
                >
                    <div className="flex items-center flex-col bg-re-table-odd rounded-md pb-6 w-full transition ease-in-out delay-50  duration-300 hover:bg-re-green-500 text-white hover:text-black">
                        {owned === "owner" && (<button id="submit" className="w-full flex justify-end pt-2 pr-2">
                            <GrClose size={20} color="white" />
                        </button>)}
                        <div className={`font-thin text-lg tracking-wide leading-none ${owned === "owner" ? "" : "pt-6"}`}>
                            {user.firstName + " " + user.lastName}
                        </div>
                    </div>
                </form>
            ))
            }
        </div >
    );
}
