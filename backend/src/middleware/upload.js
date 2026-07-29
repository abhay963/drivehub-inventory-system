import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// ================= CLOUDINARY STORAGE =================

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => ({
    folder: "car-dealership/vehicles",
    resource_type: "image",

    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "webp",
    ],

    public_id: `vehicle-${Date.now()}`,
  }),
});

// ================= FILE FILTER =================

const fileFilter = (req, file, cb) => {
  const allowed = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PNG, JPEG, JPG, WEBP files are allowed."
      )
    );
  }
};

// ================= MULTER =================

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;
