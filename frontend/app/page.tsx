"use client";

import { motion } from "framer-motion";
import UploadBox from "@/components/UploadBox";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center px-6">
      
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-7xl font-bold text-center leading-tight"
      >
        Detect Fake Products <br />
        <span className="text-purple-500">Before You Buy</span>
      </motion.h1>

      {/* Subtext */}
      <p className="mt-6 text-gray-400 text-lg text-center max-w-xl">
        Upload a product screenshot. Our AI analyzes price, reviews, and patterns to detect fraud instantly.
      </p>

      <div className="mt-12 w-full max-w-xl">
        <UploadBox />
      </div>

    </main>
  );
}