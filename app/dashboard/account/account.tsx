"use client";
import { Role } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import { UserCompany } from "../../../utils/dashboard/dashboardUtils";
import AddUserForm from "./addUserForm";
import UserForm from "./userForm";

function Account({ user }: { user: UserCompany; }) {
  // TODO(Suhana): Use either user or dynamicUser

  const [dynamicUser, setDynamicUser] = useState<UserCompany>(user);

  if (!dynamicUser) {
    return (
      <div className="w-screen h-screen bg-black flex">
        <main className="flex flex-col container mx-auto h-full justify-evenly py-3 items-center">
          <div className="text-white font-theinhardt text-28">Coming Soon</div>
        </main>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-black flex overflow-auto">
      <main className="flex flex-col container mx-auto py-6 text-white font-theinhardt px-6">
        <div className="flex w-full justify-between">
          <div className="flex flex-col font-theinhardt justify-center">
            <h1 className="text-3xl">Manage Your Account</h1>
            <h3 className="text-2xl font-theinhardt-300">{`${dynamicUser?.firstName} ${dynamicUser?.lastName} | ${dynamicUser?.company?.name}`}</h3>
          </div>
          {dynamicUser && dynamicUser.companyId === "616" ? (
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <Image
                  src={"/images/philprofilepic.jpeg"}
                  alt="Phil Coulson Profile Picture"
                  height={500}
                  width={500}
                />
              </div>
            </div>
          ) : (
            <div className="avatar placeholder">
              <div className="bg-re-green-500 text-black rounded-full w-24">
                <span className="text-3xl">
                  {dynamicUser.firstName?.charAt(0)}
                </span>
              </div>
            </div>
          )}
        </div>
        <h1 className="text-re-green-500 font-theinhardt text-2xl mb-2 mt-6">
          Account Information
        </h1>
        <div className="h-px bg-white mb-2 w-full"></div>
        <UserForm user={dynamicUser} setUser={setDynamicUser} />
        {user.role === Role.ADMIN && (
          <div className="bg-re-gray-500 bg-opacity-70 rounded-2xl px-6 py-8 mt-10 w-full flex flex-col items-start">
            <h1 className="text-re-green-500 font-theinhardt text-2xl mb-2">
              Add New User
            </h1>
            <div className="h-px bg-white mb-2 w-full"></div>
            <div className="w-1/3 pt-3">
              <AddUserForm user={dynamicUser} />
            </div>
            <div className="w-2/3"></div>
          </div>
        )}
        <div className="divider" />
      </main>
    </div>
  );
}

export default Account;
