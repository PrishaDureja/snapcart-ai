"use client";

import { useRef, useState, useCallback, DragEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ImageIcon, X, Sparkles } from "lucide-react";

interface UploadZoneProps {
  onResult: (data: AnalysisResult) => void;
  onAnalyzing: (analyzing: boolean) => void;
  analyzing: boolean;
}

export interface AnalysisResult {
  deal_score: number;
  verdict: "BUY" | "SKIP" | "CAUTION";
  verdict_detail: string;
  risk_signals: string[];
  green_signals: string[];
  ai_brief: string;
  recommendation: string;
  imageUrl?: string;
}

export default function UploadZone({ onResult, onAnalyzing, analyzing }: UploadZoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) {
      setError("Please upload an image file (PNG, JPG, WEBP)");
      return;
    }
    setError(null);
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleAnalyze = async () => {
    if (!file) return;
    onAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      onResult({ ...data, imageUrl: preview || undefined });
      // DO NOT call onAnalyzing(false) here, because onResult unmounts this component
      // and sets the parent state to 'results'. Calling it would instantly reset to 'idle'.
    } catch (err) {
      console.error("Upload error:", err);
      setError("Could not connect to backend. Make sure it's running on port 8000.");
      onAnalyzing(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <AnimatePresence mode="wait">
        {!file ? (
          /* ── DROP ZONE ── */
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`upload-zone ${dragOver ? "drag-over" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <div className="upload-icon-wrapper">
              <Upload size={28} color="var(--cyan)" />
            </div>

            <p className="font-display font-semibold text-lg text-primary mb-2"
               style={{ color: "var(--text-primary)" }}>
              Drop your product screenshot
            </p>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "20px" }}>
              or click to browse — works with any shopping app
            </p>

            <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
              {["Amazon", "Flipkart", "Meesho", "Myntra", "Any site"].map((site) => (
                <span key={site} style={{
                  fontSize: "11px",
                  padding: "4px 10px",
                  borderRadius: "100px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "var(--text-secondary)"
                }}>
                  {site}
                </span>
              ))}
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
            />
          </motion.div>
        ) : (
          /* ── PREVIEW + SCAN ── */
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="glass-card"
            style={{ padding: "20px", position: "relative" }}
          >
            {/* Close button */}
            {!analyzing && (
              <button onClick={clearFile} style={{
                position: "absolute", top: "12px", right: "12px",
                width: "28px", height: "28px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--text-secondary)", zIndex: 10
              }}>
                <X size={14} />
              </button>
            )}

            {/* Image preview with scan effect */}
            <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", marginBottom: "16px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview!}
                alt="Product preview"
                style={{
                  width: "100%",
                  maxHeight: "240px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  opacity: analyzing ? 0.7 : 1,
                  transition: "opacity 0.3s"
                }}
              />

              {/* Scan overlay */}
              {analyzing && (
                <>
                  <div className="scan-overlay" />
                  <div className="scan-line-container">
                    <div className="scan-line" />
                  </div>
                  <div style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexDirection: "column", gap: "12px"
                  }}>
                    <div className="dot-loader">
                      <span /><span /><span />
                    </div>
                    <p style={{ fontSize: "13px", color: "var(--cyan)", fontWeight: 500 }}>
                      AI is reading your deal...
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* File info */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{
                width: "36px", height: "36px",
                borderRadius: "10px",
                background: "var(--cyan-dim)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <ImageIcon size={16} color="var(--cyan)" />
              </div>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)" }}>
                  {file.name}
                </p>
                <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  {(file.size / 1024).toFixed(0)} KB
                </p>
              </div>
            </div>

            {/* Analyze button */}
            <button
              id="analyze-btn"
              className="btn-primary"
              onClick={handleAnalyze}
              disabled={analyzing}
              style={{ width: "100%" }}
            >
              <Sparkles size={16} />
              {analyzing ? "Analyzing with Gemini AI..." : "Analyze This Deal"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              marginTop: "12px", textAlign: "center",
              color: "var(--red)", fontSize: "13px"
            }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
