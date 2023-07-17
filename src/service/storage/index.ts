// upload file to local storage using multer middleware , multi files upload service

import * as fs from "fs";
import * as path from "path";

const storagePath = "public";

export const storage = {
  stream: async (
    writableStream: NodeJS.WritableStream,
    bucket: string,
    fileName: string
  ) => {
    try {
      const folder = path.join(storagePath, bucket);
      await fs.promises.access(folder);
      const filePath = path.join(folder, fileName);
      return fs.createReadStream(filePath).pipe(writableStream);
    } catch {
      throw new Error("This bucket doesnot exist");
    }
  },
  get: async (bucket: string, fileName: string) => {
    try {
      const folder = path.join(storagePath, bucket);
      await fs.promises.access(folder);
      const filePath = path.join(folder, fileName);
      return fs.promises.readFile(filePath, "utf8");
    } catch {
      throw new Error("This bucket doesnot exist");
    }
  },

  set: async (
    bucket: string,
    fileName: string,
    body: string | NodeJS.ArrayBufferView
  ) => {
    try {
      const folder = path.join(storagePath, bucket);
      try {
        await fs.promises.access(folder);
      } catch {
        await fs.promises.mkdir(folder, { recursive: true });
      }

      const filePath = path.join(folder, fileName);
      await fs.promises.writeFile(filePath, body);
    } catch (e) {
      throw new Error("Failed to save file" + e.message);
    }
  },
  createFromTemp: async (
    tempBucket: string,
    tempfileName: string,
    bucket: string,
    fileName: string
  ) => {
    try {
      const tempFolder = path.join(storagePath, tempBucket);
      await fs.promises.access(tempFolder);
      const tempFilePath = path.join(tempFolder, tempfileName);

      const folder = path.join(storagePath, bucket);
      await fs.promises.access(folder);
      const filePath = path.join(folder, fileName);

      await fs.promises.copyFile(tempFilePath, filePath);
      await fs.promises.rm(tempFilePath);
    } catch (e) {
      throw new Error("Failed to create file" + e.message);
    }
  },
  delete: async (bucket: string, fileName: string) => {
    try {
      const folder = path.join(storagePath, bucket);
      await fs.promises.access(folder);
      const filePath = path.join(folder, fileName);
      await fs.promises.rm(filePath);
    } catch (e) {
      throw new Error("Failed to delete file" + e.message);
    }
  },
};
