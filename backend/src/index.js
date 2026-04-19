import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import imageRoutes from "./routes/imageRoutes.js"

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }))
app.use(express.json())
app.use("/api", imageRoutes)

app.get("/", (req, res) => {
  res.json({ message: "ArtifAI backend running ✅" })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})