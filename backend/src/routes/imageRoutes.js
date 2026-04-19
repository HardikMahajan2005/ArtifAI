import express from "express"
import {
  generateImage,
  enhancePrompt,
  runTool,
} from "../controllers/imageController.js"

const router = express.Router()

router.post("/generate",        generateImage)
router.post("/enhance-prompt",  enhancePrompt)
router.post("/tool",            runTool)

export default router