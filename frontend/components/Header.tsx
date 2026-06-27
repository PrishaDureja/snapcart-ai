"use client";

import { motion } from "framer-motion";
import { History, Zap } from "lucide-react";

interface HeaderProps {
  historyCount: number;
  onHistoryOpen: () => void;
}

export default function Header({ historyCount, onHistoryOpen }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 30,
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(5, 5, 8, 0.8)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "32px", height: "32px",
          borderRadius: "10px",
          background: "linear-gradient(135deg, var(--cyan) 0%, var(--purple) 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Zap size={16} fill="#000" color="#000" />
        </div>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: "17px",
          color: "var(--text-primary)",
          letterSpacing: "-0.01em",
        }}>
          SnapCart<span style={{
            background: "linear-gradient(135deg, var(--cyan), var(--purple))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}> AI</span>
        </span>
      </div>

      {/* Nav */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <a href="#how-it-works" style={{
          fontSize: "13px",
          color: "var(--text-secondary)",
          textDecoration: "none",
          padding: "6px 12px",
          borderRadius: "8px",
          transition: "color 0.2s",
        }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
        >
          How it works
        </a>

        <button
          id="history-btn"
          onClick={onHistoryOpen}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "7px 14px",
            borderRadius: "10px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s",
            position: "relative",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.15)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
          }}
        >
          <History size={14} />
          History
          {historyCount > 0 && (
            <span style={{
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--cyan), var(--purple))",
              color: "#000",
              fontSize: "10px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              {historyCount}
            </span>
          )}
        </button>
      </div>
    </motion.header>
  );
}