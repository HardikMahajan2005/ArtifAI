import { useState, useEffect, useCallback } from "react"
import Header from "./components/Header"
import GeneratorPanel from "./components/GeneratorPanel"
import LoginModal from "./components/LoginModal"
import Toast from "./components/Toast"
import { useAuth } from "./context/AuthContext"

export default function App() {
  const { currentUser } = useAuth()

  // Lifted image state — survives auth changes (login/logout)
  const [image,        setImage]        = useState(null)
  const [recentImages, setRecentImages] = useState([])

  // Blur-lock: shown when user logs out while an image is visible
  const [showBlurLock, setShowBlurLock] = useState(false)

  // Toast
  const [toast, setToast] = useState(null)

  const showToast = (message, type = "success") => {
    setToast({ message, type })
  }

  const handleImageUpdate = (newImage) => {
    setImage(newImage)
    if (newImage?.url) {
      setRecentImages((prev) => {
        const filtered = prev.filter((img) => img.id !== newImage.id)
        return [newImage, ...filtered].slice(0, 5)
      })
    }
  }

  // When user logs out, if there's a generated image visible → show blur lock
  const handleLogout = useCallback(async (logoutFn) => {
    await logoutFn()
    if (image) {
      setShowBlurLock(true)
    }
  }, [image])

  // When user logs back in from blur lock → dismiss it
  useEffect(() => {
    if (currentUser && showBlurLock) {
      setShowBlurLock(false)
    }
  }, [currentUser, showBlurLock])

  return (
    <div className={`app ${showBlurLock ? "app--blurred" : ""}`}>
      <Header onLogout={handleLogout} />
      <main className="main">
        <GeneratorPanel
          image={image}
          onImageUpdate={handleImageUpdate}
          recentImages={recentImages}
          showToast={showToast}
        />
      </main>

      {toast && (
        <Toast
          key={toast.message + Date.now()}
          message={toast.message}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}

      {/* Blur lock overlay — appears when user logs out with an image on screen */}
      {showBlurLock && (
        <div className="blur-lock">
          <LoginModal
            onClose={() => {}} // can't dismiss — must log in
            forceOpen
          />
        </div>
      )}
    </div>
  )
}