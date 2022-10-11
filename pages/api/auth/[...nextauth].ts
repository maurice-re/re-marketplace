import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import prisma from "../../../constants/prisma";


export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log(`url: ${url}`);
      console.log(`base: ${baseUrl}`);
      if (url.includes("/product-dev")) {
        return url;
      }
      return `${baseUrl}`
    },
    async session({ session, user, token}) {
      session.user = user;
      return session
    },
  },
  providers: [
    EmailProvider({
        server: process.env.EMAIL_SERVER,
        from: process.env.EMAIL_FROM,
    })
  ],
  secret: process.env.NEXTAUTH_SECRET ?? "DMWYcJdU5UuNga6XvRw85gUtd6Ov2XsfEwTwh+ql7nM=",
  theme: {
      colorScheme: "dark" 
  }
}

export default NextAuth(authOptions)