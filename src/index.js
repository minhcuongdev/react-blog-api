import express from "express";
import cors from "cors";
import { env } from "*/configs/environment";
import mongoose from "mongoose";


mongoose.connect(env.MONGODB_URI || process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
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
    
    app.listen(process.env.PORT || env.PORT ,() => {
        console.log(`server is running port ${env.PORT}`)
    })
}

