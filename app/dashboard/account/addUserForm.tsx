"use client";
import { Role } from "@prisma/client";
import { FormEvent, useState } from "react";
import { UserCompany } from "../../../utils/dashboard/dashboardUtils";

type NewUser = {
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  companyId: string;
  newCompanyName: string;
  newCompanyCustomerId: string;
};

export default function AddUserForm({ user }: { user: UserCompany }) {
  const [form, setForm] = useState<Record<string, string | Role>>({
    role: Role.USER,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("Got newUser");
    console.log("Using ", user.companyId);

    if (user) {
      const res = await fetch("/api/user/create-peer-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form["email"],
          role: form["role"],
        }),
      });
      const { message } = await res.json();
      setMessage(message);

      setIsLoading(false);
    }
  };

  return (
    <form id="account-form" onSubmit={handleSubmit}>
      <div className="form-control w-full p-4">
        <label className="text-re-gray-text">Email</label>
        <input
          type="text"
          placeholder="Email"
          id="email"
          className="w-full text-white bg-re-black bg-opacity-30 rounded-md p-2 mb-2"
          value={form["email"] ?? ""}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <label className="text-re-gray-text">Role</label>
        <select
          id="role"
          className="w-full text-white bg-re-black bg-opacity-30 rounded-md p-2 mb-2"
          value={form["role"] ?? ""}
          onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
        >
          <option value={Role.USER} key={Role.USER}>
            User
          </option>
          <option value={Role.ADMIN} key={Role.ADMIN}>
            Admin
          </option>
        </select>

        <button
          disabled={!user}
          id="submit"
          className="w-full bg-re-purple-500 text-white text-lg rounded-md p-2 mt-4"
        >
          Invite
        </button>
        {message && (
          <div id="error-message" className={`font-theinhardt text-left mt-4`}>
            {message}
          </div>
        )}
      </div>
    </form>
  );
}
