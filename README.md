<div align="center">
  
  # ✦ ArtifAI

  **A Modern, AI-Powered Image Generation Application**

  [![React](https://img.shields.io/badge/React-18.x-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg?style=for-the-badge&logo=vite)](https://vitejs.dev/)
  [![Firebase](https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore-FFCA28.svg?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
  [![Node.js](https://img.shields.io/badge/Node.js-Express-339933.svg?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
  [![AI](https://img.shields.io/badge/AI-Gemini%20%7C%20Stability%20%7C%20Pollinations-white.svg?style=for-the-badge)]()

  *Generate stunning, high-quality images from text prompts with deep AI prompt enhancement.*

</div>

---

## ✨ Features

- **Google OAuth Authentication**: Secure, seamless sign-in with Firebase. Session terminates on browser close to protect user data.
- **AI Image Generation**: Turn your text descriptions into realistic, anime, 3D, or pixel-art images.
- **Smart Prompt Enhancement**: Uses Google's Gemini / Claude models under the hood to take simple user prompts (e.g., "a wolf") and upgrade them into highly detailed, context-rich prompts for the image generator.
- **Favorites & Cloud Storage**: Fully functional Firestore integration. Users can "heart" generated images and save them directly to their cloud profile.
- **Vibrant & Glassmorphic UI**: Beautiful dark-mode user interface with ambient background glowing orbs, smooth transitions, and high-end aesthetics.
- **One-Click Download**: Native download functionality built directly into the UI overlay.
- **Prompt Copiation**: Instantly copy your enhanced AI prompts to your clipboard.

## 🛠️ Complete Tech Stack

### 🎨 Frontend Ecosystem
* **Core:** [React 19](https://react.dev/) + [Vite 8](https://vite.dev/)
* **Languages:** JavaScript (ES6+), HTML5, CSS3
* **Styling:** Custom CSS with robust CSS variables, Keyframe Animations, Glassmorphism, and responsive CSS Grid/Flexbox architectures.
* **Authentication:** [Firebase Auth](https://firebase.google.com/docs/auth) (`^12.12.0`)
  * Implemented Google OAuth Provider
  * Configured `browserSessionPersistence` for automatic logouts on window close.
* **Database (Client):** [Firebase Cloud Firestore](https://firebase.google.com/docs/firestore)
  * Real-time read/write for user profiles and favorited images.
* **Iconography/Fonts:** Inter, Outfit, and custom SVG icons inline.

### ⚙️ Backend Ecosystem
* **Core:** [Node.js](https://nodejs.org/en) + [Express 5](https://expressjs.com/) (`^5.2.1`)
* **Routing & Middleware:**
  * `cors` (`^2.8.6`): Configured securely for strictly Netlify and Localhost origins.
  * Express Native JSON Body Parser
* **Environment Management:** `dotenv` (`^17.3.1`)
* **API Comms:** `axios` (`^1.13.6`) - For secure server-to-server AI model API interactions.
* **Dev Tools:** `nodemon` (`^3.1.14`)

### 🧠 AI & External Services
* **Image Generation:** 
  * [Pollinations AI](https://pollinations.ai/) (Primary/Fallback Generator)
  * [Stability AI](https://stability.ai/) (Configured in backend env)
* **Prompt Engineering / LLM:**
  * [Google Gemini 2.0 Flash-Lite](https://aistudio.google.com/) via direct REST API connection. Uses system instructions to rewrite and maximize image prompt effectiveness based on selected art styles.

### 🚀 Hosting & Delivery
* **Frontend:** [Netlify](https://www.netlify.com/) (CI/CD via GitHub, Auto HTTPS, Environment Variable Injection)
* **Backend:** [Render](https://render.com/) (Web Service deployed, handling all CORS and private API communication)

---

## 🚀 Running Locally

### 1. Clone the repository
```bash
git clone https://github.com/your-username/artifai.git
cd artifai
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_FIREBASE_API_KEY="your_api_key_here"
VITE_FIREBASE_AUTH_DOMAIN=""
VITE_FIREBASE_PROJECT_ID=""
VITE_FIREBASE_STORAGE_BUCKET=""
VITE_FIREBASE_MESSAGING_SENDER_ID=""
VITE_FIREBASE_APP_ID="your_app_id"
VITE_BACKEND_URL="http://localhost:5000/api"
```
Run the frontend:
```bash
npm run dev
```

### 3. Backend Setup
Open a new terminal window:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
GEMINI_API_KEY="your_gemini_api_key_here"
STABILITY_API_KEY="your_stability_api_key_here"
FRONTEND_URL="http://localhost:5173"
```
Run the backend:
```bash
npm run dev
# or
node src/index.js
```

---

## 🌍 Deployment Architecture

### Netlify (Frontend)
The frontend expects all `VITE_` variables to be injected via the Netlify dashboard Settings -> Environment Variables.

### Render (Backend)
The backend expects API keys and the `FRONTEND_URL` variable to verify CORS origins. Configured securely via Render Dashboard.

---

## 🛡️ Security
* **No local API leakage**: All direct AI model interactions happen strictly behind the Express backend. The React app never possesses the Gemini or Stability API keys.
* **Strict CORS**: The backend utilizes strict Cross-Origin Resource Sharing. In production, it immediately rejects any traffic not originating from the specified Netlify URL.
* **Database Rules**: Firestore is guarded behind logged-in Firebase sessions.

---

<div align="center">
  <i>Built with passion and AI.</i>
</div>
