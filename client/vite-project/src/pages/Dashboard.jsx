import React, { useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [english, setEnglish] = useState(null);
  const [hindi, setHindi] = useState(null);
  const [lang, setLang] = useState("en"); // "en" | "hi"
  const [eligibilityInput, setEligibilityInput] = useState("");
  const [eligibilityResult, setEligibilityResult] = useState(null);

  const BACKEND_URL = "https://schemesathi.onrender.com"; // ✅ Render backend

  // ===== Upload PDF =====
  const handleUpload = async () => {
    if (!file) return alert("Please upload a PDF");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post(`${BACKEND_URL}/api/upload`, formData);
      setEnglish(res.data.english);
      setHindi(res.data.hindi);
      setLang("en");
      setEligibilityResult(null);
    } catch (err) {
      alert("Upload failed. Try again!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const data = lang === "en" ? english : hindi;

  // ===== Eligibility Checker =====
  const handleEligibilityCheck = () => {
    if (!eligibilityInput) return;
    if (!data || !data.eligibility) return alert("Upload PDF first");

    const input = eligibilityInput.toLowerCase();
    const eligible = data.eligibility.filter(item =>
      item.toLowerCase().includes(input)
    );

    setEligibilityResult(
      eligible.length > 0
        ? `You may be eligible! Related criteria: ${eligible.join(", ")}`
        : "Based on your input, you may not meet the eligibility criteria."
    );
  };

  // ===== Text-to-Speech =====
  const speakText = (text) => {
    if (!text) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang === "en" ? "en-US" : "hi-IN";
    speechSynthesis.speak(utter);
  };

  // ===== Download Summary =====
  const downloadSummary = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    saveAs(blob, `Scheme_${data.scheme_name || "summary"}.json`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-green-100 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-white">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-green-600 bg-clip-text text-transparent">
            SchemeSaathi 🇮🇳
          </h1>
          <p className="text-gray-600 mt-2">
            AI assistant to simplify government schemes for everyone
          </p>
        </div>

        {/* Upload */}
        <div className="border-2 border-dashed border-orange-300 rounded-2xl p-6 text-center bg-white">
          <input
            type="file"
            accept="application/pdf"
            id="fileUpload"
            hidden
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label htmlFor="fileUpload" className="cursor-pointer">
            <div className="text-5xl">📄</div>
            <p className="mt-2 font-semibold text-gray-700">
              Click to upload or drop your scheme PDF
            </p>
          </label>
        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full mt-6 py-3 rounded-xl font-semibold text-white text-lg bg-gradient-to-r from-orange-500 to-green-600 shadow-xl disabled:opacity-60"
        >
          {loading ? "🔍 Analyzing scheme..." : "🚀 Analyze Scheme"}
        </button>

        {loading && (
          <div className="mt-6 text-center text-gray-600 animate-pulse">
            Reading document • Understanding policy • Extracting benefits...
          </div>
        )}

        {/* ================= RESULTS ================= */}
        {data && (
          <div className="mt-10 space-y-6">

            {/* Language Switch */}
            <div className="flex justify-end">
              <button
                onClick={() => setLang(lang === "en" ? "hi" : "en")}
                className="px-4 py-1.5 rounded-full bg-black text-white text-sm shadow"
              >
                🌐 Switch to {lang === "en" ? "Hindi" : "English"}
              </button>
            </div>

            {/* Scheme Name */}
            <h2 className="text-center text-2xl font-extrabold text-gray-800">🏛️ {data.scheme_name}</h2>

            {/* Buttons: TTS + Download */}
            <div className="flex justify-center gap-4 mt-2">
              <button onClick={() => speakText(data.summary)} className="px-4 py-2 rounded-xl bg-green-500 text-white text-sm">🔊 Listen Summary</button>
              <button onClick={() => speakText(data.eli10)} className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm">🔊 Listen ELI10</button>
              <button onClick={downloadSummary} className="px-4 py-2 rounded-xl bg-blue-500 text-white text-sm">💾 Download JSON</button>
            </div>

            {/* Summary */}
            <div className="bg-orange-50 border border-orange-200 p-5 rounded-2xl">
              <h3 className="font-bold text-orange-600 mb-2 text-lg">📌 Scheme Summary</h3>
              <p className="text-sm text-gray-700">{data.summary}</p>
            </div>

            {/* Benefits */}
            <Section title="🎁 Benefits" items={data.benefits} />
            {/* Eligibility */}
            <Section title="👥 Who can apply" items={data.eligibility} />
            {/* Documents */}
            <Section title="📄 Required Documents" items={data.documents} />
            {/* Steps */}
            {data.steps?.length > 0 && (
              <div className="bg-white border p-5 rounded-2xl">
                <h3 className="font-bold text-orange-700 mb-2 text-lg">🪜 How to Apply</h3>
                <ol className="list-decimal ml-5 text-sm text-gray-700 space-y-1">{data.steps.map((item, i) => <li key={i}>{item}</li>)}</ol>
              </div>
            )}
            {/* ELI10 */}
            <div className="bg-green-50 border border-green-200 p-5 rounded-2xl">
              <h3 className="font-bold text-green-700 mb-2 text-lg">🧒 Explain like I'm 10</h3>
              <p className="text-sm text-gray-700">{data.eli10}</p>
            </div>
            {/* Warnings */}
            <Section title="⚠️ Important Notes" items={data.warning_notes} red />

            {/* ===== Eligibility Checker ===== */}
            <div className="bg-yellow-50 border border-yellow-300 p-5 rounded-2xl">
              <h3 className="font-bold text-yellow-700 mb-2 text-lg">🔍 Quick Eligibility Check</h3>
              <input
                type="text"
                placeholder="Enter your profession / category"
                value={eligibilityInput}
                onChange={(e) => setEligibilityInput(e.target.value)}
                className="border p-2 rounded w-full mb-2"
              />
              <button
                onClick={handleEligibilityCheck}
                className="px-4 py-2 rounded-xl bg-yellow-500 text-white text-sm"
              >
                Check Eligibility
              </button>
              {eligibilityResult && <p className="mt-2 text-gray-700">{eligibilityResult}</p>}
            </div>

          </div>
        )}

        <p className="text-xs text-center text-gray-400 mt-10">Built with ❤️ to make government schemes simple for every Indian</p>

      </div>
    </div>
  );
}

/* Reusable Section Component */
function Section({ title, items, red }) {
  if (!items || items.length === 0) return null;
  return (
    <div className={`bg-white border p-5 rounded-2xl ${red ? "bg-red-50 border-red-200" : ""}`}>
      <h3 className="font-bold mb-2 text-lg">{title}</h3>
      <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">{items.map((item, i) => <li key={i}>{item}</li>)}</ul>
    </div>
  );
}
