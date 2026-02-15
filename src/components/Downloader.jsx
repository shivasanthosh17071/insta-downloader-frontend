import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [url, setUrl] = useState("");
  const [videoURL, setVideoURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentVideos, setRecentVideos] = useState([]);
const [menuOpen, setMenuOpen] = useState(false);
  // Load recent downloads
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentVideos")) || [];
    setRecentVideos(stored);
  }, []);

  const saveRecentVideo = (newVideo) => {
    let updated = [newVideo, ...recentVideos.filter(v => v !== newVideo)];
    if (updated.length > 3) updated = updated.slice(0, 3);
    setRecentVideos(updated);
    localStorage.setItem("recentVideos", JSON.stringify(updated));
  };

  const handleDownload = async () => {
    if (!url) {
      setError("Please enter a valid Instagram URL");
      return;
    }

    setLoading(true);
    setError("");
    setVideoURL("");

    try {
      const res = await axios.post(
        "https://instadownloaderbackend.vercel.app/api/download",
        { url }
      );

      if (res.data.videoURL) {
        setVideoURL(res.data.videoURL);
        saveRecentVideo(res.data.videoURL);
      } else {
        setError("Video not found. Make sure the post is public.");
      }
    } catch (err) {
      setError("Failed to fetch video. Server may be down.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "Poppins, sans-serif",
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        color: "#fff",
      }}
    >
      {/* ================= NAVBAR ================= */}
     <nav
  style={{
    position: "sticky",
    top: 0,
    zIndex: 1000,
    backdropFilter: "blur(20px)",
    background: "rgba(255, 255, 255, 0)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  }}
>
  <div
    style={{
      maxWidth: "1200px",
      margin: "auto",
      padding: "14px 20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    {/* Logo */}
    <div
      style={{
        fontWeight: "700",
        fontSize: "1.1rem",
        color: "#fff",
      }}
    >
      Santhosh.dev insta downloader
    </div>

    {/* Desktop Links */}
    <div
      className="desktopMenu"
      style={{
        display: "flex",
        gap: "28px",
        alignItems: "center",
      }}
    >
      <a href="#home" style={linkStyle}>Home</a>
      <a href="#how" style={linkStyle}>How It Works</a>
      <a href="#about" style={linkStyle}>About</a>
    </div>

    {/* Mobile Hamburger */}
    <div
      className="mobileMenu"
      onClick={() => setMenuOpen(!menuOpen)}
      style={{
        display: "none",
        flexDirection: "column",
        gap: "5px",
        cursor: "pointer",
      }}
    >
      <div style={barStyle}></div>
      <div style={barStyle}></div>
      <div style={barStyle}></div>
    </div>
  </div>

  {/* Mobile Dropdown */}
  {menuOpen && (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "20px",
        background: "rgba(15,15,30,0.95)",
      }}
    >
      <a href="#home" style={linkStyle} onClick={() => setMenuOpen(false)}>Home</a>
      <a href="#how" style={linkStyle} onClick={() => setMenuOpen(false)}>How It Works</a>
      <a href="#about" style={linkStyle} onClick={() => setMenuOpen(false)}>About</a>
    </div>
  )}

  {/* Responsive CSS */}
  <style>
    {`
      @media (max-width: 768px) {
        .desktopMenu {
          display: none !important;
        }
        .mobileMenu {
          display: flex !important;
        }
      }
    `}
  </style>
</nav>

      {/* ================= HERO ================= */}
      <section
        id="home"
        style={{
          padding: "80px 20px",
          textAlign: "center",
          maxWidth: "1000px",
          margin: "auto",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: "800",
          }}
        >
          Instagram Video Downloader
        </h1>

        <p style={{ color: "#cfcfff", marginBottom: "40px" }}>
          Download Instagram reels and videos instantly in HD quality.
        </p>

        <div
          style={{
            background: "rgba(255,255,255,0.08)",
            padding: "25px",
            borderRadius: "20px",
            backdropFilter: "blur(15px)",
            maxWidth: "550px",
            margin: "auto",
          }}
        >
          <input
            type="text"
            placeholder="Paste Instagram URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{
              width: "89%",
              padding: "15px",
              borderRadius: "12px",
              border: "none",
              marginBottom: "15px",
            }}
          />

          <button
            onClick={handleDownload}
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              fontWeight: "700",
              cursor: "pointer",
              background:
                "linear-gradient(90deg, #ff006e, #8338ec, #3a86ff)",
              color: "#fff",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Processing..." : "Download Now"}
          </button>

          {error && (
            <p style={{ marginTop: "15px", color: "yellow" }}>
              {error}
            </p>
          )}

         {videoURL && (
  <div style={{ marginTop: "20px" }}>
    <video
      src={videoURL}
      controls
      style={{ width: "100%", borderRadius: "15px" }}
    />

    <a
      href={`https://instadownloaderbackend.vercel.app/api/download-file?url=${encodeURIComponent(
        videoURL
      )}`}
      style={{
        display: "block",
        marginTop: "12px",
        padding: "10px",
        borderRadius: "10px",
        background: "#16a34a",
        textDecoration: "none",
        color: "#fff",
        fontWeight: "600",
        textAlign: "center",
      }}
    >
      Save to Gallery
    </a>
  </div>
)}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section
        id="how"
        style={{
          padding: "80px 20px",
          textAlign: "center",
          background: "rgba(0,0,0,0.3)",
        }}
      >
        <h2 style={{ marginBottom: "40px" }}>How It Works</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            maxWidth: "1000px",
            margin: "auto",
          }}
        >
          {["Paste Link", "Click Download", "Save Video"].map((step, i) => (
            <div
              key={i}
              style={{
                padding: "25px",
                borderRadius: "15px",
                background: "rgba(255,255,255,0.05)",
              }}
            >
              <h3>Step {i + 1}</h3>
              <p style={{ color: "#ccc" }}>{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= RECENT DOWNLOADS ================= */}
      {recentVideos.length > 0 && (
        <section style={{ padding: "60px 20px", textAlign: "center" }}>
          <h2 style={{ marginBottom: "30px" }}>Recent Downloads</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
              maxWidth: "1000px",
              margin: "auto",
            }}
          >
           {recentVideos.map((vid, index) => (
  <div
    key={index}
    style={{
      background: "rgba(255,255,255,0.05)",
      padding: "15px",
      borderRadius: "15px",
    }}
  >
    <video
      src={vid}
      controls
      style={{ width: "100%", borderRadius: "10px" }}
    />

    <a
      href={`https://instadownloaderbackend.vercel.app/api/download-file?url=${encodeURIComponent(
        vid
      )}`}
      style={{
        display: "block",
        marginTop: "10px",
        padding: "8px",
        borderRadius: "8px",
        background: "#16a34a",
        textDecoration: "none",
        color: "#fff",
        textAlign: "center",
      }}
    >
      Download Again
    </a>
  </div>
))}
          </div>
        </section>
      )}

      {/* ================= ABOUT ================= */}
      <section
        id="about"
        style={{
          padding: "80px 20px",
          textAlign: "center",
          maxWidth: "800px",
          margin: "auto",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>About Developer</h2>
        <p style={{ color: "#ccc", lineHeight: "1.8" }}>
          Hi 👋 I'm Santhosh, a Full Stack Developer.
          I built this tool specially for my friends to download Instagram
          videos easily. This is a personal project — not a public service 💜
        </p>
      </section>

      {/* ================= FOOTER ================= */}
      <footer
        style={{
          padding: "20px",
          textAlign: "center",
          background: "#000",
          color: "#888",
        }}
      >
        © 2026 Santhosh.dev — Built for Friends 💜
      </footer>
    </div>
  );
}
const linkStyle = {
  color: "#fff",
  textDecoration: "none",
  fontSize: "0.95rem",
  fontWeight: "500",
};

const barStyle = {
  width: "22px",
  height: "2px",
  background: "#fff",
  borderRadius: "2px",
};