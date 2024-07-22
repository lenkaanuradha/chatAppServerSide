import express from "express";
const router = express.Router()
import { getallFriends } from "../controllers/users.js";
router.get('/getallfriends/:loginuser_id',getallFriends)
export default router;