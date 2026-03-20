"use client";

import { motion } from "framer-motion";
import UploadBox from "@/components/UploadBox";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-1 px-6 pt-28">
        
        {/* Top Label */}
        <p className="text-sm md:text-base tracking-[0.4em] text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 mb-6 font-medium">
          SNAPCART — AI
        </p>

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

        {/* Upload Box */}
        <div className="mt-12 w-full max-w-xl">
          <UploadBox />
        </div>

      </div>

      {/* Footer */}
      <Footer />

    </main>
  );
}