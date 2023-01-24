"use client";

import { Location } from "@prisma/client";
import { FormEvent, useState } from "react";

export default function HardwareForm({
  locations,
  deviceId,
}: {
  locations: Location[];
  deviceId?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [deviceInfo, setDeviceInfo] = useState<Record<string, string>>({
    deviceId: deviceId ?? "",
    action: "borrow",
    locationId: locations[0].id,
    notes: "",
  });

  async function registerDevice(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    if (message) {
      setMessage("");
    }
    console.log(deviceInfo);
    const res = await fetch("/api/hardware", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: deviceInfo.action,
        deviceId: deviceInfo.deviceId,
        locationId: deviceInfo.locationId,
        notes: deviceInfo.notes,
      }),
    });
    const data = await res.json();
    if (data.error) {
      if (data.error.toString().contains("Unique constraint")) {
        setMessage("Device already registered.");
      } else {
        setMessage(
          "An error occurred: " + data.error + ". Please try again later."
        );
      }
    } else {
      setMessage("Device registered successfully!");
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col bg-re-dark-green-400 border-[0.5px] border-re-gray-500 rounded min-w-56 lg:w-1/4">
      <h1 className="mx-4 my-5 text-xl">Register Device</h1>
      <div className="h-0.5 w-full bg-re-gray-500"></div>
      <form
        className="flex flex-col mx-4 text-lg my-5"
        onSubmit={registerDevice}
      >
        <label className="text-re-gray-text mb-1">
          Device ID
          <input
            type={"text"}
            required
            className="rounded bg-re-black bg-opacity-[0.32] text-white w-full p-2 outline-[0.5px] outline-re-gray-500"
            value={deviceInfo["deviceId"]}
            onChange={(e) =>
              setDeviceInfo({ ...deviceInfo, deviceId: e.target.value })
            }
          ></input>
        </label>
        <label className="text-re-gray-text mb-1">
          Action
          <select
            className="rounded bg-re-black bg-opacity-[0.32] text-white w-full px-2 py-3 outline-[0.5px] outline-re-gray-500"
            value={deviceInfo["action"]}
            onChange={(e) =>
              setDeviceInfo({ ...deviceInfo, action: e.target.value })
            }
          >
            <option key={"borrow"} value={"borrow"}>
              Borrow
            </option>
            <option key={"return"} value={"return"}>
              Return
            </option>
          </select>
        </label>
        <label className="text-re-gray-text mb-1">
          Location
          <select
            className="rounded bg-re-black bg-opacity-[0.32] text-white w-full px-2 py-3 outline-[0.5px] outline-re-gray-500"
            value={deviceInfo["locationId"]}
            onChange={(e) =>
              setDeviceInfo({ ...deviceInfo, locationId: e.target.value })
            }
          >
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.displayName ?? location.city + " – " + location.line1}
              </option>
            ))}
          </select>
        </label>
        <label className="text-re-gray-text mb-1">
          Notes
          <input
            type={"text"}
            placeholder="e.g. In building 1, room 2"
            className="rounded bg-re-black bg-opacity-[0.32] text-white w-full p-2 outline-[0.5px] outline-re-gray-500"
            value={deviceInfo["notes"]}
            onChange={(e) =>
              setDeviceInfo({ ...deviceInfo, notes: e.target.value })
            }
          ></input>
        </label>
        <button
          className={`w-full bg-re-purple-500 text-white text-lg rounded py-1 mt-5 hover:bg-re-purple-600 active:bg-re-purple-500 btn ${
            loading ? "loading" : ""
          }`}
        >
          Register
        </button>
      </form>
      {message && (
        <div className="flex flex-col items-center justify-center">
          <p
            className={`text-lg mb-2 ${
              message.startsWith("An") ? "text-red-400" : "text-re-green-500"
            }`}
          >
            {message}
          </p>
        </div>
      )}
    </div>
  );
}
