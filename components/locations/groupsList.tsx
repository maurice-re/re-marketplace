import { User, Group } from "@prisma/client";
import Link from "next/link";

export default function GroupsList({ user, groups }: { user: User; groups: Group[]; }) {

    return (
        <div className="justify-center items-center flex w-full flex-col">
            <h1 className="pt-3 text-xl pb-4">Groups</h1>
            <h2 className="text-lg pb-4">This group has x locations, and you can view y.</h2>
            <div className="grid gap-2 overflow-x-auto w-full pr-1 items-start grid-flow-col">
                {groups.map((group, index) => (
                    <Link
                        key={index}
                        className="flex flex-col items-center mx-1 mb-2 max-w-24 h-16 bg-re-dark-green-100 border-lg rounded-lg hover:bg-re-dark-green-200"
                        href={{
                            pathname: "/group",
                            query: {
                                groupId: group.id,
                            },
                        }}>
                        <button
                            className={"w-full h-full leading-tight p-2 overflow-y-auto"}
                        >
                            {group.name}
                        </button>
                    </Link>
                ))}
            </div>
        </div>
    );
}
