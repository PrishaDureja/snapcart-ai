"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function UploadBox() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      console.log("RESULT:", data);
      alert("Check console for result");

    } catch (err) {
      console.error(err);
      alert("Error connecting to backend");
    }

    setLoading(false);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="border border-gray-700 rounded-2xl p-8 bg-[#1A1A1A] flex flex-col items-center gap-4"
    >
      
      {/* File Input */}
      <input
        type="file"
        className="text-sm text-gray-400"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      {/* Button BELOW */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:opacity-90 transition font-medium"
      >
        {loading ? "Analyzing..." : "Analyze Product"}
      </button>

    </motion.div>
  );
}