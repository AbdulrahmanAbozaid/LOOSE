import multer from "multer";
import path from "path";
// import url from "url";

// const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

export default function () {
  var folder = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "uploads";
  var storage = multer.diskStorage({
    destination: function destination(req, file, cb) {
      cb(null, "src/".concat(folder, "/"));
    },
    filename: function filename(req, file, cb) {
      var uniqueSuffix = Date.now() + "-" + Math.trunc(Math.random() * 1e5);
      var extention = path.extname(file.originalname);
      cb(null, file.fieldname + "-" + uniqueSuffix + extention);
    }
  });
  return multer({
    storage: storage
  });
}