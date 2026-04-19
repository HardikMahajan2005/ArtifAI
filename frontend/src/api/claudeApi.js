const BACKEND_URL = "https://artifai.onrender.com/api"

export async function enhancePrompt(rawPrompt, style) {
  const res = await fetch(`${BACKEND_URL}/enhance-prompt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: rawPrompt, style }),
  })
  const data = await res.json()
  return data.enhanced || rawPrompt
}

export async function runImageTool(action, prompt) {
  const res = await fetch(`${BACKEND_URL}/tool`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tool: action, prompt }),
  })
  const data = await res.json()
  return data.message || prompt
}

export async function generateImage(prompt, style) {
  const res = await fetch(`${BACKEND_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, style }),
  })
  const data = await res.json()
  return data.image || null
}