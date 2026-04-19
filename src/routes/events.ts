import express from "express";
import { getEvents } from "../controllers/eventsController.ts";

const router = express.Router();

router.get("/", getEvents);

export default router;
