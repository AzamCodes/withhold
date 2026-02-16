import { toPng } from "html-to-image";

export async function downloadCardAsPng(
    node: HTMLElement,
    filename = "withhold-record.png"
): Promise<void> {
    // Wait for fonts to be ready
    await document.fonts.ready;

    // Manually extract font-face rules to bypass html-to-image internal scraping bug
    // which fails on some next/font configurations ("font is undefined" error)
    const fontEmbedCSS = await (async () => {
        try {
            const rules: string[] = [];
            // Iterate through all stylesheets
            for (const sheet of Array.from(document.styleSheets)) {
                try {
                    // Accessing cssRules can throw security errors for cross-origin sheets
                    const cssRules = sheet.cssRules;
                    if (!cssRules) continue;

                    for (const rule of Array.from(cssRules)) {
                        // Check if it's a font-face rule
                        if (rule instanceof CSSFontFaceRule) {
                            const style = rule.style;
                            // IMPORTANT: Only include rules with a valid font-family
                            if (style && style.fontFamily) {
                                rules.push(rule.cssText);
                            }
                        }
                    }
                } catch {
                    // Ignore errors accessing cross-origin stylesheets
                    continue;
                }
            }
            return rules.join('\n');
        } catch (e) {
            console.warn("Failed to extract fonts manually", e);
            return undefined; // Fallback to default behavior if extraction fails
        }
    })();

    const dataUrl = await toPng(node, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#FAFAFA",
        width: 720, // Explicitly set width to match the card's fixed width
        height: 480, // Explicitly set height to match the card's fixed height
        fontEmbedCSS: fontEmbedCSS, // Inject manually extracted fonts
        style: {
            transform: "scale(1)", // Ensure no scaling transforms affect the export
            transformOrigin: "top left",
        }
    });

    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
}
