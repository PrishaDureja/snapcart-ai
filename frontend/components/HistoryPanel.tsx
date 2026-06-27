"use client";

import { motion, AnimatePresence } from "framer-motion";
import { History, X, ShieldCheck, ShieldAlert, ShieldX, Clock } from "lucide-react";

export interface HistoryEntry {
  id: string;
  imageUrl?: string;
  deal_score: number;
  verdict: "BUY" | "SKIP" | "CAUTION";
  verdict_detail: string;
  timestamp: number;
}

interface HistoryPanelProps {
  entries: HistoryEntry[];
  open: boolean;
  onClose: () => void;
  onSelect: (entry: HistoryEntry) => void;
}

function VerdictIcon({ verdict }: { verdict: string }) {
  if (verdict === "BUY") return <ShieldCheck size={14} color="#10B981" />;
  if (verdict === "SKIP") return <ShieldX size={14} color="#EF4444" />;
  return <ShieldAlert size={14} color="#F59E0B" />;
}

function ScoreColor(score: number) {
  if (score >= 70) return "#10B981";
  if (score >= 40) return "#F59E0B";
  return "#EF4444";
}

function timeAgo(ts: number) {
  const diff = (Date.now() - ts) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function HistoryPanel({ entries, open, onClose, onSelect }: HistoryPanelProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
              zIndex: 40,
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            style={{
              position: "fixed",
              top: 0, right: 0, bottom: 0,
              width: "min(360px, 90vw)",
              background: "rgba(8, 8, 14, 0.98)",
              backdropFilter: "blur(24px)",
              borderLeft: "1px solid var(--border)",
              zIndex: 50,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div style={{
              padding: "20px 20px 16px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <History size={18} color="var(--cyan)" />
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600,
                  fontSize: "15px",
                  color: "var(--text-primary)",
                }}>
                  Scan History
                </span>
              </div>
              <button onClick={onClose} style={{
                width: "28px", height: "28px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--text-secondary)",
              }}>
                <X size={14} />
              </button>
            </div>

            {/* Entries */}
            <div style={{ flex: 1, overflowY: "auto", padding: "12px" }} className="no-scrollbar">
              {entries.length === 0 ? (
                <div style={{
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  height: "200px", gap: "12px",
                }}>
                  <History size={32} color="var(--text-muted)" />
                  <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                    No scans yet. Analyze a product!
                  </p>
                </div>
              ) : (
                entries.map((entry, i) => (
                  <motion.button
                    key={entry.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => { onSelect(entry); onClose(); }}
                    style={{
                      width: "100%",
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                      padding: "12px",
                      borderRadius: "12px",
                      background: "transparent",
                      border: "1px solid transparent",
                      cursor: "pointer",
                      textAlign: "left",
                      marginBottom: "8px",
                      transition: "all 0.15s",
                    }}
                    whileHover={{
                      background: "rgba(255,255,255,0.04)",
                      borderColor: "var(--border)",
                    }}
                  >
                    {/* Thumbnail */}
                    <div style={{
                      width: "44px", height: "44px",
                      borderRadius: "10px",
                      flexShrink: 0,
                      overflow: "hidden",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid var(--border)",
                    }}>
                      {entry.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={entry.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <History size={16} color="var(--text-muted)" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                        <VerdictIcon verdict={entry.verdict} />
                        <span style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontWeight: 600,
                          fontSize: "13px",
                          color: "var(--text-primary)",
                        }}>
                          {entry.verdict}
                        </span>
                        <span style={{
                          marginLeft: "auto",
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontWeight: 700,
                          fontSize: "13px",
                          color: ScoreColor(entry.deal_score),
                        }}>
                          {entry.deal_score}
                        </span>
                      </div>
                      <p style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        marginBottom: "4px",
                      }}>
                        {entry.verdict_detail}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Clock size={10} color="var(--text-muted)" />
                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                          {timeAgo(entry.timestamp)}
                        </span>
                      </div>
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
