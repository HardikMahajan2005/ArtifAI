import { useEffect, useState } from "react"
import "./Toast.css"

export default function Toast({ message, type = "success", onDone }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onDone, 300)
    }, 2500)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <div className={`toast toast--${type} ${visible ? "toast--in" : "toast--out"}`}>
      <span className="toast__icon">
        {type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}
      </span>
      <span className="toast__msg">{message}</span>
    </div>
  )
}
