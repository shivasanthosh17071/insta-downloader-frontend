import React, { useState ,useEffect} from "react";
import DownloadSteps from "./DownloadSteps"
import axios from "axios";

export default function LandingPage() {
  const [url, setUrl] = useState("");
  const [videoURL, setVideoURL] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
 const [recentVideos, setRecentVideos] = useState([]);

  // Load recent videos from localStorage on mount
  useEffect(() => {
    const storedVideos = JSON.parse(localStorage.getItem("recentVideos") || "[]");
    setRecentVideos(storedVideos);
  }, []);

  // Save new video to recentVideos in localStorage
  const saveRecentVideo = (video) => {
    let updatedVideos = [video, ...recentVideos];
    if (updatedVideos.length > 2) updatedVideos = updatedVideos.slice(0, 2); // keep only last 2
    setRecentVideos(updatedVideos);
    localStorage.setItem("recentVideos", JSON.stringify(updatedVideos));
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
    // 1️⃣ Check server status first
    let serverLive = false;
    try {
      const statusRes = await axios.get("https://instadownloaderbackend.vercel.app/api/status");
      serverLive = statusRes.data.live ?? false;
    } catch (err) {
      serverLive = false; // default false if API fails
    }

    // 2️⃣ If server is down, show 16-second countdown
    if (!serverLive) {
      setLoading(false);
      let timer = 16;
      setError(`Server unavailable. Try again in ${timer} seconds`);
      const interval = setInterval(() => {
        timer--;
        if (timer > 0) {
          setError(`Server unavailable. Try again in ${timer} seconds`);
        } else {
          clearInterval(interval);
          setError(""); // Clear message after countdown
        }
      }, 1000);
      return;
    }

    // 3️⃣ Server is live → proceed with download
    const res = await axios.post("https://instadownloaderbackend.vercel.app/api/download", { url });
    setVideoURL(res.data.videoURL);

    // Save to recent downloads
    saveRecentVideo(res.data.videoURL);
  } catch (err) {
    setError(err.response?.data?.error || "Failed to fetch video. Make sure the URL is public.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: "linear-gradient(135deg, #9400f7ff, #fd1d1d, #fcb045)",
      color: "#fff",
      minHeight: "100vh"
    }}>
        
      {/* Hero Section */}
      <section style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "20px"
      }}>
         {/* Profile Image */}
  <img
    src="/shivaSanthosh.jpg" // replace with your image path
    alt="Santhosh"
    style={{
      width: "120px",
      height: "120px",
      borderRadius: "50%",
      objectFit: "cover",
      marginBottom: "20px",
      border: "4px solid rgba(255,255,255,0.8)",
      boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
    }}
  />

        <h1 style={{
          fontSize: "3rem",
          fontWeight: "800",
          textShadow: "2px 2px 10px rgba(0,0,0,0.5)",
          marginBottom: "10px"
        }}>Santhosh.dev insta</h1>
        <p style={{
          fontSize: "1.2rem",
          marginBottom: "25px",
          color: "rgba(255,255,255,0.9)"
        }}>
          Download Instagram Reels & Videos instantly, built by <strong>Santhosh</strong>.
        </p>

        {/* Glass Downloader Card */}
        <div style={{
          width: "100%",
          maxWidth: "480px",
          padding: "30px",
          borderRadius: "25px",
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(255,255,255,0.15)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <input
            type="text"
            placeholder="Paste Instagram URL here"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "15px",
              border: "none",
              fontSize: "1rem",
              marginBottom: "20px",
              outline: "none",
              backgroundColor: "rgba(255, 255, 255, 1)",
              color: "#000000ff",
              textAlign: "center",
              fontWeight: "500",
              boxShadow: "inset 0 2px 6px rgba(0,0,0,0.2)"
            }}
          />
          <button
            onClick={handleDownload}
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "20px",
              border: "none",
              fontWeight: "700",
              fontSize: "1.1rem",
              cursor: loading ? "not-allowed" : "pointer",
              background: "linear-gradient(45deg, #833ab4, #fd1d1d, #fcb045)",
              color: "#fff",
              marginBottom: "20px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
              transition: "all 0.3s ease"
            }}
          >
            {loading ? "Processing..." : "Download Video"}
          </button>
          {error && <p style={{ color: "#ffc107", fontSize: "0.9rem", textAlign: "center", marginBottom: "10px" }}>{error}</p>}
          {videoURL && (
            <div style={{ textAlign: "center", width: "100%", marginBottom: "15px" }}>
              <video
                src={videoURL}
                controls
                style={{
                  width: "100%",
                  maxHeight: "320px",
                  borderRadius: "20px",
                  marginBottom: "10px",
                  boxShadow: "0 5px 20px rgba(0,0,0,0.35)"
                }}
              ></video>
              <a
                href={videoURL}
                download
                target="_blank"
                style={{
                  display: "block",
                  width: "100%",
                  padding: "12px",
                  borderRadius: "20px",
                  fontWeight: "700",
                  textAlign: "center",
                  textDecoration: "none",
                  backgroundColor: "#28a745",
                  color: "#fff",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
                }}
              >
                Open Video
              </a>
            </div>
          )}
        </div>
        <DownloadSteps />
          {/* Recent Downloads */}
          {recentVideos.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <h4 style={{ marginBottom: "10px" }}>Recent Downloads</h4>
              {recentVideos.map((vid, idx) => (
                <div key={idx} style={{ marginBottom: "15px", textAlign: "center" }}>
                  <video
                    src={vid}
                    controls
                    style={{ width: "100%", maxHeight: "200px", borderRadius: "15px", marginBottom: "5px" }}
                  ></video>
                  <a
                    href={vid}
                    download
                    target="_blank"
                    style={{ display: "inline-block", padding: "6px 12px", borderRadius: "15px", fontWeight: "600", textDecoration: "none", backgroundColor: "#ffdd00ff", color: "#000000ff",  borderBottom:"2px solid black" }}
                  >
                    Open & Save
                  </a>
                </div>
              ))}
            </div>
          )}
      </section>

      {/* Features Section */}
      <section style={{
        padding: "50px 20px",
        textAlign: "center",
        backgroundColor: "rgba(255,255,255,0.05)"
      }}>
        <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "20px" }}>Why Santhosh.dev insta?</h2>
        <p style={{ fontSize: "1rem", maxWidth: "600px", margin: "0 auto", marginBottom: "30px", color: "rgba(255,255,255,0.9)" }}>
          Download Instagram content instantly without complicated steps. Mobile-friendly, fast, and reliable.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
          <div style={{
            flex: "1 1 250px",
            padding: "20px",
            borderRadius: "20px",
            backdropFilter: "blur(15px)",
            backgroundColor: "rgba(255,255,255,0.15)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.25)"
          }}>
            <h3 style={{ marginBottom: "10px" }}>Fast Downloads</h3>
            <p>Get your favorite Reels & Videos instantly without delay.</p>
          </div>
          <div style={{
            flex: "1 1 250px",
            padding: "20px",
            borderRadius: "20px",
            backdropFilter: "blur(15px)",
            backgroundColor: "rgba(255,255,255,0.15)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.25)"
          }}>
            <h3 style={{ marginBottom: "10px" }}>Mobile First</h3>
            <p>Designed for mobile users, easy to tap, scroll, and save videos.</p>
          </div>
          <div style={{
            flex: "1 1 250px",
            padding: "20px",
            borderRadius: "20px",
            backdropFilter: "blur(15px)",
            backgroundColor: "rgba(255,255,255,0.15)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.25)"
          }}>
            <h3 style={{ marginBottom: "10px" }}>Secure & Simple</h3>
            <p>No complicated logins or third-party apps. Just paste & download.</p>
          </div>
        </div>
      </section>

      {/* About Developer Section */}
      <section style={{
        padding: "40px 20px",
        textAlign: "center"
      }}>
        <div style={{
          width: "90%",
          maxWidth: "480px",
          padding: "25px",
          borderRadius: "25px",
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(255,255,255,0.15)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
          margin: "0 auto"
        }}>
          <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "15px" }}>About the Developer</h2>
          <p style={{ fontSize: "1rem", lineHeight: "1.5rem" }}>
            Hi! I'm <strong>Santhosh</strong>, the creator of <strong>Santhosh.dev insta</strong>.  
            I built this tool to help my friends and users easily download Instagram Reels & Videos, with a simple, mobile-friendly interface.
          </p>
        </div>
      </section>
{/* Friends Section */}
<section style={{
  padding: "50px 20px",
  textAlign: "center",
  backgroundColor: "rgba(255,255,255,0.05)"
}}>
  <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "25px" }}>
   This Site Dedicated to My Friends
  </h2>
  <p style={{ fontSize: "1rem", marginBottom: "30px", color: "rgba(255,255,255,0.9)" }}>
    Here's a shoutout to my Thagubothu friends!
  </p>

  {/* Slider */}
  <div style={{
    display: "flex",
    overflowX: "auto",
    gap: "20px",
    paddingBottom: "10px",
    scrollSnapType: "x mandatory"
  }}>
    {/* Slide 1 */}
    <div style={{
      minWidth: "300px",
      flex: "0 0 auto",
      borderRadius: "20px",
      overflow: "hidden",
      boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
      scrollSnapAlign: "center"
    }}>
      <img
        src="/friends1.jpg" // replace with your friend's photo
        alt="Friend 1"
        style={{ width: "100%", display: "block" }}
      />
      <div style={{
        padding: "15px",
        backgroundColor: "rgba(0,0,0,0.6)",
        color: "#fff",
        textAlign: "center"
      }}>
    
      </div>
    </div>

    {/* Slide 2 */}
    <div style={{
      minWidth: "300px",
      flex: "0 0 auto",
      borderRadius: "20px",
      overflow: "hidden",
      boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
      scrollSnapAlign: "center"
    }}>
      <img
        src="/friends2.jpg" // replace with your friend's photo
        alt="Friend 2"
        style={{ width: "100%", display: "block" }}
      />
      <div style={{
        padding: "15px",
        backgroundColor: "rgba(0,0,0,0.6)",
        color: "#fff",
        textAlign: "center"
      }}>
       
      </div>
    </div>
  </div>
</section>

      {/* Footer */}
      <footer style={{
        padding: "20px",
        textAlign: "center",
        backgroundColor: "rgba(0, 0, 0, 0.86)",
        fontSize: "0.95rem"
      }}>
        &copy; 2025 <strong>Santhosh.dev insta</strong> | Built by Santhosh | only for friends
      </footer>
    </div>
  );
}
