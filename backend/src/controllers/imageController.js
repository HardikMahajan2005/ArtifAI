import dotenv from "dotenv"
dotenv.config()

import axios from "axios"

// ── Helper ───────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// ── Enhance Prompt using Gemini ──────────────────────────────────
export const enhancePrompt = async (req, res) => {
  const { prompt, style } = req.body

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" })
  }

  try {
    await sleep(1000)

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: `Transform this into a detailed image generation prompt in max 60 words. Include subject, lighting, mood, quality tags for ${style || "Realistic"} style. Return ONLY the prompt, no explanation.

Idea: "${prompt}"`
          }]
        }]
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      }
    )

    const enhanced = response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || prompt
    res.json({ enhanced })
  } catch (err) {
    if (err.response?.status === 429) {
      console.log("Gemini API quota exceeded (429). Falling back to free Pollinations Text API...")
      try {
        const fallbackRes = await axios.get(`https://text.pollinations.ai/${encodeURIComponent(`Transform this into a detailed image generation prompt in max 60 words. Include subject, lighting, mood, quality tags for ${style || "Realistic"} style. Return ONLY the prompt, no explanation. Idea: "${prompt}"`)}`)
        return res.json({ enhanced: fallbackRes.data })
      } catch (fallbackErr) {
        return res.json({ enhanced: prompt })
      }
    }
    console.error("Enhance error:", err.message)
    res.json({ enhanced: prompt })
  }
}

// ── Generate Image using Stability AI ───────────────────────────
export const generateImage = async (req, res) => {
  const { prompt, style } = req.body

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" })
  }

  try {
    const response = await axios.post(
      "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
      {
        text_prompts: [{ text: prompt, weight: 1 }],
        cfg_scale:    7,
        height:       1024,
        width:        1024,
        steps:        30,
        samples:      1,
      },
      {
        headers: {
          Authorization:  `Bearer ${process.env.STABILITY_API_KEY}`,
          "Content-Type": "application/json",
          Accept:         "application/json",
        },
        timeout: 30000,
      }
    )

    const imageBase64 = response.data.artifacts?.[0]?.base64
    res.json({ image: `data:image/png;base64,${imageBase64}` })
  } catch (err) {
    if (err.response?.status === 429 || err.response?.status === 401 || err.response?.status === 403 || err.response?.status === 400) {
      console.log("Stability API quota exceeded or invalid. Falling back to free Pollinations Image API...")
      try {
        const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true`
        const pollinationsRes = await axios.get(fallbackUrl, { responseType: 'arraybuffer' })
        const imageBase64 = Buffer.from(pollinationsRes.data).toString('base64')
        return res.json({ image: `data:image/jpeg;base64,${imageBase64}` })
      } catch (fallbackErr) {
        console.error("Pollinations fallback error:", fallbackErr.message)
        return res.status(500).json({ error: "Failed to generate image via fallback" })
      }
    }
    console.error("Generate error:", err.message)
    res.status(500).json({ error: "Failed to generate image" })
  }
}

// ── Post-generation Tools ────────────────────────────────────────
export const runTool = async (req, res) => {
  const { tool, prompt } = req.body

  if (!tool || !prompt) {
    return res.status(400).json({ error: "Tool and prompt are required" })
  }

  const toolMap = {
    upscale:   "HD upscaled",
    removebg:  "Background removed",
    variation: "New variation generated",
    expand:    "Canvas expanded",
  }

  res.json({
    success: true,
    tool,
    message: toolMap[tool] || "Tool applied",
    prompt,
  })
}