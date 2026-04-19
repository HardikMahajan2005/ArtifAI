import { useState } from "react"
import StyleSelector from "./StyleSelector"
import ImageResult from "./ImageResult"
import LoginModal from "./LoginModal"
import { enhancePrompt, generateImage } from "../api/claudeApi"
import { STYLES, LOADING_STEPS, PLACEHOLDER_GRADIENTS } from "../constants"
import { useAuth } from "../context/AuthContext"
import "./GeneratorPanel.css"

const MAX_CHARS = 500

export default function GeneratorPanel({ image, onImageUpdate, recentImages = [], showToast }) {
  const { currentUser } = useAuth()
  const [prompt,      setPrompt]      = useState("")
  const [style,       setStyle]       = useState("realistic")
  const [isLoading,   setIsLoading]   = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [showLogin,   setShowLogin]   = useState(false)

  const runLoadingSteps = () => {
    let step = 0
    setLoadingStep(0)
    const interval = setInterval(() => {
      step++
      if (step < LOADING_STEPS.length) setLoadingStep(step)
      else clearInterval(interval)
    }, 700)
    return interval
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    // Auth guard — show login modal if not signed in
    if (!currentUser) {
      setShowLogin(true)
      return
    }

    setIsLoading(true)
    onImageUpdate(null)
    const interval = runLoadingSteps()
    try {
      const styleLabel     = STYLES.find((s) => s.id === style)?.label || "Realistic"
      const enhancedPrompt = await enhancePrompt(prompt, styleLabel)
      const imageUrl       = await generateImage(enhancedPrompt, styleLabel)
      const gradient       = PLACEHOLDER_GRADIENTS[Math.floor(Math.random() * PLACEHOLDER_GRADIENTS.length)]
      clearInterval(interval)
      onImageUpdate({
        id:             Date.now(),
        prompt,
        enhancedPrompt,
        style,
        gradient,
        processedWith: null,
        url:            imageUrl,
      })
    } catch (err) {
      console.error("Generation failed:", err)
      showToast?.("Generation failed. Please try again.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRecentClick = (img) => {
    onImageUpdate(img)
  }

  return (
    <>
      <div className="generator">
        {/* Auth nudge banner — shown only when not logged in */}
        {!currentUser && (
          <div className="generator__auth-nudge">
            <span className="generator__auth-nudge-icon">🔐</span>
            <span className="generator__auth-nudge-text">
              <strong>Login required</strong> to generate images.{" "}
            </span>
            <button
              className="generator__auth-nudge-btn"
              onClick={() => setShowLogin(true)}
            >
              Sign in →
            </button>
          </div>
        )}

        <div className="generator__input-block">
          <div className="generator__label-row">
            <label className="generator__label">What do you want to create?</label>
            <span className={`generator__char-count ${prompt.length > MAX_CHARS * 0.9 ? "generator__char-count--warn" : ""}`}>
              {prompt.length}/{MAX_CHARS}
            </span>
          </div>
          <textarea
            className="generator__textarea"
            value={prompt}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) setPrompt(e.target.value)
            }}
            placeholder='Describe anything… "a wolf under the moon", "futuristic city"'
            rows={3}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleGenerate()
              }
            }}
          />
        </div>

        <StyleSelector selected={style} onSelect={setStyle} />

        <button
          className="btn btn-primary generator__cta"
          onClick={handleGenerate}
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? (
            <>
              <span className="generator__spinner" />
              {LOADING_STEPS[loadingStep]}
            </>
          ) : currentUser ? (
            "✦ Generate Image"
          ) : (
            "🔐 Login to Generate"
          )}
        </button>

        {(isLoading || image) && (
          <ImageResult
            image={image}
            isLoading={isLoading}
            loadingStep={loadingStep}
            onImageUpdate={onImageUpdate}
            showToast={showToast}
          />
        )}

        {/* Recent generations mini-gallery */}
        {recentImages.length > 1 && !isLoading && (
          <div className="generator__recent">
            <p className="generator__recent-label">Recent generations</p>
            <div className="generator__recent-grid">
              {recentImages.map((img) => (
                <button
                  key={img.id}
                  className={`generator__recent-thumb ${image?.id === img.id ? "generator__recent-thumb--active" : ""}`}
                  onClick={() => handleRecentClick(img)}
                  title={img.prompt}
                  style={{ background: `linear-gradient(145deg, ${img.gradient[0]}, ${img.gradient[1]})` }}
                >
                  {img.url ? (
                    <img src={img.url} alt={img.prompt} className="generator__recent-img" />
                  ) : (
                    <span className="generator__recent-icon">
                      {STYLES.find((s) => s.id === img.style)?.icon}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  )
}