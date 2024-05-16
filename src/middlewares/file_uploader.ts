import multer from "multer";
import path from "path";
import { Request } from "express";
// import url from "url";

// const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

export default function (folder = "uploads") {
  let storage = multer.diskStorage({
    destination: (req: Request, file: any, cb: Function) => {
      cb(null, `src/${folder}/`);
    },
    filename: (req: Request, file: any, cb: Function) => {
      const uniqueSuffix = Date.now() + "-" + Math.trunc(Math.random() * 1e5);
      const extention = path.extname(file.originalname);
      cb(null, file.fieldname + "-" + uniqueSuffix + extention);
    },
  });

  return multer({ storage });
}
