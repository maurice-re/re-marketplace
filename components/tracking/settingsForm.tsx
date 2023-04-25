import { Settings } from "@prisma/client";
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";

export default function SettingsForm({
  locationId,
  settings,
  setSettings,
}: {
  locationId: string;
  settings: Settings | null;
  setSettings: Dispatch<SetStateAction<Settings | null>>;
}) {
  const [changedBorrowReturnBuffer, setChangedBorrowReturnBuffer] =
    useState<boolean>(false);
  const [borrowReturnBuffer, setBorrowReturnBuffer] = useState<number>(0
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (settings) {
      setBorrowReturnBuffer(settings.borrowReturnBuffer ?? 0);
    }
  }, [settings]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (borrowReturnBuffer && borrowReturnBuffer > 0) {
      const res = await fetch("/api/tracking/edit-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locationId: locationId,
          borrowReturnBuffer: borrowReturnBuffer,
        }),
      });

      if (res.status != 200) {
        const { message } = await res.json();
        setMessage(message);
        return;
      } else {
        setChangedBorrowReturnBuffer(false);
      }

      const settingsRes = await fetch(
        `/api/tracking/get-settings?locationId=${settings?.locationId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      ).then(async (res) => await res.json());
      setSettings(settingsRes.settings as Settings);

      setIsLoading(false);
    }
  };

  const handleChange = (borrowReturnBuffer: string) => {
    setBorrowReturnBuffer(
      parseInt(borrowReturnBuffer == "" ? "0" : borrowReturnBuffer)
    );
    setChangedBorrowReturnBuffer(true);
  };

  return (
    <form id="settings-form" onSubmit={handleSubmit}>
      <div className="form-control w-full max-w-xs">
        <label className="label mt-2">
          <span className="label-text">Borrow-Return Buffer</span>
        </label>
        <input
          type="text"
          placeholder="Borrow-Return Buffer"
          className="input input-bordered w-full max-w-xs"
          value={borrowReturnBuffer}
          onChange={(e) => handleChange(e.target.value)}
        />
        <label className="label">
          <span className="label-text-alt">
            The minimum buffer (in days) between borrow and return to consider
            in the Avg Lifecycle calculation.
          </span>
        </label>
      </div>
      <button
        disabled={
          !borrowReturnBuffer ||
          borrowReturnBuffer === 0 ||
          !changedBorrowReturnBuffer
        }
        id="submit"
        className={`btn btn-accent btn-outline w-28 mt-4 ${isLoading ? "loading" : ""
          }`}
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
