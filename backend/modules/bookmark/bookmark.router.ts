import express from "express"
import { protect } from "../../middlewares/auth.middleware"
import { handleBookmark } from "./bookmark.controller"

const router = express.Router()

router.route("/").post(protect, handleBookmark)

export default router
