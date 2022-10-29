import React, { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { User } from '@prisma/client';
import { UserCompany } from "../../utils/dashboard/dashboardUtils";

export default function AccountForm({
    user, setUser
}: {
    user: User;
    setUser: Dispatch<SetStateAction<UserCompany>>;
}) {
    // TODO(Suhana): Allow submitting of form when any of the options are selected - create everything for admin first, and then add changes for user - add check for admin
    const [initialUser, setInitialUser] = useState<User>(user);
    const [newUser, setNewUser] = useState<User>(user);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        // const formElements = (e.target as any).elements as HTMLInputElement[];
        // // let formElements: string[] = [];
        // for (let i = 0; i < formElements.length - 1; i++) {
        //     // formElements.push(formElements[i].value);
        //     console.log(formElements[i]);
        // }

        console.log("Got newUser");
        console.log(newUser);

        // console.log(newUser);

        if (newUser && newUser.firstName && newUser.lastName && newUser.id) {
            const res = await fetch("/api/user/edit-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: newUser.id,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                }),
            });
            if (res.status != 200) {
                const { message } = await res.json();
                setMessage(message);
                return;
            } else {
                setInitialUser(prevState => ({
                    ...prevState,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                }));
            }

            // TODO(Suhana): Implement upstream data update
            const userRes = await fetch(
                `/api/user/get-user?id=${user?.id}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }
            ).then(async (res) => await res.json());
            setUser(userRes.user as UserCompany);

            setIsLoading(false);
        };
    };

    const handleNameChange = (name: string, isFirstName: boolean) => {
        if (isFirstName) {
            setNewUser(prevState => ({
                ...prevState,
                firstName: name,
            }));
        } else {
            setNewUser(prevState => ({
                ...prevState,
                lastName: name,
            }));
        }
    };


    return (
        <form
            id="account-form"
            onSubmit={handleSubmit}
        >
            <div className="form-control w-full max-w-xs">
                <label className="label mt-2">
                    <span className="label-text">First Name</span>
                </label>
                <input type="text" placeholder="First Name" id="firstName" className="input input-bordered w-full max-w-xs" value={newUser.firstName ?? ""} onChange={(e) => handleNameChange(e.target.value, true)}
                />
            </div>
            <div className="form-control w-full max-w-xs">
                <label className="label mt-2">
                    <span className="label-text">First Name</span>
                </label>
                <input type="text" placeholder="First Name" id="lastName" className="input input-bordered w-full max-w-xs" value={newUser.lastName ?? ""} onChange={(e) => handleNameChange(e.target.value, false)}
                />
            </div>
            <button
                disabled={
                    !user || !newUser?.firstName || !newUser?.lastName || (newUser?.firstName === initialUser?.firstName && newUser?.lastName === initialUser?.lastName)
                }
                id="submit"
                className={`btn btn-accent btn-outline w-28 mt-4 ${isLoading ? "loading" : ""}`}
            >
                Update
            </button>
            {message && (
                <div
                    id="settings-message"
                    className="font-theinhardt text-error text-center"
                >
                    {message}
                </div>
            )}
        </form>
    );
}

