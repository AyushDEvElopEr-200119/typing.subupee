import Link from "next/link";
import { BrandLogo } from "./BrandLogo";

export function SiteFooter() {
  return (
    <footer className="site-footer no-print">
      <Link href="/" className="wordmark" aria-label="Subupee Typing home">
        <BrandLogo />
      </Link>
      <nav className="footer-links" aria-label="Footer">
        <Link href="/learn">Lessons</Link>
        <Link href="/tests">Tests</Link>
        <Link href="/games">Games</Link>
        <Link href="/progress">Progress</Link>
        <Link href="/#privacy">Privacy</Link>
      </nav>
      <span>our.subupee.com</span>
    </footer>
  );
}
