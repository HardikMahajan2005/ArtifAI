import { useState } from "react"
import { runImageTool } from "../api/claudeApi"
import { POST_TOOLS, STYLES, LOADING_STEPS } from "../constants"
import "./ImageResult.css"

export default function ImageResult({
  image, isLoading, loadingStep, onImageUpdate, showToast,
}) {
  const [activeTool,  setActiveTool]  = useState(null)
  const [downloading, setDownloading] = useState(false)
  const [copied,      setCopied]      = useState(false)

  const styleObj = image ? STYLES.find((s) => s.id === image.style) : null

  const handleToolClick = async (toolId) => {
    if (!image || activeTool) return
    setActiveTool(toolId)
    let i = 0
    const interval = setInterval(() => {
      i++
      if (i < LOADING_STEPS.length) {}
      else clearInterval(interval)
    }, 600)
    try {
      const result = await runImageTool(toolId, image.enhancedPrompt || image.prompt)
      clearInterval(interval)
      onImageUpdate({ ...image, processedWith: toolId, enhancedPrompt: result })
    } catch (err) {
      console.error("Tool failed:", err)
      showToast?.("Tool failed. Please try again.", "error")
    } finally {
      setActiveTool(null)
    }
  }

  const handleDownload = async () => {
    if (!image?.url || downloading) return
    setDownloading(true)
    try {
      const response = await fetch(image.url)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `artifai-${image.id || Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      showToast?.("Image downloaded!", "success")
    } catch (err) {
      // Fallback: open in new tab
      window.open(image.url, "_blank")
      showToast?.("Opened image in new tab.", "info")
    } finally {
      setDownloading(false)
    }
  }

  const handleCopyPrompt = () => {
    const text = image?.enhancedPrompt || image?.prompt || ""
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      showToast?.("Prompt copied to clipboard!", "success")
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      showToast?.("Could not copy to clipboard.", "error")
    })
  }

  return (
    <div className="result" style={{ animation: "fadeIn 0.35s ease" }}>
      <div
        className="result__canvas"
        style={image
          ? { background: `linear-gradient(145deg, ${image.gradient[0]}, ${image.gradient[1]})` }
          : { background: "var(--surface)" }
        }
      >
        {(isLoading || activeTool) && (
          <div className="result__loading">
            <div className="result__dots">
              {[0, 1, 2].map((i) => (
                <span key={i} className="result__dot" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
            <p className="result__loading-text">
              {activeTool
                ? `${POST_TOOLS.find((t) => t.id === activeTool)?.label}…`
                : LOADING_STEPS[loadingStep]
              }
            </p>
          </div>
        )}

        {image && !isLoading && !activeTool && (
          <>
            {image.url ? (
              <img src={image.url} alt={image.prompt} className="result__image" />
            ) : (
              <div className="result__placeholder">
                <div className="result__style-icon">{styleObj?.icon}</div>
                <p className="result__prompt-preview">{image.enhancedPrompt || image.prompt}</p>
              </div>
            )}
            {image.processedWith && (
              <div style={{ position: "absolute", bottom: "16px", left: "16px", zIndex: 10 }}>
                <span className="result__processed-badge">
                  {POST_TOOLS.find((t) => t.id === image.processedWith)?.icon}{" "}
                  {POST_TOOLS.find((t) => t.id === image.processedWith)?.label} applied
                </span>
              </div>
            )}

            {/* Action buttons overlay — visible on hover */}
            <div className="result__overlay-actions">
              {image.url && (
                <button
                  className="result__download-btn"
                  onClick={handleDownload}
                  disabled={downloading}
                  title="Download image"
                >
                  {downloading ? (
                    <span className="result__download-spinner" />
                  ) : (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Download
                    </>
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {image && !isLoading && (
        <div className="result__meta">
          <div className="result__meta-content">
            <span className="result__meta-label">AI Enhanced →</span>
            <span className="result__meta-text">{image.enhancedPrompt || image.prompt}</span>
          </div>
          <button
            className={`result__copy-btn ${copied ? "result__copy-btn--done" : ""}`}
            onClick={handleCopyPrompt}
            title="Copy prompt"
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      )}

      {image && !isLoading && (
        <div className="result__tools">
          <p className="result__tools-label">Do more with this image</p>
          <div className="result__tools-grid">
            {POST_TOOLS.map((tool) => (
              <button
                key={tool.id}
                className={`tool-btn ${activeTool === tool.id ? "tool-btn--active" : ""}`}
                onClick={() => handleToolClick(tool.id)}
                disabled={!!activeTool}
              >
                <span className="tool-btn__icon">{tool.icon}</span>
                <span className="tool-btn__label">{tool.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}