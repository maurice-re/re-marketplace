import React, { FormEvent, useState } from "react";
import { UserWithSettings } from "../../utils/tracking/trackingUtils";

export default function SettingsForm({
    user,
}: {
    user: UserWithSettings;
}) {

    const [borrowReturnBuffer, setBorrowReturnBuffer] = useState<number>(user?.company.settings.borrowReturnBuffer ?? 0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    console.log(user);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // setIsLoading(true);

        console.log("Got ", borrowReturnBuffer);
        console.log(borrowReturnBuffer);

        if (borrowReturnBuffer && borrowReturnBuffer > 0 && user) {
            console.log("POST to API");
            const res = await fetch("/api/tracking/update-settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    companyId: user.companyId,
                    borrowReturnBuffer: borrowReturnBuffer,
                }),
            });
            if (res.status != 200) {
                const { message } = await res.json();
                setMessage(message);
                setIsLoading(false);
                return;
            }
            console.log(res);
            // TODO(Suhana): Need to update this form field and the avg lifecycle calculation after this call updates successfully - getSettings client side in both places
            console.log("User after post");
            console.log(user);
            // if (user.company.settings.borrowReturnBuffer) {
            //     setBorrowReturnBuffer(user.company.settings.borrowReturnBuffer); // set to new buffer
            // }
        }
    };

    const handleChange = (borrowReturnBuffer: string) => {
        setBorrowReturnBuffer(parseInt(borrowReturnBuffer == "" ? "0" : borrowReturnBuffer));
    };

    return (
        <form
            id="settings-form"
            onSubmit={handleSubmit}
        >
            <div className="form-control w-full max-w-xs">
                <label className="label mt-2">
                    <span className="label-text">Borrow-Return Buffer</span>
                </label>
                <input type="text" placeholder="Borrow-Return Buffer" className="input input-bordered w-full max-w-xs" value={borrowReturnBuffer} onChange={(e) => handleChange(e.target.value)}
                />
                <label className="label">
                    <span className="label-text-alt">The minimum buffer (in days) between borrow and return to consider in the 'Avg Lifecycle' calculation.</span>
                </label>
            </div>
            <button
                disabled={

                    !user || !borrowReturnBuffer || borrowReturnBuffer === 0 || borrowReturnBuffer === user?.company.settings.borrowReturnBuffer
                }
                id="submit"
                className={`btn btn-accent btn-outline px-4 py-2 w-1/4 mt-4 mb-4 ${isLoading ? "loading" : ""}`}
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

