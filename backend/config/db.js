import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"
import dotenv from "dotenv"
dotenv.config({ path: "../.env" })

const connectDB = async () => {
    try {
        // console.log(`${process.env.MONGO_URI}/${DB_NAME}`);

        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        // console.log(`MongoDB connected !! DB HOST ${connectionInstance.connection.host}`);
    }
    catch (error) {
        console.log("MONGODB CONNECCTION failed: ", error);
        process.exit(1)
    }
}

export default connectDB
