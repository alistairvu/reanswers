import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config()

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true,
    })
    console.log("MongoDB connected")
  } catch (err) {
    console.log(err)
  }
}

export default connectDB
