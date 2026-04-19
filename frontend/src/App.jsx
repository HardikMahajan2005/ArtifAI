import { useState } from "react"
import Header from "./components/Header"
import GeneratorPanel from "./components/GeneratorPanel"
import Toast from "./components/Toast"

export default function App() {
  // Lifted image state — survives auth changes (login/logout)
  const [image, setImage] = useState(null)
  const [recentImages, setRecentImages] = useState([]) // session gallery

  // Toast state
  const [toast, setToast] = useState(null) // { message, type }

  const showToast = (message, type = "success") => {
    setToast({ message, type })
  }

  const handleImageUpdate = (newImage) => {
    setImage(newImage)
    // Add to recent gallery (max 5, newest first, avoid duplicates by id)
    if (newImage?.url) {
      setRecentImages((prev) => {
        const filtered = prev.filter((img) => img.id !== newImage.id)
        return [newImage, ...filtered].slice(0, 5)
      })
    }
  }

  return (
    <div className="app">
      <Header />
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
    </div>
  )
}