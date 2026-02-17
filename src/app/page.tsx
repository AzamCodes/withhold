"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const EMOJI_REGEX =
  /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu;

function getDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}${m}${d}`; // No dashes for URL ID
}

export default function Home() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [isRecordingState, setIsRecordingState] = useState(false);

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
      const dateStr = getDateString();
      // URL-safe base64: replace + with -, / with _, remove =
      const base64Text = btoa(encodeURIComponent(trimmed))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      const refId = `REF-${dateStr}-${base64Text}`;
      router.push(`/r/${refId}`);
    }, 600);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleRecord();
    }
  }

  return (
    <main className="min-h-[100dvh] px-4 sm:px-0 flex flex-col items-center justify-center p-6 sm:py-32 w-full overflow-x-hidden">
      <div className="w-full max-w-[720px]  flex flex-col items-start gap-12 sm:gap-16">
        {/* Header - Always visible */}
        <div className="w-full flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="sr-only">OMISSION</h1>
            <img src="/image.svg" alt="OMISSION" className="w-[200px] sm:w-[240px]" />
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
        </div>

        {/* Input Area - Persists but disables after recording */}
        <div className="w-full flex flex-col gap-2 transition-opacity duration-300 opacity-100">
          <div className="flex flex-col sm:flex-row w-full sm:items-stretch border border-black transition-colors focus-within:border-black">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Checking notifications"
              maxLength={60}
              disabled={isRecordingState}
              autoComplete="off"
              className="w-full sm:flex-1 bg-transparent px-5 h-14 sm:h-auto text-[clamp(1.1rem,3.5vw,1.3rem)] text-black placeholder:text-[#A8A8A8] placeholder:tracking-[0.15em] placeholder:uppercase border-b sm:border-b-0 sm:border-r border-black/10 focus:outline-none disabled:cursor-not-allowed selection:bg-black selection:text-white"
              style={{
                fontFamily: "var(--font-serif)",
                borderRadius: 0,
              }}
            />

            <button
              onClick={handleRecord}
              disabled={!input.trim() || isRecordingState}
              aria-label="Record action"
              className="w-full sm:w-auto h-14 sm:h-auto px-7 text-[11px] uppercase tracking-[0.2em] font-medium bg-black text-[#FAFAFA] transition-opacity disabled:opacity-50 disabled:cursor-not-allowed active:opacity-90"
              style={{
                fontFamily: "var(--font-mono)",
                borderRadius: 0,
              }}
            >
              {isRecordingState ? "Recording…" : "Record"}
            </button>
          </div>

          <div className="flex justify-between w-full mt-1 px-1 transition-opacity duration-200 opacity-100">
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
      </div>
    </main>
  );
}
