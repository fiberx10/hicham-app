import formidable from "formidable";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";

export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

const post = (req: NextApiRequest, res: NextApiResponse) => {
  const form = formidable({ multiples: false });

  form.parse(
    req,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    async function (_err, _fields: formidable.Fields, files: formidable.Files) {
      console.log("files : " + JSON.stringify(files));
      if (!files?.file) {
      }
      if (files?.file) {
        const file = saveFile(files?.file[0] as formidable.File);
        try {
          const { id: createdFileId } = await prisma.tempFile.create({
            data: {
              bucket: "temp",
              key: file?.name as string,
              size: file?.size as number,
              mimeType: file?.mimetype as string,
            },
          });
          console.log("created File Id : " + createdFileId);
          return res.status(200).json({
            fileId: createdFileId,
          });
        } catch (err) {
          console.log(err);
          return res.status(500).json(err);
        }
      } else {
        return res.status(400).json({
          error: "No file uploaded",
        });
      }
    }
  );
};

const saveFile = (file: formidable.File) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const data = fs.readFileSync(file.filepath);
    // generate a new random name for the file based on current time and original name of the file and random number
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
    const fileName = `${Date.now()}-${Math.random()}`;
    fs.writeFileSync(`./public/temp/${fileName}`, data);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    fs.unlinkSync(file.filepath);
    return {
      name: fileName,
      size: file.size,
      mimetype: file.mimetype,
    };
  } catch (err) {
    console.log(err);
    return;
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (req: NextApiRequest, res: NextApiResponse) => {
  req.method === "POST"
    ? post(req, res)
    : req.method === "PUT"
    ? console.log("PUT")
    : req.method === "DELETE"
    ? console.log("DELETE")
    : req.method === "GET"
    ? console.log("GET")
    : res.status(404).send("");
};
