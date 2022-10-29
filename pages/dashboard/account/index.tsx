import { Company, Role, User } from '@prisma/client'
import type { GetServerSideProps, NextPage } from 'next'
import { unstable_getServerSession } from 'next-auth'
import Head from 'next/head'
import Sidebar from '../../../components/dashboard/sidebar'
import prisma from '../../../constants/prisma'
import { authOptions } from '../../api/auth/[...nextauth]'
import UserForm from '../../../components/account/userForm'
import { useState } from 'react'
import { UserCompany } from '../../../utils/dashboard/dashboardUtils'

type AccountProps = {
  user: User & {
    company: Company
  }
}

const AccountHome: NextPage<AccountProps> = ({ user }) => {
  if (!user) {
    return (
      <Sidebar>
        <div className="w-screen h-screen bg-black flex">
          <Head>
            <title>Account</title>
            <meta name="locations" content="Manage your account" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <main className="flex flex-col container mx-auto h-full justify-evenly py-3 items-center">
            <div className="text-white font-theinhardt text-28">
              Coming Soon
            </div>
          </main>
        </div>
      </Sidebar>
    )
  }

  // TODO(Suhana): Use either user or dynamicUser
  const [dynamicUser, setDynamicUser] = useState<UserCompany>(user)

  return (
    <Sidebar>
      <div className="w-full h-screen bg-black flex overflow-auto">
        <Head>
          <title>Account</title>
          <meta name="account" content="Manage your account" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex flex-col container mx-auto py-6 text-white font-theinhardt px-6">
          <div className="flex w-full justify-between">
            <div className="flex flex-col font-theinhardt justify-center">
              <h1 className="text-3xl">Manage Your Account</h1>
              <h3 className="text-2xl font-theinhardt-300">{`${dynamicUser?.firstName} ${dynamicUser?.lastName} | ${dynamicUser?.company?.name}`}</h3>
            </div>
            {dynamicUser && dynamicUser.firstName === 'Phil' ? (
              <div className="avatar">
                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src="https://c.tenor.com/XyPwco6C7eoAAAAC/captain-marvel-agent-coulson.gif" />
                  {/* If the gif gets annoying: https://www.gamespot.com/a/uploads/scale_landscape/1578/15789737/3368618-coulson.jpg */}
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
            User Information
          </h1>
          <div className="h-px bg-white mb-2 w-full"></div>
          <UserForm user={dynamicUser} setUser={setDynamicUser} />
          {user.role === Role.ADMIN && (
            <div className="bg-re-gray-500 bg-opacity-70 rounded-2xl px-6 py-6 mt-10 w-full flex flex-col items-start">
              <h1 className="text-re-green-500 font-theinhardt text-2xl mb-2">
                Company Information
              </h1>
              {/* TODO(Suhana): Add Membership form here */}
              <div className="h-px bg-white mb-2 w-full"></div>
            </div>
          )}
          <div className="divider" />
        </main>
      </div>
    </Sidebar>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  )
  if (session) {
    const user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email ?? '',
      },
      include: {
        company: true,
      },
    })
    return {
      props: {
        user: JSON.parse(JSON.stringify(user!)),
      },
    }
  }
  return { props: {} }
}

export default AccountHome
