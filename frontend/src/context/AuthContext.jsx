import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider, db } from "../firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Save user profile to Firestore on every login
  async function saveUserToFirestore(user) {
    if (!user) return;
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid:         user.uid,
          displayName: user.displayName || "",
          email:       user.email || "",
          photoURL:    user.photoURL || "",
          lastLogin:   serverTimestamp(),
        },
        { merge: true } // merge so we don't overwrite existing fields
      );
    } catch (err) {
      console.error("Failed to save user to Firestore:", err);
    }
  }

  async function loginWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider);
    await saveUserToFirestore(result.user);
    return result;
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
