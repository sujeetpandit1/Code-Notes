import multer, { MulterError } from "multer";
import { Request, Response, NextFunction } from "express";

const acceptedMimetypes: any = ["image/png", "image/jpg", "image/jpeg"];

const storage = multer.memoryStorage();
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callBack: multer.FileFilterCallback
) => {
  if (acceptedMimetypes.includes(file.mimetype)) {
    callBack(null, true);
  } else {
    callBack(new Error("Invalid file format. Allowed formats: PNG, JPG, JPEG"));
  }
};

export const upload = (req: Request, res: Response, next: NextFunction) => {
  try {
    multer({
      storage,
      fileFilter,
      limits: {
        files: 5,
        fileSize: 1024 * 1024 * 5, // Limit file size to 5 MB (adjust the size as needed)
      },
    }).array("images")(req, res, (error: any) => {
      if (error) {
        if (error instanceof MulterError) {
          res.status(400).json({
            status: "failed",
            message: error.message,
          });
        } else {
          // console.error(error)
          res.status(400).json({
            status: "failed",
            message: error.message,
          });
        }
      } else {
        next();
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
    });
  }
};
