import { Request, Response, NextFunction } from "express"
import Notification from "./notification.model"

// GET /api/notifications
export const getNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const limit = Number(req.params.limit) || 10
    const skip = Number(req.params.skip) || 0

    const notifications = await Notification.find({ subscribers: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-subscribers")
    const notificationCount = await Notification.find({
      subscribers: req.user._id,
    }).countDocuments()

    res.send({
      success: 1,
      notifications: notifications,
      nextCursor: limit + skip,
      notificationCount: notificationCount,
    })
  } catch (err) {
    next(err)
  }
}
