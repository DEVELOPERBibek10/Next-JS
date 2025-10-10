"use server";
import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { parseStringify } from "@/lib/utils";
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

export const handleError = (error: unknown, message: string) => {
  console.log(error, message);
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
