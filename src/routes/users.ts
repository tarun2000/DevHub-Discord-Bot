import express from "express";
import { linkGithub, getUsers } from "../controllers/usersController.ts";

const router = express.Router();

router.post("/link-github", linkGithub);
router.get("/", getUsers);

export default router;
