"use client";
import { useState } from "react";
import { UserCompany } from "../../../utils/dashboard/dashboardUtils";
import AddUserForm from "./addUserForm";
import UserForm from "./userForm";

function Account({ user }: { user: UserCompany }) {
  // TODO(Suhana): Use either user or dynamicUser

  const [editing] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setDynamicUser] = useState<UserCompany>(user);

  return (
    <main className="w-full h-full flex bg-re-dark-green-500 overflow-auto justify-center items-center gap-6">
      <div className="bg-re-dark-green-300 border rounded-md border-re-gray-300 flex flex-col font-theinhardt text-white w-80">
        <div className="flex items-center p-4 justify-between">
          <div className="text-lg">Manage your Re profile</div>
          <button className="ml-4 py-1 px-4 bg-re-purple-500 rounded">
            {editing ? "Save" : "Edit"}
          </button>
        </div>
        <div className="bg-re-gray-300 h-px" />
        <div className="flex flex-col p-4">
          <UserForm user={user} setUser={setDynamicUser} />
        </div>
      </div>
      <div className="bg-re-dark-green-300 border rounded-md border-re-gray-300 flex flex-col font-theinhardt text-white w-80">
        <div className="p-4 text-lg">Add user to your team</div>
        <div className="bg-re-gray-300 h-px" />
        <AddUserForm user={user} />
      </div>
    </main>
  );
}

export default Account;
