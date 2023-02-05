import { ChangeEvent, FormEvent, useState } from "react";
import { User, Location } from "@prisma/client";
import Link from "next/link";

export default function LocationUsersList({ locationId, users, owned }: { locationId: string; users: User[]; owned: boolean; }) {
    return users && (
        <div className='flex space-x-2 items-center justify-center overflow-x-auto'>
            {users.map((user) => (
                <div
                    key={user.id}
                    className="tooltip tooltip-bottom w-48"
                >
                    <div className=" flex items-start items-justify flex-col bg-re-table-odd rounded-md py-4 pl-3 transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-105  duration-300 hover:bg-re-green-500 text-white hover:text-black">
                        <div className="font-thin text-lg tracking-wide leading-none">
                            {user.firstName + " " + user.lastName}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
