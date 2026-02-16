import { Metadata } from 'next';
import RecordCard from '../../../components/record-card';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
    params: { ref: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { ref } = await Promise.resolve(params); // params is async in latest Next.js? Just to be safe.

    return {
        title: 'WITHHOLD — Record',
        description: 'Record what you didn’t give into.',
        openGraph: {
            title: 'WITHHOLD — Record',
            description: 'Record what you didn’t give into.',
            images: [
                {
                    url: `/api/og?ref=${ref}`,
                    width: 1200,
                    height: 630,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
        },
    };
}

export default async function RecordPage({ params }: Props) {
    const { ref } = await Promise.resolve(params);
    const parts = ref.split('-');

    if (parts.length < 3 || parts[0] !== 'REF') {
        notFound();
    }

    const dateStr = parts[1];
    const base64Text = parts.slice(2).join('-');
    let text = '';
    try {
        text = decodeURIComponent(atob(base64Text));
    } catch {
        notFound();
    }

    const formattedDate = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;

    return (
        <main className="min-h-[100dvh] flex flex-col items-center justify-center p-6 sm:p-12 w-full overflow-x-hidden bg-[#FAFAFA]">
            <div className="w-full max-w-[720px] flex flex-col items-start gap-12 sm:gap-16">
                {/* Header */}
                <div className="w-full flex flex-col gap-2">
                    <Link href="/" className="no-underline text-black">
                        <h1
                            className="font-bold tracking-[-0.02em] leading-none"
                            style={{
                                fontFamily: "var(--font-serif)",
                                fontSize: "clamp(3rem, 5vw + 1rem, 5rem)",
                            }}
                        >
                            WITHHOLD
                        </h1>
                    </Link>
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

                {/* Card */}
                <div className="w-full flex flex-col gap-8">
                    <div className="w-full relative scale-[0.5] sm:scale-100 origin-top-left sm:origin-center" style={{ width: '720px', maxWidth: '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
                        <div style={{ pointerEvents: 'none' }}>
                            <RecordCard text={text} date={formattedDate} />
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-[-200px] sm:mt-4 pl-1">
                        <Link href="/" className="group relative h-14 sm:h-auto flex items-center justify-center sm:justify-start text-[14px] uppercase tracking-[0.2em] cursor-pointer text-black hover:text-black/70 transition-colors" style={{ fontFamily: "var(--font-mono)" }}>
                            Record your own
                            <span className="hidden sm:block absolute left-0 bottom-[-4px] w-full h-[1px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ease-out"></span>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
