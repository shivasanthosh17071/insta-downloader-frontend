import React from "react";

export default function DownloadSteps() {
  const steps = [
    {
      title: "Step 1",
      description: "Copy the URL of the Instagram Reel or Video you want to download.",
      icon: "📋",
    },
    {
      title: "Step 2",
      description: "Paste the URL into the input box above on Santhosh.dev insta.",
      icon: "🔗",
    },
    {
      title: "Step 3",
      description: "Click the 'Download Video' button and wait for processing.",
      icon: "⏳",
    },
    {
      title: "Step 4",
      description: "Once processed, watch it or click 'Open Video' to download.",
      icon: "✅",
    },
  ];

  return (
    <section style={{ padding: "50px 20px", textAlign: "center", backgroundColor: "rgba(255, 255, 255, 0)" }}>
      <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "30px" }}>How to Download</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "600px", margin: "0 auto" }}>
        {steps.map((step, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "15px",
              padding: "20px",
              borderRadius: "20px",
              backdropFilter: "blur(15px)",
              backgroundColor: "rgba(255,255,255,0.15)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
            }}
          >
            <div
              style={{
                fontSize: "2rem",
                minWidth: "50px",
                textAlign: "center",
                color: "#fd1d1d",
              }}
            >
              {step.icon}
            </div>
            <div style={{ textAlign: "left" }}>
              <h3 style={{ margin: "0 0 5px 0", fontSize: "1.2rem", fontWeight: "700" }}>{step.title}</h3>
              <p style={{ margin: 0, fontSize: "1rem", color: "rgba(255,255,255,0.9)" }}>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
