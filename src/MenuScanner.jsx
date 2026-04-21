import { useState } from "react";
import Tesseract from "tesseract.js";

export default function ScanMenu() {
  const [ocrText, setOcrText] = useState("");

  const handleImage = async (file) => {
    if (!file) return;

    const { data: { text } } = await Tesseract.recognize(file, "eng");
    setOcrText(text);
  };

  return (
    <div>
      <h2>Scan Menu</h2>

      {/* STEP 1: Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImage(e.target.files[0])}
      />

      {/* STEP 3: Show text */}
      <textarea
        value={ocrText}
        onChange={(e) => setOcrText(e.target.value)}
        rows={10}
        style={{ width: "100%", marginTop: "10px" }}
      />
    </div>
  );
}