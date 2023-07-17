import NextAuth from "next-auth";
import { authOptions } from "@/server/auth";
import CredentialsProvider from "next-auth/providers/credentials";


export default NextAuth(authOptions);
