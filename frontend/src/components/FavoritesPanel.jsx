import { STYLES } from "../constants"
import { useAuth } from "../context/AuthContext"
import "./FavoritesPanel.css"

export default function FavoritesPanel({ favorites, onToggleFavorite }) {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return (
      <div className="favorites__empty">
        <div className="favorites__empty-icon">🔒</div>
        <p className="favorites__empty-title">Login required</p>
        <p className="favorites__empty-sub">
          Please log in to save and view your favorites.
        </p>
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className="favorites__empty">
        <div className="favorites__empty-icon">♡</div>
        <p className="favorites__empty-title">No favorites yet</p>
        <p className="favorites__empty-sub">
          Generate an image and tap the heart to save it here.
        </p>
      </div>
    )
  }

  return (
    <div className="favorites">
      <div className="favorites__header">
        <h2 className="favorites__title">Favorites</h2>
        <span className="favorites__count">{favorites.length} saved</span>
      </div>
      <div className="favorites__grid">
        {favorites.map((img) => {
          const styleObj = STYLES.find((s) => s.id === img.style)
          return (
            <div key={img.id} className="fav-card">
              <div
                className="fav-card__thumb"
                style={{ background: `linear-gradient(145deg, ${img.gradient[0]}, ${img.gradient[1]})` }}
              >
                <span className="fav-card__thumb-icon">{styleObj?.icon}</span>
                <button
                  className="fav-card__heart"
                  onClick={() => onToggleFavorite(img)}
                >
                  ♥
                </button>
              </div>
              <div className="fav-card__info">
                <p className="fav-card__prompt">{img.enhancedPrompt || img.prompt}</p>
                <span className="fav-card__style">{styleObj?.label}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}