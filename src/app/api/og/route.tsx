import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const ref = searchParams.get('ref');

        if (!ref) {
            return new Response('Missing ref', { status: 400 });
        }

        // Decode ref: REF-{date}-{base64}
        // Example: REF-20260217-U29tZSB0ZXh0
        const parts = ref.split('-');
        // parts[0] = REF
        // parts[1] = date (YYYYMMDD)
        // parts[2] = base64 text
        // Handles if date is formatted differently? The generation uses date.replace(/-/g, ""), so it is YYYYMMDD.

        // Validation
        if (parts.length < 3 || parts[0] !== 'REF') {
            return new Response('Invalid ref', { status: 400 });
        }

        const dateStr = parts[1]; // YYYYMMDD
        // Reformat date to YYYY-MM-DD for display
        const formattedDate = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;

        let base64Text = parts.slice(2).join('-');

        // Restore standard base64 from URL-safe variants
        base64Text = base64Text.replace(/-/g, '+').replace(/_/g, '/');

        // Pad with = if needed
        while (base64Text.length % 4) {
            base64Text += '=';
        }

        let text = '';
        try {
            text = decodeURIComponent(atob(base64Text));
        } catch (e) {
            return new Response('Invalid encoding', { status: 400 });
        }

        // Fonts
        // We need to load fonts for OG to look perfect.
        // Ideally we fetch them. For now, we'll try to use standard fonts or fetch if possible.
        // The visual requirement is "Font-accurate". 
        // "Times New Roman" and "Courier New".
        // Verce OG supports loading fonts.

        // Since we can't easily fetch local font files in this environment without setup, 
        // and standard system fonts aren't available in Edge, we usually need to fetch a font URL.
        // For this context, I will attempt to fetch Google Fonts if allowed, or fallback.
        // user constraints: "Font-accurate".
        // I will try to fetch standardized fonts.

        const serifData = await fetch(new URL('https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtM.woff2', import.meta.url)).then((res) => res.arrayBuffer());
        const monoData = await fetch(new URL('https://fonts.gstatic.com/s/ibmplexmono/v19/-F63f_kmnyXVU6gD12nT9a8Q.woff2', import.meta.url)).then((res) => res.arrayBuffer());

        return new ImageResponse(
            (
                <div
                    style={{
                        backgroundColor: '#FAFAFA',
                        color: '#000000',
                        width: '1200px',
                        height: '630px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '80px',
                    }}
                >
                    {/* Card Container Scaled */}
                    <div
                        style={{
                            backgroundColor: "#FAFAFA",
                            color: "#000000",
                            border: "3px solid #000000", // Thicker for OG size
                            padding: "60px",
                            width: "100%",
                            height: "100%",
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
                                borderBottom: "2px solid #000000",
                                paddingBottom: "20px",
                                width: '100%',
                            }}
                        >
                            <p
                                style={{
                                    fontFamily: '"IBM Plex Mono"',
                                    fontSize: "24px",
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    fontWeight: 700,
                                    margin: 0,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                OMISSION RECORD
                            </p>
                            <p
                                style={{
                                    fontFamily: '"IBM Plex Mono"',
                                    fontSize: "24px",
                                    letterSpacing: "0.05em",
                                    color: "#999999",
                                    margin: 0,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                REF-{dateStr}
                            </p>
                        </div>

                        {/* Main Content */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <p
                                style={{
                                    fontFamily: '"IBM Plex Mono"',
                                    fontSize: "20px",
                                    letterSpacing: "0.05em",
                                    textTransform: "uppercase",
                                    marginBottom: "20px",
                                    color: "#999999",
                                    margin: "0 0 20px 0",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                OMITTED:
                            </p>
                            <p
                                style={{
                                    fontFamily: '"Playfair Display"',
                                    fontSize: "48px",
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
                                gap: "60px",
                                marginTop: "auto",
                                borderTop: "2px solid #000000",
                                paddingTop: "30px",
                                paddingBottom: "30px",
                                width: '100%',
                            }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <p
                                    style={{
                                        fontFamily: '"IBM Plex Mono"',
                                        fontSize: "16px",
                                        letterSpacing: "0.05em",
                                        textTransform: "uppercase",
                                        color: "#999999",
                                        margin: "0 0 8px 0",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    RECORDED ON:
                                </p>
                                <p
                                    style={{
                                        fontFamily: '"IBM Plex Mono"',
                                        fontSize: "20px",
                                        margin: 0,
                                        whiteSpace: "nowrap",
                                        fontWeight: 500,
                                    }}
                                >
                                    {formattedDate}
                                </p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <p
                                    style={{
                                        fontFamily: '"IBM Plex Mono"',
                                        fontSize: "16px",
                                        letterSpacing: "0.05em",
                                        textTransform: "uppercase",
                                        color: "#999999",
                                        margin: "0 0 8px 0",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    FORCE STATUS:
                                </p>
                                <p
                                    style={{
                                        fontFamily: '"IBM Plex Mono"',
                                        fontSize: "20px",
                                        margin: 0,
                                        whiteSpace: "nowrap",
                                        fontWeight: 500,
                                    }}
                                >
                                    Neutralized
                                </p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <p
                                    style={{
                                        fontFamily: '"IBM Plex Mono"',
                                        fontSize: "16px",
                                        letterSpacing: "0.05em",
                                        textTransform: "uppercase",
                                        color: "#999999",
                                        margin: "0 0 8px 0",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    OBSERVER:
                                </p>
                                <p
                                    style={{
                                        fontFamily: '"IBM Plex Mono"',
                                        fontSize: "20px",
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
                                marginBottom: "0",
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <p
                                style={{
                                    fontFamily: '"IBM Plex Mono"',
                                    fontSize: "16px",
                                    letterSpacing: "0.05em",
                                    textTransform: "uppercase",
                                    color: "#999999",
                                    margin: "0 0 8px 0",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                NOTES:
                            </p>
                            <p
                                style={{
                                    fontFamily: '"Playfair Display"',
                                    fontSize: "20px",
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
                </div>
            ),
            {
                width: 1200,
                height: 630,
                fonts: [
                    {
                        name: 'Playfair Display',
                        data: serifData,
                        style: 'normal',
                    },
                    {
                        name: 'IBM Plex Mono',
                        data: monoData,
                        style: 'normal',
                    },
                ],
            },
        );
    } catch (error) {
        if (error instanceof Error) {
            console.log(`${error.message}`);
        }
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
