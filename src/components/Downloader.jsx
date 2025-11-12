import React, { useState, useEffect } from "react";
import axios from "axios";
import DownloadSteps from "./DownloadSteps";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [url, setUrl] = useState("");
  const [videoURL, setVideoURL] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recentVideos, setRecentVideos] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentVideos") || "[]");
    setRecentVideos(stored);
  }, []);

  const saveRecentVideo = (video) => {
    let updated = [video, ...recentVideos];
    if (updated.length > 2) updated = updated.slice(0, 2);
    setRecentVideos(updated);
    localStorage.setItem("recentVideos", JSON.stringify(updated));
  };

  const handleDownload = async () => {
    if (!url) {
      setError("Please enter a valid Instagram URL");
      return;
    }
    setError("");
    setVideoURL("");
    setLoading(true);

    try {
      const status = await axios.get("https://instadownloaderbackend.vercel.app/api/status");
      if (!status.data.live) throw new Error("Server not live");

      const res = await axios.post("https://instadownloaderbackend.vercel.app/api/download", { url });
      setVideoURL(res.data.videoURL);
      saveRecentVideo(res.data.videoURL);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch video. Make sure the URL is public.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hide scrollbars + smooth scroll */}
      <style>
        {`
          ::-webkit-scrollbar {
            display: none;
          }
          html, body {
            scrollbar-width: none;
            -ms-overflow-style: none;
            overflow-y: auto;
            overflow-x: hidden;
            scroll-behavior: smooth;
          }
        `}
      </style>

      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #1a0b2e, #3c096c, #9d4edd)",
          color: "#fff",
          fontFamily: "Poppins, sans-serif",
          overflowX: "hidden",
        }}
      >
        {/* HERO */}
        <section
          id="hero"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "60px 20px",
            textAlign: "center",
          }}
        >
          <motion.img
            src="/hero.jpg"
            alt="Santhosh"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            style={{
              width: "130px",
              height: "130px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid #fff",
              boxShadow: "0 0 25px rgba(155, 80, 255, 0.8)",
              marginBottom: "15px",
            }}
          />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{
              fontSize: "3rem",
              fontWeight: "700",
              color: "#ffffff",
              textShadow: "0 0 15px #9d4edd",
            }}
          >
            Santhosh.dev Insta
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            style={{
              fontSize: "1.1rem",
              maxWidth: "480px",
              color: "#d8caff",
              marginBottom: "30px",
            }}
          >
            Download Instagram Reels & Videos with one click. Built with ❤️ by Santhosh.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(15px)",
              borderRadius: "20px",
              padding: "30px",
              width: "100%",
              maxWidth: "480px",
              boxShadow: "0 0 40px rgba(0,0,0,0.5)",
            }}
          >
            <input
              type="text"
              placeholder="Paste Instagram URL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{
                width: "90%",
                padding: "14px",
                borderRadius: "12px",
                border: "none",
                outline: "none",
                textAlign: "center",
                marginBottom: "15px",
                fontWeight: "500",
                boxShadow: "inset 0 2px 6px rgba(0,0,0,0.2)",
              }}
            />
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleDownload}
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                background: loading
                  ? "linear-gradient(90deg, #999, #777)"
                  : "linear-gradient(90deg, #7b2cbf, #9d4edd, #c77dff)",
                color: "#fff",
                fontWeight: "700",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 0 15px rgba(157,78,221,0.6)",
                transition: "0.3s",
              }}
            >
              {loading ? "Processing..." : "Download Video"}
            </motion.button>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ marginTop: "15px", color: "#ffcc00", fontWeight: "500" }}
              >
                {error}
              </motion.p>
            )}

            {videoURL && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{ marginTop: "20px" }}
              >
                <video
                  src={videoURL}
                  controls
                  style={{ width: "100%", borderRadius: "15px", boxShadow: "0 0 25px rgba(0,0,0,0.4)" }}
                ></video>
                <a
                  href={`https://instadownloaderbackend.vercel.app/api/download-file?url=${encodeURIComponent(videoURL)}`}
                  style={{
                    display: "block",
                    background: "#2ecc71",
                    color: "#fff",
                    fontWeight: "700",
                    padding: "10px",
                    borderRadius: "12px",
                    textDecoration: "none",
                    marginTop: "10px",
                  }}
                >
                  Save to Gallery
                </a>
              </motion.div>
            )}
          </motion.div>

          <DownloadSteps />
        </section>

        {/* RECENT DOWNLOADS */}
        {recentVideos.length > 0 && (
          <section
            id="recent"
            style={{
              padding: "60px 20px",
              textAlign: "center",
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{ fontWeight: "700", color: "#ffccff", marginBottom: "20px" }}
            >
              Recent Downloads
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "20px",
              }}
            >
              {recentVideos.map((vid, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "20px",
                    padding: "15px",
                    width: "300px",
                    boxShadow: "0 0 20px rgba(0,0,0,0.4)",
                  }}
                >
                  <video src={vid} controls style={{ width: "100%", borderRadius: "12px" }}></video>
                  <div style={{ marginTop: "10px", display: "flex", gap: "10px", justifyContent: "center" }}>
                    <a
                      href={vid}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: "#222",
                        color: "#fff",
                        padding: "6px 15px",
                        borderRadius: "8px",
                        textDecoration: "none",
                      }}
                    >
                      Open
                    </a>
                    <a
                      href={`https://instadownloaderbackend.vercel.app/api/download-file?url=${encodeURIComponent(vid)}`}
                      style={{
                        background: "#16a34a",
                        color: "#fff",
                        padding: "6px 15px",
                        borderRadius: "8px",
                        textDecoration: "none",
                      }}
                    >
                      Save
                    </a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}
{/* ABOUT DEVELOPER */}
<section
  id="about"
  style={{
    padding: "70px 20px",
    textAlign: "center",
    background: "linear-gradient(180deg, rgba(157, 78, 221, 0.08), rgba(0,0,0,0.6))",
    borderTop: "1px solid rgba(255,255,255,0.1)",
  }}
>
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    style={{
      maxWidth: "700px",
      margin: "0 auto",
      background: "rgba(255,255,255,0.08)",
      borderRadius: "20px",
      padding: "40px 25px",
      backdropFilter: "blur(12px)",
      boxShadow: "0 0 40px rgba(0,0,0,0.4)",
    }}
  >
    <img
      src="/hero.jpg"
      alt="Santhosh Developer"
      style={{
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        border: "3px solid #fff",
        boxShadow: "0 0 20px rgba(157,78,221,0.6)",
        objectFit: "cover",
        marginBottom: "20px",
      }}
    />
    <h2
      style={{
        color: "#fff",
        fontWeight: "700",
        marginBottom: "10px",
        textShadow: "0 0 10px rgba(157,78,221,0.8)",
      }}
    >
      About Developer
    </h2>
    <p
      style={{
        color: "#ddd",
        fontSize: "1.05rem",
        lineHeight: "1.8",
        maxWidth: "580px",
        margin: "0 auto 15px",
      }}
    >
      Hi 👋 I'm <strong>Santhosh</strong> — the creator of{" "}
      <strong>Santhosh.dev Insta</strong>.  
      I love building fast, user-friendly, and modern web tools that make people’s lives simpler.
      This downloader is one of my fun projects for my friends 💜.
    </p>
    <p style={{ color: "#bfaaff", fontWeight: "500", fontSize: "1rem" }}>
      Passion: Front-End Development & UI Design ✨  
      <br />
      Tech Stack: ReactJS • Node.js • MongoDB
    </p>

    <div
      style={{
        marginTop: "25px",
        display: "flex",
        justifyContent: "center",
        gap: "15px",
      }}
    >
      <a
        href="https://github.com/shivasanthosh17071"
        target="_blank"
        rel="noreferrer"
        style={{
          background: "linear-gradient(90deg, #7b2cbf, #c77dff)",
          color: "#fff",
          padding: "10px 18px",
          borderRadius: "10px",
          textDecoration: "none",
          fontWeight: "600",
          boxShadow: "0 0 15px rgba(157,78,221,0.4)",
          transition: "0.3s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      >
         GitHub
      </a>
    
<a
  href="https://santhoshdev.space"
  target="_blank"
  rel="noreferrer"
  style={{
    background: "linear-gradient(90deg, #3c096c, #7209b7)",
    color: "#fff",
    padding: "10px 22px",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "600",
    boxShadow: "0 0 15px rgba(0,0,0,0.3)",
    display: "inline-block",
    transition: "all 0.3s ease",
    transform: "translateY(0)",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-4px)";
    e.currentTarget.style.boxShadow = "0 0 25px rgba(157,78,221,0.6)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 0 15px rgba(0,0,0,0.3)";
  }}
>
  🔗 Portfolio
</a>

    </div>
  </motion.div>
</section>

        {/* FRIENDS */}
        <section
          id="friends"
          style={{
            padding: "70px 20px",
            textAlign: "center",
            background: "linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.6))",
          }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ fontWeight: "700", color: "#e0b0ff", marginBottom: "20px" }}
          >
            Dedicated to My Friends 💜
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            style={{
              display: "flex",
              overflowX: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              gap: "15px",
              marginTop: "25px",
              paddingBottom: "10px",
            }}
          >
            <style>{`div::-webkit-scrollbar { display: none; }`}</style>
            {["/friends1.jpg", "/friends2.jpg"].map((img, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                style={{
                  minWidth: "260px",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 0 25px rgba(0,0,0,0.4)",
                }}
              >
                <img src={img} alt={`Friend ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* FOOTER */}
        <footer
          id="footer"
          style={{
            background: "#000",
            color: "#bbb",
            textAlign: "center",
            padding: "20px",
            fontSize: "0.9rem",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          © 2025 <strong>Santhosh.dev Insta</strong> | Built by Santhosh 💻 | Only for friends 💜
        </footer>
      </div>
    </>
  );
}
