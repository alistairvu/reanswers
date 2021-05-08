import { Router } from "express"
import { getUserInfo, updateUserInfo } from "./user.controller"
import { protect } from "../../middlewares/auth.middleware"

const userRouter = Router()

userRouter.route("/:id").get(getUserInfo).put(protect, updateUserInfo)

export default userRouter
