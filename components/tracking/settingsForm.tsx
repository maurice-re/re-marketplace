import React, { FormEvent, useState } from "react";
import { UserWithSettings } from "../../utils/tracking/trackingUtils";

export default function SettingsForm({
    user,
}: {
    user: UserWithSettings;
}) {

    console.log(user);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Clicked submit");
    };

    return (
        <form
            id="settings-form"
            onSubmit={handleSubmit}
        >
            <div className="form-control w-full max-w-xs">
                <label className="label">
                    <span className="label-text">What is your name?</span>
                    <span className="label-text-alt">Alt label</span>
                </label>
                <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                <label className="label">
                    <span className="label-text-alt">Alt label</span>
                    <span className="label-text-alt">Alt label</span>
                </label>
            </div>
        </form>
    );
}

