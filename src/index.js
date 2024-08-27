import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "../src/app.js"

dotenv.config({
    path:"./.env"
})

connectDB()
.then(() => {
  app.listen(process.env.PORT || 8080, () => {
    console.log("server is runing on port", `${process.env.PORT}`)
  })
}).catch((error) => {
  console.log("mongodb connection failed",error)
})