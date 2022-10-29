import React, { FormEvent, useState } from "react";
import { Settings } from '@prisma/client';

export default function SettingsForm({
    settings, setSettings
}: {
    settings: Settings;
    setSettings: any;
}) {
    const [initialBorrowReturnBuffer, setInitialBorrowReturnBuffer] = useState<number>(settings?.borrowReturnBuffer ?? 0);
    const [borrowReturnBuffer, setBorrowReturnBuffer] = useState<number>(settings?.borrowReturnBuffer ?? 0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        if (borrowReturnBuffer && borrowReturnBuffer > 0 && settings) {
            const res = await fetch("/api/tracking/update-settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    companyId: settings.companyId,
                    borrowReturnBuffer: borrowReturnBuffer,
                }),
            });
            if (res.status != 200) {
                const { message } = await res.json();
                setMessage(message);
                return;
            } else {
                setInitialBorrowReturnBuffer(borrowReturnBuffer);
            }

            const settingsRes = await fetch(
                `/api/tracking/get-settings?companyId=${settings?.companyId}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }
            ).then(async (res) => await res.json());
            setSettings(settingsRes.settings as Settings);

            setIsLoading(false);
        };
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
                    <span className="label-text-alt">The minimum buffer (in days) between borrow and return to consider in the Avg Lifecycle calculation.</span>
                </label>
            </div>
            <button
                disabled={
                    !settings || !borrowReturnBuffer || borrowReturnBuffer === 0 || borrowReturnBuffer === initialBorrowReturnBuffer
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

