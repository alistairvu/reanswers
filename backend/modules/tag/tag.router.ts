import express from "express"
import { getTopTags } from "./tag.controller"
import { protect } from "../../middlewares/auth.middleware"

const router = express.Router()

router.route("/top").get(getTopTags)

export default router
