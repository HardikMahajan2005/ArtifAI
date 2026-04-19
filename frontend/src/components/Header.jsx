import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import LoginModal from "./LoginModal"
import "./Header.css"

export default function Header() {
  const { currentUser, logout } = useAuth()
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <header className="header">
        <div className="header__inner">
          <div className="header__logo">
            <div className="header__logo-icon">✦</div>
            <span className="header__logo-text">ArtifAI</span>
          </div>
          <nav className="header__nav" style={{ background: 'transparent', border: 'none' }}>
            <div className="header__auth" style={{ borderLeft: 'none', paddingLeft: 0, marginLeft: 0 }}>
              {currentUser ? (
                <div className="header__user-row">
                  <img
                    src={currentUser.photoURL || ""}
                    alt={currentUser.displayName || "User"}
                    className="header__avatar"
                    referrerPolicy="no-referrer"
                  />
                  <button className="header__auth-btn header__auth-btn--logout" onClick={logout}>
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  className="header__auth-btn header__auth-btn--login"
                  onClick={() => setShowModal(true)}
                >
                  <span className="header__btn-icon">✦</span>
                  Login
                </button>
              )}
            </div>
          </nav>
        </div>
      </header>

      {showModal && <LoginModal onClose={() => setShowModal(false)} />}
    </>
  )
}