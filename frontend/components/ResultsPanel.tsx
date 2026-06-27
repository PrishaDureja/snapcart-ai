"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, ShieldAlert, ShieldX,
  AlertTriangle, CheckCircle2, RotateCcw,
  BookmarkPlus, TrendingUp
} from "lucide-react";
import ScoreRing from "./ScoreRing";
import type { AnalysisResult } from "./UploadZone";

interface ResultsPanelProps {
  result: AnalysisResult;
  onReset: () => void;
  onSave: () => void;
}

function VerdictBadge({ verdict }: { verdict: string }) {
  const map: Record<string, { label: string; icon: React.ReactNode; cls: string }> = {
    BUY: { label: "BUY IT", icon: <ShieldCheck size={18} />, cls: "verdict-buy" },
    CAUTION: { label: "PROCEED WITH CAUTION", icon: <ShieldAlert size={18} />, cls: "verdict-caution" },
    SKIP: { label: "SKIP IT", icon: <ShieldX size={18} />, cls: "verdict-skip" },
  };
  const v = map[verdict] ?? map["CAUTION"];
  return (
    <div className={`risk-badge ${v.cls}`} style={{
      padding: "10px 20px",
      borderRadius: "100px",
      fontSize: "13px",
      fontFamily: "'Space Grotesk', sans-serif",
      fontWeight: 700,
      letterSpacing: "0.05em",
      display: "inline-flex",
      alignItems: "center",
      gap: "8px"
    }}>
      {v.icon}
      {v.label}
    </div>
  );
}

function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    idx.current = 0;
    const interval = setInterval(() => {
      if (idx.current < text.length) {
        setDisplayed(text.slice(0, idx.current + 1));
        idx.current++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, 18);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span>
      {displayed}
      {!done && (
        <span style={{
          display: "inline-block",
          width: "2px",
          height: "14px",
          background: "var(--cyan)",
          marginLeft: "2px",
          verticalAlign: "middle",
          animation: "scan-pulse 0.8s ease-in-out infinite"
        }} />
      )}
    </span>
  );
}

export default function ResultsPanel({ result, onReset, onSave }: ResultsPanelProps) {
  const { deal_score, verdict, verdict_detail, risk_signals, green_signals, ai_brief, imageUrl } = result;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: "100%", maxWidth: "680px", margin: "0 auto" }}
      >
        {/* ── HEADER CARD: Score + Verdict ── */}
        <div className="glass-card-bright" style={{ padding: "32px", marginBottom: "16px" }}>
          <div style={{ display: "flex", gap: "32px", alignItems: "center", flexWrap: "wrap" }}>

            {/* Thumbnail */}
            {imageUrl && (
              <div style={{
                width: "80px", height: "80px",
                borderRadius: "12px",
                overflow: "hidden",
                flexShrink: 0,
                border: "1px solid var(--border)"
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Product" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}

            {/* Score Ring */}
            <ScoreRing score={deal_score} size={140} strokeWidth={10} />

            {/* Verdict + detail */}
            <div style={{ flex: 1, minWidth: "180px" }}>
              <div style={{ marginBottom: "10px" }}>
                <VerdictBadge verdict={verdict} />
              </div>
              <p style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600,
                fontSize: "16px",
                color: "var(--text-primary)",
                lineHeight: 1.4,
                marginBottom: "8px"
              }}>
                {verdict_detail}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <TrendingUp size={13} color="var(--cyan)" />
                <span style={{ fontSize: "12px", color: "var(--cyan)" }}>
                  Deal Score: {deal_score}/100
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── AI BRIEF ── */}
        <div className="glass-card" style={{ padding: "24px", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <div style={{
              width: "28px", height: "28px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, var(--cyan-dim), var(--purple-dim))",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <span style={{ fontSize: "13px" }}>🤖</span>
            </div>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600, fontSize: "13px",
              color: "var(--text-secondary)",
              letterSpacing: "0.05em",
              textTransform: "uppercase"
            }}>
              AI Analysis
            </span>
          </div>
          <p style={{
            fontSize: "14px",
            lineHeight: 1.7,
            color: "var(--text-primary)",
          }}>
            <TypewriterText text={ai_brief} />
          </p>
        </div>

        {/* ── SIGNALS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>

          {/* Risk signals */}
          {risk_signals && risk_signals.length > 0 && (
            <div className="glass-card" style={{ padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                <AlertTriangle size={14} color="var(--red)" />
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600, fontSize: "12px",
                  color: "var(--text-secondary)",
                  textTransform: "uppercase", letterSpacing: "0.05em"
                }}>
                  Risk Signals
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {risk_signals.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i + 0.3 }}
                    className="risk-badge risk-badge-red"
                  >
                    <AlertTriangle size={11} />
                    {s}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Green signals */}
          {green_signals && green_signals.length > 0 && (
            <div className="glass-card" style={{ padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                <CheckCircle2 size={14} color="var(--green)" />
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600, fontSize: "12px",
                  color: "var(--text-secondary)",
                  textTransform: "uppercase", letterSpacing: "0.05em"
                }}>
                  Good Signs
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {green_signals.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i + 0.3 }}
                    className="risk-badge risk-badge-green"
                  >
                    <CheckCircle2 size={11} />
                    {s}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── ACTIONS ── */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button id="reset-btn" className="btn-primary" onClick={onReset} style={{ flex: 1 }}>
            <RotateCcw size={15} />
            Analyze Another
          </button>
          <button id="save-btn" className="btn-secondary" onClick={onSave}>
            <BookmarkPlus size={15} />
            Save
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
