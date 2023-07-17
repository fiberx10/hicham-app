import formidable from "formidable";
import type { NextApiRequest } from "next";

export const FormidableError = formidable.errors.FormidableError;

export const parseForm = async (
  req: NextApiRequest
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  return new Promise((resolve) => {
    resolve({
      files: {},
      fields: {},
    });
  });
};
