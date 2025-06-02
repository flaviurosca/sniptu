import express from "express";
import {
  createUrl,
  getAllUrls,
  redirectUrl,
  deleteUrl,
} from "../controllers/shortUrl.controller";

const router = express.Router();

router.post("/", createUrl);
router.get("/", getAllUrls);
router.get("/:shortUrl", redirectUrl);
router.delete("/:id", deleteUrl);

export default router;
