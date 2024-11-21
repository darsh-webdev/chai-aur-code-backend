import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    // TODO: can add logic to chage the filename before uploading
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage,
});
