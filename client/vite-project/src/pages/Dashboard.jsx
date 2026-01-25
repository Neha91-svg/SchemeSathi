import React, { useState } from "react";
import axios from "axios";

export default function Dashboard() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleUpload = async () => {
        if (!file) return alert("Please upload a PDF");

        const formData = new FormData();
        formData.append("file", file);

        try {
            setLoading(true);
            const res = await axios.post("http://localhost:5000/api/upload", formData);
            setResult(res.data);
        } catch (err) {
            alert("Upload failed");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-green-100 flex items-center justify-center px-4">

            <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-100">

                <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-orange-500 to-green-600 bg-clip-text text-transparent">
                    SchemeSaathi 🇮🇳
                </h1>

                <p className="text-center text-gray-600 mt-2 mb-6">
                    Upload government scheme PDF and get instant understanding
                </p>

                <div className="space-y-4">
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="block w-full text-sm
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:bg-gradient-to-r file:from-orange-500 file:to-green-500
            file:text-white file:font-medium
            hover:file:opacity-90"
                    />

                    <button
                        onClick={handleUpload}
                        disabled={loading}
                        className="w-full py-2.5 rounded-xl font-semibold text-white
            bg-gradient-to-r from-orange-500 to-green-600
            hover:scale-[1.02] transition transform shadow-lg"
                    >
                        {loading ? "⏳ Processing..." : "🚀 Upload Scheme PDF"}
                    </button>
                </div>

                {result && (
                    <div className="mt-6 space-y-5">

                        <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl">
                            <h2 className="font-semibold text-orange-600 mb-1">📌 Summary</h2>
                            <p className="text-sm text-gray-700">{result.summary}</p>
                        </div>

                        <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
                            <h2 className="font-semibold text-green-600 mb-1">🧒 Explain like I'm 10</h2>
                            <p className="text-sm text-gray-700">{result.eli10}</p>
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
}
