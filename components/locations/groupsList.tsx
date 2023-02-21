import { User, Group } from "@prisma/client";
import Link from "next/link";
import { BiX } from "react-icons/bi";

export default function GroupsList({ user, groups }: { user: User; groups: Group[]; }) {
    const handleDelete = async (groupId: string) => {
        console.log("Using user ID", user.id);
        const res = await fetch(`/api/groups/group?userId=${user.id}&groupId=${groupId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });
        const { message } = await res.json();
        if (res.status != 200) {
            console.log("Delete group error: ", message);
        } else {
            console.log("Delete group success: ", message);
        }
    };

    return user && (
        <div className="justify-center items-center flex w-full flex-col">
            <h1 className="pt-3 text-xl pb-4">Groups</h1>
            <h2 className="text-lg pb-4">Groups you are a member of.</h2>
            <div className="grid gap-2 overflow-x-auto w-full pr-1 items-start grid-flow-col">
                {groups.map((group, index) => (
                    <div key={index} className="flex flex-col max-w-24 h-20 border-re-dark-green-100 border-2 text-white rounded-lg bg-re-dark-green-200">
                        <div className="flex justify-end mr-2 mt-2 text-xl">
                            <BiX
                                size={25}
                                className="self-end cursor-pointer text-white hover:text-red-600"
                                onClick={() => handleDelete(group.id)}
                            />
                        </div>
                        <Link
                            className="justify-center leading-none items-center flex"
                            href={{
                                pathname: "/group",
                                query: {
                                    groupId: group.id,
                                },
                            }}>
                            <button
                                className={"pb-8 hover:text-re-green-500"}
                            >
                                {group.name}
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
