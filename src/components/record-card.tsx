import { forwardRef } from "react";

interface RecordCardProps {
    text: string;
    date: string;
}

const RecordCard = forwardRef<HTMLDivElement, RecordCardProps>(
    ({ text, date }, ref) => {
        return (
            <div
                ref={ref}
                style={{
                    backgroundColor: "#FAFAFA",
                    color: "#000000",
                    border: "2px solid #000000", // Increased border thickness for export clarity
                    padding: "48px",
                    width: "720px",
                    height: "480px",
                    // Lock typography to specific standard fonts to ensure server/client match if vars fail
                    fontFamily: 'var(--font-serif)',
                    lineHeight: "1.5",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxSizing: "border-box",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    position: "relative",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        marginBottom: "40px",
                        borderBottom: "1px solid #000000",
                        paddingBottom: "16px",
                    }}
                >
                    <p
                        style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: "12px",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            fontWeight: 700,
                            margin: 0,
                            whiteSpace: "nowrap",
                            display: "inline-block",
                        }}
                    >
                        WITHHOLD RECORD
                    </p>
                    <p
                        style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: "12px",
                            letterSpacing: "0.05em",
                            color: "#999999",
                            margin: 0,
                            whiteSpace: "nowrap",
                            display: "inline-block",
                        }}
                    >
                        REF-{date.replace(/-/g, "")}
                    </p>
                </div>

                {/* Main Content */}
                <div style={{ flex: 1 }}>
                    <p
                        style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: "12px",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            marginBottom: "12px",
                            color: "#999999",
                            margin: "0 0 12px 0",
                            whiteSpace: "nowrap",
                        }}
                    >
                        WITHHELD:
                    </p>
                    <p
                        style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: "28px", // Larger for impact
                            lineHeight: "1.2",
                            fontWeight: 400,
                            margin: 0,
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            maxWidth: "100%",
                        }}
                    >
                        {text}
                    </p>
                </div>

                {/* Metadata Grid */}
                <div
                    style={{
                        display: "flex",
                        gap: "48px", // Fixed gap
                        marginTop: "auto",
                        borderTop: "1px solid #000000", // Standardized grid
                        paddingTop: "24px",
                        paddingBottom: "24px",
                    }}
                >
                    <div>
                        <p
                            style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: "10px",
                                letterSpacing: "0.05em",
                                textTransform: "uppercase",
                                color: "#999999",
                                margin: "0 0 4px 0",
                                whiteSpace: "nowrap",
                            }}
                        >
                            RECORDED ON:
                        </p>
                        <p
                            style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: "14px",
                                margin: 0,
                                whiteSpace: "nowrap",
                                fontWeight: 500,
                            }}
                        >
                            {date}
                        </p>
                    </div>
                    <div>
                        <p
                            style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: "10px",
                                letterSpacing: "0.05em",
                                textTransform: "uppercase",
                                color: "#999999",
                                margin: "0 0 4px 0",
                                whiteSpace: "nowrap",
                            }}
                        >
                            FORCE STATUS:
                        </p>
                        <p
                            style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: "14px",
                                margin: 0,
                                whiteSpace: "nowrap",
                                fontWeight: 500,
                            }}
                        >
                            Neutralized
                        </p>
                    </div>
                    <div>
                        <p
                            style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: "10px",
                                letterSpacing: "0.05em",
                                textTransform: "uppercase",
                                color: "#999999",
                                margin: "0 0 4px 0",
                                whiteSpace: "nowrap",
                            }}
                        >
                            OBSERVER:
                        </p>
                        <p
                            style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: "14px",
                                margin: 0,
                                whiteSpace: "nowrap",
                                fontWeight: 500,
                            }}
                        >
                            Unassigned
                        </p>
                    </div>
                </div>

                {/* Footer Notes */}
                <div
                    style={{
                        paddingTop: "0",
                    }}
                >
                    <p
                        style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: "10px",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            color: "#999999",
                            margin: "0 0 4px 0",
                            whiteSpace: "nowrap",
                        }}
                    >
                        NOTES:
                    </p>
                    <p
                        style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: "14px",
                            fontStyle: "italic",
                            color: "#666666",
                            margin: 0,
                            whiteSpace: "nowrap",
                        }}
                    >
                        No further action taken.
                    </p>
                </div>
            </div>
        );
    }
);

RecordCard.displayName = "RecordCard";

export default RecordCard;
