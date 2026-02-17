import { Metadata } from 'next';
import RecordView from '@/components/record-view';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
    params: { ref: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { ref } = await Promise.resolve(params); // params is async in latest Next.js? Just to be safe.

    return {
        title: 'OMISSION — Record',
        description: 'Record what you didn’t give into.',
        openGraph: {
            title: 'OMISSION — Record',
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
    } catch {
        notFound();
    }

    const formattedDate = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;

    return (
        <main className="min-h-[100dvh] flex flex-col items-center justify-center p-6 sm:p-12 w-full overflow-x-hidden bg-[#FAFAFA]">
            <div className="w-full max-w-[720px] flex flex-col items-start gap-12 sm:gap-16">
                {/* Header */}
                <div className="w-full flex flex-col gap-8">
                    <Link href="/" className="group no-underline text-black flex flex-col gap-8 items-start">
                        <h1 className="sr-only">OMISSION</h1>
                        <img src="/image.svg" alt="OMISSION" className="w-[180px] sm:w-[220px] group-hover:opacity-80 transition-opacity" />
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
                <RecordView text={text} date={formattedDate} />
            </div>
        </main>
    );
}
