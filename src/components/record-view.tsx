"use client";

import { useState, useRef, useEffect } from "react";
import RecordCard from "@/components/record-card";
import Link from "next/link";
import { downloadCardAsPng } from "@/lib/export";

interface RecordViewProps {
    text: string;
    date: string;
}

export default function RecordView({ text, date }: RecordViewProps) {
    const [copied, setCopied] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const exportRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [scale, setScale] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function updateScale() {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const cardWidth = 720;
                const newScale = Math.min(containerWidth / cardWidth, 1);
                setScale(newScale);
            }
        }

        updateScale();
        const observer = new ResizeObserver(updateScale);
        if (containerRef.current) observer.observe(containerRef.current);
        window.addEventListener("resize", updateScale);

        return () => {
            window.removeEventListener("resize", updateScale);
            observer.disconnect();
        };
    }, []);

    async function handleDownload() {
        if (!exportRef.current || isExporting) return;
        setIsExporting(true);
        try {
            await downloadCardAsPng(exportRef.current);
        } finally {
            setIsExporting(false);
        }
    }

    function handleShare() {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
            console.error("Failed to copy link");
        });
    }

    return (
        <div className="w-full flex flex-col gap-8 animate-in fade-in duration-500 ease-out fill-mode-forwards">
            <div
                ref={containerRef}
                className="w-full relative origin-top-left overflow-hidden"
                style={{
                    height: `${480 * scale}px`,
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
                    <RecordCard ref={cardRef} text={text} date={date} />
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-8 mt-4">
                <button
                    onClick={handleDownload}
                    disabled={isExporting}
                    className="group relative h-14 sm:h-auto flex items-center justify-center sm:justify-start text-[12px] uppercase tracking-[0.2em] cursor-pointer text-black disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-black/20 rounded-sm hover:text-black/70 transition-colors active:translate-y-px duration-75 ease-out"
                    style={{ fontFamily: "var(--font-mono)" }}
                >
                    {isExporting ? "Exporting..." : "Download as PNG"}
                    <span className="hidden sm:block absolute left-0 bottom-[-4px] w-full h-[1px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ease-out"></span>
                </button>

                <button
                    onClick={handleShare}
                    disabled={copied}
                    className="group relative h-14 sm:h-auto flex items-center justify-center sm:justify-start text-[12px] uppercase tracking-[0.2em] cursor-pointer text-black disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-black/20 rounded-sm hover:text-black/70 transition-colors active:translate-y-px duration-75 ease-out w-full sm:w-[120px]"
                    style={{ fontFamily: "var(--font-mono)" }}
                >
                    {copied ? "Copied" : "Copy Link"}
                    <span className={`hidden sm:block absolute left-0 bottom-[-4px] w-full h-[1px] bg-black transition-transform duration-300 origin-left ease-out ${copied ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                </button>

                <Link
                    href="/"
                    className="group relative h-14 sm:h-auto flex items-center justify-center sm:justify-start text-[12px] uppercase tracking-[0.2em] cursor-pointer text-[#999999] hover:text-black transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-black/20 rounded-sm active:translate-y-px ease-out"
                    style={{ fontFamily: "var(--font-mono)" }}
                >
                    Record new
                    <span className="hidden sm:block absolute left-0 bottom-[-4px] w-full h-[1px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ease-out"></span>
                </Link>
            </div>

            <div style={{
                position: "fixed",
                top: "0px",
                left: "-10000px",
                width: "720px",
                height: "480px",
                overflow: "hidden",
            }}>
                <RecordCard ref={exportRef} text={text} date={date} />
            </div>
        </div>
    );
}
