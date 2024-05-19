import multer from "multer";
import path from "path";
export default function (folder = "uploads") {
    let storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `src/${folder}/`);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + "-" + Math.trunc(Math.random() * 1e5);
            const extention = path.extname(file.originalname);
            cb(null, file.fieldname + "-" + uniqueSuffix + extention);
        },
    });
    return multer({ storage });
}
