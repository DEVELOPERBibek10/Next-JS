"use server";

import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { constructFileUrl, getFileType, parseStringify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { getCurrentUser } from "./userActions";
import {
  DeleteFileProps,
  ExtendedUser,
  GetFilesProps,
  RenameFileProps,
  UpdateFileUsersProps,
  UploadFileProps,
} from "@/types";

export const uploadFile = async ({
  file,
  ownerId,
  accountId,
  path,
}: UploadFileProps) => {
  const { storage, database } = await createAdminClient();
  try {
    const inputFile = InputFile.fromBuffer(file, file.name);

    const bucketFile = await storage.createFile({
      bucketId: appwriteConfig.bucketId,
      fileId: ID.unique(),
      file: inputFile,
    });

    const fileDocumnet = {
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      type: getFileType(bucketFile.name).type,
      bucketFileId: bucketFile.$id,
      accountId: accountId,
      owner: ownerId,
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      users: [],
    };

    const newFile = await database
      .createRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.filesTableId,
        rowId: ID.unique(),
        data: fileDocumnet,
      })
      .catch(async (error: unknown) => {
        await storage.deleteFile({
          bucketId: appwriteConfig.bucketId,
          fileId: bucketFile.$id,
        });
        throw new Error(`Failed to create document - ${error}`);
      });

    revalidatePath(path);
    return parseStringify(newFile);
  } catch (error) {
    throw new Error(`Failed to upload file -${error}`);
  }
};

export const createQueries = async (
  currentUser: ExtendedUser,
  types: string[]
) => {
  const queries = [
    Query.or([
      Query.equal("owner", [currentUser.$id]),
      Query.contains("users", [currentUser.email]),
    ]),
  ];

  if (types.length > 0) queries.push(Query.equal("type", types));
  return queries;
};

export const getFiles = async ({ types = [] }: GetFilesProps) => {
  const { database } = await createAdminClient();
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found!");

    const queries = await createQueries(currentUser, types);

    const files = await database.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.filesTableId,
      queries,
    });
    if (!files) throw new Error("Problem while fetching files!");

    return files;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error(error as string);
  }
};

export const getUserDocument = async (ownerId: string) => {
  const { database } = await createAdminClient();
  try {
    const user = await database.getRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.usersTableId,
      rowId: ownerId,
    });
    if (!user) throw new Error(`Unable to find user with id: ${ownerId}`);
    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error(error as string);
  }
};

export const renameFile = async ({
  fileId,
  name,
  extension,
  path,
}: RenameFileProps) => {
  const { database } = await createAdminClient();

  try {
    const newName = `${name}.${extension}`;
    const updatedFile = await database.updateRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.filesTableId,
      rowId: fileId,
      data: {
        name: newName,
      },
    });
    if (!updatedFile) throw new Error("Updating file operation failed!");
    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error(error as string);
  }
};

export const updateFileUsers = async ({
  fileId,
  emails,
  path,
}: UpdateFileUsersProps) => {
  const { database } = await createAdminClient();

  try {
    const updatedFile = await database.updateRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.filesTableId,
      rowId: fileId,
      data: {
        users: emails,
      },
    });
    if (!updatedFile) throw new Error("Updating file operation failed!");
    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error(error as string);
  }
};

export const deleteFile = async ({
  fileId,
  bucketFileId,
  path,
}: DeleteFileProps) => {
  const { database, storage } = await createAdminClient();

  try {
    const deletedFile = await database.deleteRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.filesTableId,
      rowId: fileId,
    });
    if (!deletedFile) throw new Error("Deleting file operation failed!");
    await storage.deleteFile({
      bucketId: appwriteConfig.bucketId,
      fileId: bucketFileId,
    });
    revalidatePath(path);
    return parseStringify({ status: "success" });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error(error as string);
  }
};
