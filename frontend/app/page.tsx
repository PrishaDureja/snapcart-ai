"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import UploadZone, { AnalysisResult } from "@/components/UploadZone";
import ResultsPanel from "@/components/ResultsPanel";
import HistoryPanel, { HistoryEntry } from "@/components/HistoryPanel";
import HowItWorks from "@/components/HowItWorks";
import { ArrowDown } from "lucide-react";

const HISTORY_KEY = "snapcart_history";

export default function Home() {
  const [state, setState] = useState<"idle" | "analyzing" | "results">("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  /* Load history from localStorage */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch {}
  }, []);

  const saveHistory = useCallback((entries: HistoryEntry[]) => {
    setHistory(entries);
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(entries)); } catch {}
  }, []);

  const handleResult = (data: AnalysisResult) => {
    setResult(data);
    setState("results");
  };

  const handleSave = () => {
    if (!result) return;
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      imageUrl: result.imageUrl,
      deal_score: result.deal_score,
      verdict: result.verdict,
      verdict_detail: result.verdict_detail,
      timestamp: Date.now(),
    };
    saveHistory([entry, ...history].slice(0, 20));
  };

  const handleReset = () => {
    setResult(null);
    setState("idle");
  };

  const handleHistorySelect = (entry: HistoryEntry) => {
    // Re-display a history entry as a partial result
    setResult({
      deal_score: entry.deal_score,
      verdict: entry.verdict,
      verdict_detail: entry.verdict_detail,
      risk_signals: [],
      green_signals: [],
      ai_brief: "Loaded from history.",
      recommendation: entry.verdict,
      imageUrl: entry.imageUrl,
    });
    setState("results");
  };

  return (
    <>
      {/* Background orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      <Header historyCount={history.length} onHistoryOpen={() => setHistoryOpen(true)} />

      <main style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>

        {/* ── HERO SECTION ── */}
        <section style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "100px 24px 60px",
          textAlign: "center",
        }}>

          <AnimatePresence mode="wait">
            {state !== "results" ? (
              <motion.div
                key="hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                style={{ width: "100%", maxWidth: "680px" }}
              >
                {/* Label */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 16px",
                    borderRadius: "100px",
                    background: "rgba(0,212,255,0.08)",
                    border: "1px solid rgba(0,212,255,0.2)",
                    marginBottom: "28px",
                  }}
                >
                  <span style={{
                    width: "6px", height: "6px",
                    borderRadius: "50%",
                    background: "var(--cyan)",
                    animation: "glow-pulse 2s ease-in-out infinite",
                    boxShadow: "0 0 8px var(--cyan)",
                  }} />
                  <span style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    color: "var(--cyan)",
                    textTransform: "uppercase",
                  }}>
                    Powered by Gemini Vision AI
                  </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(38px, 7vw, 72px)",
                    lineHeight: 1.05,
                    letterSpacing: "-0.03em",
                    color: "var(--text-primary)",
                    marginBottom: "20px",
                  }}
                >
                  Your AI{" "}
                  <span style={{
                    background: "linear-gradient(135deg, var(--cyan) 0%, var(--purple) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>
                    Shopping
                  </span>
                  <br />
                  Co-Pilot
                </motion.h1>

                {/* Subtext */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  style={{
                    fontSize: "clamp(15px, 2.5vw, 18px)",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    maxWidth: "460px",
                    margin: "0 auto 44px",
                  }}
                >
                  Screenshot any product from any platform.
                  AI tells you the deal score, spots fake reviews,
                  and gives you a verdict in seconds.
                </motion.p>

                {/* Upload Zone */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  style={{ width: "100%" }}
                >
                  <UploadZone
                    onResult={handleResult}
                    onAnalyzing={(a) => setState(a ? "analyzing" : "idle")}
                    analyzing={state === "analyzing"}
                  />
                </motion.div>

                {/* Scroll hint */}
                {state === "idle" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    style={{
                      marginTop: "48px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                      color: "var(--text-muted)",
                    }}
                  >
                    <span style={{ fontSize: "12px", letterSpacing: "0.08em" }}>HOW IT WORKS</span>
                    <motion.div
                      animate={{ y: [0, 6, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <ArrowDown size={16} />
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              /* ── RESULTS STATE ── */
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ width: "100%" }}
              >
                {/* Results header */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ marginBottom: "32px" }}
                >
                  <p style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "11px",
                    letterSpacing: "0.2em",
                    color: "var(--cyan)",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                    fontWeight: 600,
                  }}>
                    Analysis Complete
                  </p>
                  <h2 style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(24px, 4vw, 36px)",
                    color: "var(--text-primary)",
                  }}>
                    Here&apos;s what the AI found
                  </h2>
                </motion.div>

                {result && (
                  <ResultsPanel
                    result={result}
                    onReset={handleReset}
                    onSave={handleSave}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ── HOW IT WORKS ── */}
        {state !== "results" && <HowItWorks />}

        {/* ── FOOTER ── */}
        <footer style={{
          textAlign: "center",
          padding: "32px 24px",
          borderTop: "1px solid var(--border)",
          marginTop: "40px",
        }}>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            Built with Gemini Vision AI · Next.js · FastAPI ·{" "}
            <span style={{
              background: "linear-gradient(135deg, var(--cyan), var(--purple))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              SnapCart AI
            </span>
          </p>
        </footer>
      </main>

      {/* ── HISTORY DRAWER ── */}
      <HistoryPanel
        entries={history}
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onSelect={handleHistorySelect}
      />
    </>
  );
}