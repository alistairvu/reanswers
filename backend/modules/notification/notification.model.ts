import mongoose from "mongoose"

interface NotificationSchemaInterface extends mongoose.Document {
  title: string
  body: string
  link: string
  subscribers: mongoose.Types.ObjectId[]
}

const NotificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    subscribers: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: "user",
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<NotificationSchemaInterface>(
  "notification",
  NotificationSchema
)
