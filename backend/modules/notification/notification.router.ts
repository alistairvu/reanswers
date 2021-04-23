import express from "express"
import { getNotifications } from "./notification.controller"
import { protect } from "../../middlewares/auth.middleware"

const router = express.Router()

router.route("/").get(protect, getNotifications)

export default router
