import express from "express";
import cors from "cors";
import { env } from "*/configs/environment";
import mongoose from "mongoose";

import authRoute from "*/routes/auth"
import userRoute from "*/routes/users"
import postRoute from "*/routes/posts"
import categoryRoute from "*/routes/categories"
import path from "path";

import upload from "./middlewares/uploadFile";

mongoose.connect(env.MONGODB_URI || process.env.MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => { console.log("connect to database successfully"); })
    .then(() => bootApp())
    .catch((err) => {
        console.log("err", err);
        process.exit(1);
    })

const bootApp = () => {
    const app = express()

    app.use(express.json())
    app.use(cors())

    app.get('/', (req, res) => {
        res.status(200).send("ACCESS SERVER")
    })

    app.post("/api/upload", upload.single("file"), (req,res) => {
        res.status(200).json("File has been uploaded")
    })
    app.use("/api/images", express.static(path.join(__dirname,"/images")))
    app.use("/api/auth/", authRoute)
    app.use("/api/users/", userRoute)
    app.use("/api/posts/", postRoute)
    app.use("/api/categories/", categoryRoute)

    app.listen(process.env.PORT || env.PORT, () => {
        console.log(`server is running port ${env.PORT}`)
    })
}

