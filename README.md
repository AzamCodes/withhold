# OMISSION

### Record what you didn't give into.

A minimalist, no-database web application for logging acts of restraint.

---

## Philosophy

OMISSION is built on the principle that what we **don't** do is often as defining as what we do. It provides a simple, distraction-free space to document moments of resistance against impulses, distractions, or habits.

## Features

- **No Accounts**: Fully anonymous. No sign-up required.
- **No Database**: Your data is yours. Records are generated client-side or encoded in shareable URLs.
- **Micro-Interactions**: Tactile, intentional UI elements designed to respect your attention.
- **Deterministic Export**: Generate pixel-perfect PNG cards (720x480px) for your personal archive.
- **Immutable Sharing**: Share records via unique, stateless links.
- **Strict Design System**: Institutional typography (Times New Roman, Courier New) and monochromatic palette.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Typography**: `next/font` (Playfair Display, IBM Plex Mono)
- **Image Generation**: `@vercel/og` for social previews, `html-to-image` for client-side exports.

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/omission.git
    cd omission
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

4.  **Open locally**:
    Navigate to [http://localhost:3000](http://localhost:3000).

## License

This project is open source and available under the [MIT License](LICENSE).
