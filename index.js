import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.get('/', (_, res) => {
  res.json({ data: { message: 'Hello World 🤘' } })
})

app.listen(process.env.PORT, () => {
  console.log(`🚀 server started at http://localhost:${process.env.PORT} 🚀`)
})
