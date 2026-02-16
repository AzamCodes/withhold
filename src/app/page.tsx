"use client";

import { useState, useRef, useEffect } from "react";
import RecordCard from "@/components/record-card";
import { downloadCardAsPng } from "@/lib/export";

const EMOJI_REGEX =
  /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu;

function getDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [recorded, setRecorded] = useState<{
    text: string;
    date: string;
  } | null>(null);
  const [isRecordingState, setIsRecordingState] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  // Hidden ref for the actual export
  const exportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Responsive scaling for preview
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function updateScale() {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const cardWidth = 720; // Fixed width of the card
        const newScale = Math.min(containerWidth / cardWidth, 1);
        setScale(newScale);
      }
    }

    // Initial calculation
    updateScale();

    // Resize observer
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener("resize", updateScale);
    return () => {
      window.removeEventListener("resize", updateScale);
      observer.disconnect();
    };
  }, [recorded]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const cleaned = raw.replace(EMOJI_REGEX, "").replace(/[\r\n]/g, "");
    if (cleaned.length <= 60) {
      setInput(cleaned);
    }
  }

  function handleRecord() {
    const trimmed = input.trim();
    if (!trimmed) return;
    setIsRecordingState(true);
    // Simulate procedural processing
    setTimeout(() => {
      setRecorded({ text: trimmed, date: getDateString() });
      setIsRecordingState(false);
    }, 600);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleRecord();
    }
  }

  async function handleDownload() {
    if (!exportRef.current || isExporting) return;
    setIsExporting(true);
    try {
      // Use the hidden exportRef which is always 720px wide
      await downloadCardAsPng(exportRef.current);
    } finally {
      setIsExporting(false);
    }
  }

  function handleShare() {
    if (!recorded) return;
    const base64Text = btoa(encodeURIComponent(recorded.text));
    // Format: REF-yyyyMMdd-base64
    // We replace dashes in date to match the card REF format (YYYYMMDD)
    const dateStr = recorded.date.replace(/-/g, "");
    const refId = `REF-${dateStr}-${base64Text}`;

    const url = `${window.location.origin}/r/${refId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      console.error("Failed to copy link");
    });
  }

  function handleReset() {
    setInput("");
    setRecorded(null);
    setCopied(false);
  }

  return (
    <main className="min-h-[100dvh] px-4 sm:px-0 flex flex-col items-center justify-center p-6 sm:py-32 w-full overflow-x-hidden">
      <div className="w-full max-w-[720px]  flex flex-col items-start gap-12 sm:gap-16">
        {/* Header - Always visible */}
        <div className="w-full flex flex-col gap-2">
          <h1
            className="font-bold tracking-[-0.02em] leading-none"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(3rem, 5vw + 1rem, 5rem)",
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              textWrap: "balance" as any
            }}
          >
            WITHHOLD
          </h1>
          <p
            className="text-base sm:text-lg text-[#666666]"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1rem, 2vw, 1.125rem)"
            }}
          >
            Record what you didn&apos;t give into.
          </p>
        </div>

        {/* Input Area - Persists but disables after recording */}
        <div
          className={`w-full flex flex-col gap-2 transition-opacity duration-300 ${recorded ? "opacity-40 pointer-events-none" : "opacity-100"
            }`}
        >
          <div className="flex flex-col sm:flex-row w-full sm:items-stretch border border-black transition-colors focus-within:border-black">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Checking notifications"
              maxLength={60}
              disabled={!!recorded || isRecordingState}
              autoComplete="off"
              autoFocus={!recorded}
              className="
        w-full sm:flex-1
        bg-transparent
        px-5
        h-14 sm:h-auto
        text-[clamp(1.1rem,3.5vw,1.3rem)]
        text-black
        placeholder:text-[#A8A8A8]
        placeholder:tracking-[0.15em]
        placeholder:uppercase
        border-b sm:border-b-0 sm:border-r border-black/10
        focus:outline-none
        disabled:cursor-not-allowed
        selection:bg-black selection:text-white
      "
              style={{
                fontFamily: "var(--font-serif)",
                borderRadius: 0,
              }}
            />

            <button
              onClick={handleRecord}
              disabled={!input.trim() || !!recorded || isRecordingState}
              aria-label="Record action"
              className="
        w-full sm:w-auto
        h-14 sm:h-auto
        px-7
        text-[11px]
        uppercase
        tracking-[0.25em]
        font-medium
        bg-black
        text-[#FAFAFA]
        transition-opacity
        disabled:opacity-50
        disabled:cursor-not-allowed
        active:opacity-90
      "
              style={{
                fontFamily: "var(--font-mono)",
                borderRadius: 0,
              }}
            >
              {isRecordingState ? "Recording…" : recorded ? "Recorded" : "Record"}
            </button>
          </div>

          <div
            className={`flex justify-between w-full mt-1 px-1 transition-opacity duration-200 ${recorded ? "opacity-0" : "opacity-100"
              }`}
          >
            <p
              className="text-[10px] tracking-[0.08em] text-[#9A9A9A]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              This record cannot be edited.
            </p>
            <p
              className="text-[10px] tracking-[0.12em] text-[#B0B0B0]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {input.length > 0 ? `${input.length}/60` : ""}
            </p>
          </div>
        </div>


        {/* Record Card - Visible only when recorded */}
        {recorded && (
          <div className="w-full flex flex-col gap-8 animate-in fade-in duration-500 ease-out fill-mode-forwards" style={{ marginTop: "-24px" }}>
            {/* Divider to separate from input */}
            <hr className="w-full border-t border-black/10 mb-4" />

            {/* Responsive Card Container - Uses aspect-ratio and scale to fit perfectly */}
            <div
              ref={containerRef}
              className="w-full relative origin-top-left overflow-hidden"
              style={{
                height: `${480 * scale}px`, // Dynamic height based on scale
              }}
            >
              <div
                className="origin-top-left absolute top-0 left-0"
                style={{
                  transform: `scale(${scale})`,
                  width: "720px",
                  height: "480px",
                }}
              >
                <RecordCard ref={cardRef} text={recorded.text} date={recorded.date} />
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-8 mt-4">
              <button
                onClick={handleDownload}
                disabled={isExporting}
                className="group relative h-14 sm:h-auto flex items-center justify-center sm:justify-start text-[12px] uppercase tracking-[0.2em] cursor-pointer text-black disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-black/20 rounded-sm hover:text-black/70 transition-colors active:translate-y-px duration-75 ease-out"
                style={{ fontFamily: "var(--font-mono)" }}
                aria-label="Download record as PNG"
              >
                {isExporting ? "Exporting..." : "Download as PNG"}
                <span className="hidden sm:block absolute left-0 bottom-[-4px] w-full h-[1px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ease-out"></span>
              </button>

              <button
                onClick={handleShare}
                disabled={copied}
                className="group relative h-14 sm:h-auto flex items-center justify-center sm:justify-start text-[12px] uppercase tracking-[0.2em] cursor-pointer text-black disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-black/20 rounded-sm hover:text-black/70 transition-colors active:translate-y-px duration-75 ease-out w-full sm:w-[120px]"
                style={{ fontFamily: "var(--font-mono)" }}
                aria-label={copied ? "Link copied" : "Copy link to clipboard"}
              >
                {copied ? "Copied" : "Copy Link"}
                <span className={`hidden sm:block absolute left-0 bottom-[-4px] w-full h-[1px] bg-black transition-transform duration-300 origin-left ease-out ${copied ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </button>

              <button
                onClick={handleReset}
                className="group relative h-14 sm:h-auto flex items-center justify-center sm:justify-start text-[12px] uppercase tracking-[0.2em] cursor-pointer text-[#999999] hover:text-black transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-black/20 rounded-sm active:translate-y-px ease-out"
                style={{ fontFamily: "var(--font-mono)" }}
                aria-label="Record another entry"
              >
                Record another
                <span className="hidden sm:block absolute left-0 bottom-[-4px] w-full h-[1px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ease-out"></span>
              </button>
            </div>

            {/* Hidden export container - STRICT FIX: Off-screen but fully rendered. No opacity/z-index hacks. */}
            <div style={{
              position: "fixed",
              top: "0px",
              left: "-10000px", // Put it far off-screen
              width: "720px",
              height: "480px",
              overflow: "hidden",
              // NO opacity: 0
              // NO visibility: hidden
              // NO display: none
              // NO z-index: -1 (unless necessary, but better to just be off-screen)
            }}>
              <RecordCard ref={exportRef} text={recorded.text} date={recorded.date} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
