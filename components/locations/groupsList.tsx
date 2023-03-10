import { User, Group } from "@prisma/client";
import Link from "next/link";
import { BiX } from "react-icons/bi";

export default function GroupsList({ user, createdGroups, memberGroups }: { user: User; createdGroups: Group[]; memberGroups: Group[]; }) {
    const handleDelete = async (groupId: string) => {
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

    const createdGroup = (groupId: string): boolean => {
        return createdGroups.some(g => g.id === groupId);
    };

    return user && (
        <div className="justify-center items-center flex w-full flex-col">
            <h1 className="pt-3 text-xl pb-1">Groups</h1>
            <h2 className="leading-none text-lg pb-2">Groups you are a member of.</h2>
            <div className="flex text-sm gap-1 items-center justify-center">
                <h3>Click</h3>
                <BiX
                    size={18}
                    className="text-white hover:text-red-600"
                />
                <h3>to delete groups created by you.</h3>
            </div>
            <div className="pt-4 grid gap-2 overflow-x-auto w-full pr-1 items-start grid-flow-col">
                {memberGroups.map((group, index) => (
                    <div key={index} className={`flex flex-col max-w-24 h-20 border-re-dark-green-100 border-2 text-white rounded-lg ${createdGroup(group.id) ? "bg-re-dark-green-100" : "bg-re-dark-green-200"}`}>
                        {createdGroup(group.id) && (
                            <div className="flex justify-end mr-1 mt-1 text-xl">
                                <div className="tooltip tooltip-left" data-tip="Delete">
                                    <BiX
                                        size={25}
                                        className="self-end cursor-pointer text-white hover:text-red-600"
                                        onClick={() => handleDelete(group.id)}
                                    />
                                </div>
                            </div>)}
                        <Link
                            className={`${!createdGroup(group.id) && "my-auto"} justify-center leading-none items-center flex`}
                            href={{
                                pathname: "/group",
                                query: {
                                    groupId: group.id,
                                },
                            }}>
                            <button
                                className={"hover:text-re-green-500"}
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
