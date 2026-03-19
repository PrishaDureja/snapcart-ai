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
      className="border border-gray-700 rounded-2xl p-8 text-center bg-[#1A1A1A]"
    >
      <input
        type="file"
        className="mb-4 text-sm"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={handleUpload}
        className="bg-purple-600 px-6 py-3 rounded-xl hover:bg-purple-500 transition"
      >
        {loading ? "Analyzing..." : "Analyze Product"}
      </button>
    </motion.div>
  );
}