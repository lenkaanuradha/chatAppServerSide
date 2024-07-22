import express from "express";
import { createUser, loginUser } from "../controllers/authentication.js";
import User from "../models/User.js";
import { body } from "express-validator";
import multer from "multer";
import path from "path";

const router = express.Router();

router.get("/", async (req, res) => {
  res.send("auth endpoint here!");
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/Images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

router.post(
  "/register", upload.single("file"),
  [
    body("useremail")
      .isEmail().withMessage("Enter a valid email!")
      .custom(async (value) => {
        const user = await User.findOne({ useremail: value });
        if (user) {
          throw new Error("Email already in use!");
        }
      }),
    body("username").notEmpty().withMessage("Username is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
  ],
 createUser);

router.post("/login", [body("useremail").isEmail().withMessage("Enter a valid email")], loginUser);

export default router;
