import { Role } from "@prisma/client";
import { ChangeEvent, FormEvent, useState } from "react";
import { UserCompany } from "../../utils/dashboard/dashboardUtils";

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
  const [newUser, setNewUser] = useState<NewUser>({
    email: "",
    firstName: "",
    lastName: "",
    role: Role.USER,
    companyId: user.companyId,
    newCompanyName: "",
    newCompanyCustomerId: "",
  });
  const [errorUser, setErrorUser] = useState<NewUser>();
  const [successUser, setSuccessUser] = useState<NewUser>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("Got newUser");
    console.log(newUser);
    console.log("Using ", user.companyId);

    if (
      user &&
      newUser &&
      newUser.firstName &&
      newUser.lastName &&
      newUser.email &&
      newUser.role
    ) {
      const res = await fetch("/api/user/create-peer-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: user.companyId, // newUser.companyId for adding user to diff company
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          role: newUser.role,
          newCompanyName: "", // newUser.newCompanyName for adding user to diff company
          newCompanyCustomerId: "", // newUser.newCompanyCustomerId for adding user to diff company
        }),
      });
      if (res.status != 200) {
        setErrorUser(newUser);
      } else {
        setSuccessUser(newUser);
      }
      const { message } = await res.json();
      setMessage(message);

      setIsLoading(false);
    }
  };

  const handleEmailChange = (email: string) => {
    setNewUser((prevState) => ({
      ...prevState,
      email: email,
    }));
  };

  const handleFirstNameChange = (firstName: string) => {
    setNewUser((prevState) => ({
      ...prevState,
      firstName: firstName,
    }));
  };

  const handleLastNameChange = (lastName: string) => {
    setNewUser((prevState) => ({
      ...prevState,
      lastName: lastName,
    }));
  };

  // const handleNewCompanyNameChange = (newCompanyName: string) => {
  //   setNewUser((prevState) => ({
  //     ...prevState,
  //     newCompanyName: newCompanyName,
  //     companyId: newCompanyName === '' ? user.companyId : '',
  //   }));
  // };

  const handleRoleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setNewUser((prevState) => ({
      ...prevState,
      role: event.target.value === "ADMIN" ? Role.ADMIN : Role.USER,
    }));
  };
  return (
    <form id="account-form" onSubmit={handleSubmit}>
      <div className="form-control w-full max-w-sm">
        <label className="label mt-1">
          <span className="label-text">First Name</span>
        </label>
        <input
          required
          type="text"
          placeholder="First Name"
          id="firstName"
          className="input input-bordered w-full max-w-sm"
          value={newUser.firstName ?? ""}
          onChange={(e) => handleFirstNameChange(e.target.value)}
        />
      </div>
      <div className="form-control w-full max-w-sm">
        <label className="label mt-1">
          <span className="label-text">Last Name</span>
        </label>
        <input
          required
          type="text"
          placeholder="Last Name"
          id="lastName"
          className="input input-bordered w-full max-w-sm"
          value={newUser.lastName ?? ""}
          onChange={(e) => handleLastNameChange(e.target.value)}
        />
      </div>
      <div className="form-control w-full max-w-sm">
        <label className="label mt-1">
          <span className="label-text">Email</span>
        </label>
        <input
          required
          type="text"
          placeholder="Email"
          id="email"
          className="input input-bordered w-full max-w-sm"
          value={newUser.email ?? ""}
          onChange={(e) => handleEmailChange(e.target.value)}
        />
      </div>
      <div className="form-control w-full max-w-sm">
        <label className="label mt-1">
          <span className="label-text">Role</span>
        </label>
        <select
          className="select w-full max-w-sm"
          value={newUser.role}
          onChange={handleRoleChange}
        >
          <option key={Role.ADMIN} value={Role.ADMIN}>
            Admin
          </option>
          <option key={Role.USER} value={Role.USER}>
            User
          </option>
        </select>
      </div>
      {/* Uncomment the below for adding user to diff company */}
      {/* <div className="form-control w-full max-w-sm">
        <label className="label mt-1">
          <span className="label-text">Company Name</span>
        </label>
        <input
          type="text"
          placeholder="Company Name"
          id="newCompanyName"
          className="input input-bordered w-full max-w-sm"
          value={newUser.newCompanyName}
          onChange={(e) => handleNewCompanyNameChange(e.target.value)}
        />
        <label className="label">
          <span className="label-text-alt">
            Only required if you want to create an account for someone in a
            separate partner company - not {user.company.name}
          </span>
        </label>
      </div> */}
      <button
        disabled={
          !user ||
          !newUser?.firstName ||
          !newUser?.lastName ||
          !newUser?.email ||
          newUser === errorUser ||
          newUser === successUser
        }
        id="submit"
        className={`btn btn-accent btn-outline w-28 mt-5 ${
          isLoading ? "loading" : ""
        }`}
      >
        Create
      </button>
      {message && (errorUser === newUser || successUser === newUser) && (
        <div
          id="error-message"
          className={`font-theinhardt text-left mt-4 ${
            errorUser === newUser ? "text-error" : "text-re-green-500"
          }`}
        >
          {message}
        </div>
      )}
    </form>
  );
}
