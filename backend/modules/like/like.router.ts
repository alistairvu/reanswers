import express from "express";
import { protect } from "../../middlewares/auth.middleware"
import { handleLike } from './like.controller'

const router = express.Router();

router.route('/').post(protect, handleLike)

export default router