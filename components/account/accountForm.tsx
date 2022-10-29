import React, { FormEvent, useState } from "react";
import { User } from '@prisma/client';

export default function AccountForm({
    user
}: {
    user: User;
}) {
    // TODO(Suhana): Allow submitting of form when any of the options are selected - create everything for admin first, and then add changes for user
    const [initialUser, setInitialUser] = useState<User>(user);
    const [firstName, setName] = useState<string>(user?.firstName ?? "");

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        // if (borrowReturnBuffer && borrowReturnBuffer > 0 && settings) {
        //     const res = await fetch("/api/tracking/update-settings", {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify({
        //             companyId: settings.companyId,
        //             borrowReturnBuffer: borrowReturnBuffer,
        //         }),
        //     });
        //     if (res.status != 200) {
        //         const { message } = await res.json();
        //         setMessage(message);
        //         return;
        //     } else {
        //         setInitialBorrowReturnBuffer(borrowReturnBuffer);
        //     }

        //     const settingsRes = await fetch(
        //         `/api/tracking/get-settings?companyId=${settings?.companyId}`,
        //         {
        //             method: "GET",
        //             headers: { "Content-Type": "application/json" },
        //         }
        //     ).then(async (res) => await res.json());
        //     setSettings(settingsRes.settings as Settings);

        setIsLoading(false);
        // };
    };

    const handleChange = (firstName: string) => {
        setName(firstName);
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
                <input type="text" placeholder="First Name" className="input input-bordered w-full max-w-xs" value={firstName} onChange={(e) => handleChange(e.target.value)}
                />
            </div>
            <button
                disabled={
                    !user || !firstName || firstName === "" || firstName === initialUser?.firstName
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

