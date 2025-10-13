"use server";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { parseStringify } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ID, Query } from "node-appwrite";

export const getUserByEmail = async (email: string) => {
  const { database } = await createAdminClient();
  try {
    const result = await database.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.usersTableId,
      queries: [Query.equal("email", [email])],
    });
    if (!result.total) {
      throw new Error("Something went wrong while fetching users");
    }
    return result.rows[0];
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return null;
    }
    return null;
  }
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();
  try {
    const session = await account.createEmailToken({
      userId: ID.unique(),
      email: email,
    });

    if (!session) {
      throw new Error("Failed to send email OTP");
    }
    return session.userId;
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    }
    throw error;
  }
};

export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  const existingUser = await getUserByEmail(email);

  const accountId = await sendEmailOTP({ email });

  if (!accountId) throw new Error("Failed to send email OTP");

  if (!existingUser) {
    const { database } = await createAdminClient();

    await database.createRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.usersTableId,
      rowId: ID.unique(),
      data: {
        fullName,
        email,
        avatar: "https://cdn-icons-png.flaticon.com/128/3177/3177440.png",
        accountId,
      },
    });
  }

  return parseStringify({ accountId });
};

export const verifyOTP = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createSession({
      userId: accountId,
      secret: password,
    });

    if (!session) {
      throw new Error("Failed to create session");
    }

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    }
    throw error;
  }
};

export const getCurrentUser = async () => {
  const client = await createSessionClient();
  if (!client) return null;
  const { database, account } = client;

  const currentSession = await account.get();

  const user = await database.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.usersTableId,
    queries: [Query.equal("accountId", currentSession.$id)],
  });

  if (!user.total || !currentSession) return null;

  return parseStringify(user.rows[0]);
};

export const signOutUser = async () => {
  const client = await createSessionClient();
  if (!client) return null;
  const { account } = client;

  try {
    await account.deleteSession({
      sessionId: "current",
    });
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    throw new Error(error as string);
  } finally {
    redirect("/sign-in");
  }
};

export const signInUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      await sendEmailOTP({ email });
      return parseStringify({ accountId: existingUser.accountId });
    }
    return parseStringify({ accountId: null, error: "User not found" });
  } catch {
    throw new Error(`Failed to sign in user`);
  }
};
