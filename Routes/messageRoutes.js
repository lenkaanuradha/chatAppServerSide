import express from "express";
const router = express.Router();
import { sendMessage,getMessage } from "../controllers/messages.js"
router.post('/sendMessage/:sender_id/:receiver_id',sendMessage)
router.get('/getMessage/:sender_id/:receiver_id',getMessage)
export default router;