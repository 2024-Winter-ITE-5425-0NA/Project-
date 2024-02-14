import { NextApiRequest, NextApiResponse } from 'next';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { UserInfo } from '@/models/UserInfo';
import { User } from '@/models/User';
import NextAuth, { GetServerSideProps, NextAuthOptions, getSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import clientPromise from '@/libs/mongoConnect';

type Credentials = {
  email: string;
  password: string;
};

const authOptions: NextAuthOptions = {
  secret: process.env.SECRET!,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      id: 'credentials',
      credentials: {
        username: { label: 'Email', type: 'email', placeholder: 'test@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: Credentials) {
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

export const isAdmin: GetServerSideProps<boolean> = async (context) => {
  const session = await getServerSession(context);
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return false;
  }
  const userInfo = await UserInfo.findOne({ email: userEmail });
  if (!userInfo) {
    return false;
  }
  return userInfo.admin;
};

const handler = NextAuth<NextApiRequest, NextApiResponse>(authOptions);

export default handler;

async function getServerSession(context: { req: NextApiRequest }) {
  // Retrieve the session from the request context
  const session = await getSession(context);
  return session;
}
