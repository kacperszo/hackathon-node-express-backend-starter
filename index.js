import express from 'express'
import dotenv from 'dotenv'
import { errorMiddleware } from './middleware/error.middleware'
import { authMiddleware } from './middleware/auth.middleware'
import { userRouter } from './controller/user.controller'
import { create, login, getUserById } from './controller/user.controller'
dotenv.config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//routes
app.use(userRouter)
//error handler
app.use(errorMiddleware)

app.listen(process.env.PORT, () => {
  console.log(`🚀 server started at http://localhost:${process.env.PORT} 🚀`)
})
