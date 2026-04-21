import { useState } from "react";
import Tesseract from "tesseract.js";
import { BACKEND_URL } from "./constants/constants";

const client = import.meta.env.VITE_CLIENT;

export default function ScanMenu({ onClose, onApply }) {
  const [ocrText, setOcrText] = useState("");
  const [loadingOCR, setLoadingOCR] = useState(false);
  const [loadingConvert, setLoadingConvert] = useState(false);

  // 📸 OCR
  const handleImage = async (file) => {
    if (!file) return;

    try {
      setLoadingOCR(true);

      const { data: { text } } = await Tesseract.recognize(file, "eng");

      setOcrText(text);
    } catch (err) {
      console.error("❌ OCR error:", err);
      alert("Failed to read image");
    } finally {
      setLoadingOCR(false);
    }
  };

  // 🤖 Convert to structured menu
  const convertToMenu = async () => {
    if (!ocrText.trim()) {
      alert("No text to convert");
      return;
    }

    try {
      setLoadingConvert(true);

      const res = await fetch(`${BACKEND_URL}/api/${client}/convert-menu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: ocrText }),
      });

      if (!res.ok) throw new Error("Conversion failed");

      const data = await res.json();

      console.log("✅ Converted menu:", data);

      // 🔥 Send data back to MenuPage
      if (onApply) {
        onApply(data);
      }

    } catch (err) {
      console.error("❌ Convert error:", err);
      alert("Failed to convert menu");
    } finally {
      setLoadingConvert(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Scan Menu</h2>

        {/* 📸 Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImage(e.target.files[0])}
        />

        {loadingOCR && <p>Scanning image...</p>}

        {/* 🧾 OCR Text */}
        <textarea
          value={ocrText}
          onChange={(e) => setOcrText(e.target.value)}
          rows={10}
          style={{ width: "100%", marginTop: "10px" }}
          placeholder="Scanned text will appear here..."
        />

        {loadingConvert && <p>Converting to menu...</p>}

        {/* 🔘 Actions */}
        <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>

          <button
            onClick={convertToMenu}
            className="btn"
            disabled={loadingConvert}
          >
            Convert
          </button>

          <button onClick={onClose} className="save-btn">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}