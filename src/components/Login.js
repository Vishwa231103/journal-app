import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { FcGoogle } from "react-icons/fc";
import { FiBook, FiLoader } from "react-icons/fi";
import "./Login.css";

function Login({ setUser }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (err) {
      console.error(err);
      setError("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <FiBook className="logo-icon" />
            <span>JournalApp</span>
          </div>
          <h1>Welcome to Your Digital Journal</h1>
          <p>Sign in to start capturing your thoughts and memories</p>
        </div>

        <div className="login-content">
          <button
            onClick={login}
            disabled={isLoading}
            className="google-login-btn"
          >
            {isLoading ? (
              <FiLoader className="spinner" />
            ) : (
              <FcGoogle className="google-icon" />
            )}
            <span>
              {isLoading ? "Signing in..." : "Sign in with Google"}
            </span>
          </button>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="login-features">
            <h3>Why Journal With Us?</h3>
            <ul>
              <li>🔒 Your data is securely stored and private</li>
              <li>📱 Access your journal from any device</li>
              <li>🎨 Beautiful, distraction-free writing experience</li>
              <li>📅 Organize entries by date and mood</li>
            </ul>
          </div>
        </div>

        <div className="login-footer">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>

      <div className="login-background">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>
    </div>
  );
}

export default Login;