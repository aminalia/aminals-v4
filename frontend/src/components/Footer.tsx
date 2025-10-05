import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="container mt-auto mx-auto px-4 py-12">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground text-sm">
          &lt;3 Collaboration Monster 2025
        </p>
        <div className="flex space-x-8">
          <Link
            href="/about"
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            About
          </Link>
          <a
            href="https://github.com/aminalia/aminals-v2"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
