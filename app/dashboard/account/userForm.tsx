"use client";
import { User } from "@prisma/client";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { UserCompany } from "../../../utils/dashboard/dashboardUtils";

export default function UserForm({
  user,
  setUser,
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
        setInitialUser((prevState) => ({
          ...prevState,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
        }));
      }

      const userRes = await fetch(`/api/user/get-user?id=${user?.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then(async (res) => await res.json());
      setUser(userRes.user as UserCompany);

      setIsLoading(false);
    }
  };

  const handleNameChange = (name: string, isFirstName: boolean) => {
    if (isFirstName) {
      setNewUser((prevState) => ({
        ...prevState,
        firstName: name,
      }));
    } else {
      setNewUser((prevState) => ({
        ...prevState,
        lastName: name,
      }));
    }
  };

  return (
    <form id="account-form" onSubmit={handleSubmit} className="font-theinhardt">
      <div className="h-16 w-16 rounded-full bg-re-green-500 mb-3 flex items-center justify-center text-3xl text-black font-theinhardt">
        {user.firstName?.charAt(0).toUpperCase()}
      </div>
      <div className="form-control w-full">
        <label className="text-re-gray-text">First Name</label>
        <input
          type="text"
          placeholder="First Name"
          id="firstName"
          disabled
          className="w-full text-white bg-re-black bg-opacity-30 rounded-md p-2 mb-2"
          value={newUser.firstName ?? ""}
          onChange={(e) => handleNameChange(e.target.value, true)}
        />
        <label className="text-re-gray-text">Last Name</label>
        <input
          type="text"
          placeholder="Last Name"
          id="lastName"
          disabled
          className="w-full text-white bg-re-black bg-opacity-40 rounded-md p-2 mb-2"
          value={newUser.lastName ?? ""}
          onChange={(e) => handleNameChange(e.target.value, true)}
        />
        <label className="text-re-gray-text">E-mail</label>
        <input
          type="text"
          placeholder="email"
          id="email"
          disabled
          className="w-full text-white bg-re-black bg-opacity-30 rounded-md p-2"
          value={newUser.email ?? ""}
          onChange={(e) => handleNameChange(e.target.value, true)}
        />
      </div>
      {message && (
        <div
          id="settings-message"
          className="text-center text-re-green-500 mt-3"
        >
          {message}
        </div>
      )}
    </form>
  );
}
