import React, {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from 'react'
import { Role, User } from '@prisma/client'
import { UserCompany } from '../../utils/dashboard/dashboardUtils'
import e from 'express'

type NewUser = {
  email: string
  firstName: string
  lastName: string
  role: Role
}

export default function AddUserForm({ user }: { user: User }) {
  // TODO(Suhana): Allow submitting of form when any of the options are selected - create everything for admin first, and then add changes for user - add check for admin
  const [newUser, setNewUser] = useState<NewUser>({
    email: '',
    firstName: '',
    lastName: '',
    role: Role.USER,
  })
  const [errorUser, setErrorUser] = useState<NewUser>()
  const [successUser, setSuccessUser] = useState<NewUser>()

  // id            String    @id @default(cuid())
  // accounts      Account[]
  // company       Company   @relation(fields: [companyId], references: [id])
  // companyId     String
  // createdAt     DateTime
  // email         String    @unique()
  // emailVerified DateTime?
  // firstName     String?
  // lastName      String?
  // manufacturer  Boolean   @default(false)
  // orders        Order[]
  // reEmployee    Boolean   @default(false)
  // role          Role
  // sessions      Session[]

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    console.log('Got newUser')
    console.log(newUser)
    console.log(user)

    // console.log(newUser);

    if (
      newUser &&
      newUser.firstName &&
      newUser.lastName &&
      newUser.email &&
      newUser.role
    ) {
      // TODO(Suhana): Add response message (whether successful or not); if error, save the current newUser as "erroredUser"
      // and don't enable submit (i.e. don't remove isError) until the new user differs from the errored one; and if success,
      // save the current newUser as "successUser" and don't enable submit until the new user differs from the success one
      // TODO(Suhana): Change validation to field-by-field - get UX input

      // const res = await fetch('/api/user/edit-user', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     id: newUser.id,
      //     firstName: newUser.firstName,
      //     lastName: newUser.lastName,
      //   }),
      // })
      // if (res.status != 200) {
      //   const { message } = await res.json()
      //   setMessage(message)
      //   return
      // } else {
      //   setInitialUser((prevState) => ({
      //     ...prevState,
      //     firstName: newUser.firstName,
      //     lastName: newUser.lastName,
      //   }))
      // }

      // const userRes = await fetch(`/api/user/get-user?id=${user?.id}`, {
      //   method: 'GET',
      //   headers: { 'Content-Type': 'application/json' },
      // }).then(async (res) => await res.json())
      // setUser(userRes.user as UserCompany)

      setIsLoading(false)
    }
  }

  const handleChange = (email: string, firstName: string, lastName: string) => {
    /* Pass input value as email, firstName, lastName, with '' for unchanged values */
    if (email !== '') {
      setNewUser((prevState) => ({
        ...prevState,
        email: email,
      }))
    }
    if (firstName !== '') {
      setNewUser((prevState) => ({
        ...prevState,
        firstName: firstName,
      }))
    }
    if (lastName !== '') {
      setNewUser((prevState) => ({
        ...prevState,
        lastName: lastName,
      }))
    }
  }

  const handleRoleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setNewUser((prevState) => ({
      ...prevState,
      role: event.target.value === 'ADMIN' ? Role.ADMIN : Role.USER,
    }))
  }
  return (
    <form id="account-form" onSubmit={handleSubmit}>
      <div className="form-control w-full max-w-sm">
        <label className="label mt-1">
          <span className="label-text">First Name</span>
        </label>
        <input
          type="text"
          placeholder="First Name"
          id="firstName"
          className="input input-bordered w-full max-w-sm"
          value={newUser.firstName ?? ''}
          onChange={(e) => handleChange('', e.target.value, '')}
        />
      </div>
      <div className="form-control w-full max-w-sm">
        <label className="label mt-1">
          <span className="label-text">Last Name</span>
        </label>
        <input
          type="text"
          placeholder="Last Name"
          id="lastName"
          className="input input-bordered w-full max-w-sm"
          value={newUser.lastName ?? ''}
          onChange={(e) => handleChange('', '', e.target.value)}
        />
      </div>
      <div className="form-control w-full max-w-sm">
        <label className="label mt-1">
          <span className="label-text">Email</span>
        </label>
        <input
          type="text"
          placeholder="Email"
          id="email"
          className="input input-bordered w-full max-w-sm"
          value={newUser.email ?? ''}
          onChange={(e) => handleChange(e.target.value, '', '')}
        />
      </div>
      <div className="form-control w-full max-w-sm">
        <label className="label mt-1">
          <span className="label-text">Role</span>
        </label>
        <select
          className="select w-full max-w-xs"
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
        className={`btn btn-accent btn-outline w-28 mt-6 ${
          isLoading ? 'loading' : ''
        }`}
      >
        Create
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
  )
}
