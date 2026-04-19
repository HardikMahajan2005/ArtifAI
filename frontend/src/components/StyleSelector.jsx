import { STYLES } from "../constants"
import "./StyleSelector.css"

export default function StyleSelector({ selected, onSelect }) {
  return (
    <div className="style-selector">
      <span className="generator__label">Style</span>
      <div className="style-selector__grid">
        {STYLES.map((s) => (
          <button
            key={s.id}
            className={`style-btn ${selected === s.id ? "style-btn--active" : ""}`}
            onClick={() => onSelect(s.id)}
          >
            <span className="style-btn__icon">{s.icon}</span>
            <span className="style-btn__label">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}