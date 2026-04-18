import express from "express";
import { linkGithub } from "../controllers/usersController.ts";

const router = express.Router();

router.post("/link-github", linkGithub);

export default router;
