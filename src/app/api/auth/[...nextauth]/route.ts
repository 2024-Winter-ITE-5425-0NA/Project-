import { NextApiRequest, NextApiResponse } from 'next';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { UserInfo } from '@/models/UserInfo';
import { User } from '@/models/User';
import NextAuth, { NextAuthOptions } from 'next-auth';
import {getServerSession} from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import clientPromise from '@/lib/database';

export const authOptions: NextAuthOptions = {
  secret: process.env.SECRET!,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      id: 'credentials',
      credentials: {
        username: { label: 'Email', type: 'email', placeholder: 'test@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: Record<string, string> | undefined, req) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null; // Returning null if credentials are missing or incomplete
        }
        const { email, password } = credentials;

        await mongoose.connect(process.env.MONGO_URL!);
        const user = await User.findOne({ email });
        const passwordOk = user && bcrypt.compareSync(password, user.password);

        if (passwordOk) {
          return user;
        }

        return null;
      },
    }),
  ],
};

export async function isAdmin() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return false;
  }
  const userInfo = await UserInfo.findOne({email:userEmail});
  if (!userInfo) {
    return false;
  }
  return userInfo.admin;
} 

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }