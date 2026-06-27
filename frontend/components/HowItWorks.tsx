"use client";

import { motion } from "framer-motion";
import { Camera, Brain, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: <Camera size={24} color="var(--cyan)" />,
    number: "01",
    title: "Screenshot It",
    desc: "See a product anywhere — Flipkart, Amazon, Meesho, any app. Screenshot it.",
  },
  {
    icon: <Brain size={24} color="var(--purple)" />,
    number: "02",
    title: "AI Reads It",
    desc: "Gemini Vision AI reads the price, reviews, discounts, and seller — like a smart friend.",
  },
  {
    icon: <ShieldCheck size={24} color="#10B981" />,
    number: "03",
    title: "You Decide Smart",
    desc: "Get a Deal Score, risk breakdown, and a clear verdict: Buy, Skip, or Proceed with Caution.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: "80px 24px 40px" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: "center", marginBottom: "48px" }}
      >
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "11px",
          letterSpacing: "0.2em",
          color: "var(--cyan)",
          textTransform: "uppercase",
          marginBottom: "12px",
          fontWeight: 600,
        }}>
          How It Works
        </p>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: "clamp(26px, 4vw, 38px)",
          color: "var(--text-primary)",
          lineHeight: 1.2,
        }}>
          From screenshot to verdict{" "}
          <span style={{
            background: "linear-gradient(135deg, var(--cyan), var(--purple))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            in seconds
          </span>
        </h2>
      </motion.div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "20px",
        maxWidth: "860px",
        margin: "0 auto",
      }}>
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            whileHover={{ y: -4 }}
            className="glass-card"
            style={{ padding: "28px 24px", position: "relative", overflow: "hidden" }}
          >
            {/* Step number watermark */}
            <div style={{
              position: "absolute",
              top: "-10px",
              right: "16px",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800,
              fontSize: "72px",
              color: "rgba(255,255,255,0.03)",
              lineHeight: 1,
              userSelect: "none",
            }}>
              {step.number}
            </div>

            {/* Icon */}
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
            }}>
              {step.icon}
            </div>

            <h3 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
              fontSize: "17px",
              color: "var(--text-primary)",
              marginBottom: "10px",
            }}>
              {step.title}
            </h3>
            <p style={{
              fontSize: "14px",
              color: "var(--text-secondary)",
              lineHeight: 1.65,
            }}>
              {step.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
