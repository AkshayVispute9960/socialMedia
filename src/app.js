import express from "express"
import cors from "cors"
import cookieparser  from "cookie-parser"

const app = express();

app.use(cors({
   origin: process.env.CORS_ORIGIN,
   credentials:true
}))

app.use(express.json());
app.use(cookieparser());

import userRouter from '../src/routes/user.routes.js'
import postRouter from '../src/routes/post.routes.js'
import likeRouter from '../src/routes/like.routes.js'
import commentPost from '../src/routes/comment.routes.js'

app.use('/api/v1/users', userRouter)
app.use('/api/v1/post', postRouter)
app.use('/api/v1/like', likeRouter)
app.use('/api/v1/comment', commentPost)




app.use(express.json({ limit:"16db" }))
app.use(express.urlencoded({extended:true, limit:"16db"}))
app.use(express.static("public"))

export { app }