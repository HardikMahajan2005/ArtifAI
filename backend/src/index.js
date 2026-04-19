import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import imageRoutes from "./routes/imageRoutes.js"

const app = express()
const PORT = process.env.PORT || 5000

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000"
].filter(Boolean); // removes undefined
console.log( process.env.FRONTEND_URL)
app.use(cors({ 
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}))
app.use(express.json())
app.use("/api", imageRoutes)

app.get("/", (req, res) => {
  res.json({ message: "ArtifAI backend running ✅" })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})