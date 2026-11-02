import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/chrome/Header";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { SignUpButton } from "@/components/marketing/SignUpButton";
import { HeroDemo } from "@/components/marketing/HeroDemo";
import { ACCOUNTS_ENABLED } from "@/lib/features";

export const metadata: Metadata = {
  title: "Learn to type",
  description: "A calm typing practice for students and classrooms, from our.subupee.com.",
};

const PATHS = [
  { href: "/learn", tag: "Learn", title: "Lessons", body: "Grade tracks and starter courses in English, Español, Português, and 9 Indian languages including हिन्दी, বাংলা, தமிழ் and اردو. One passage per lesson." },
  { href: "/tests", tag: "Measure", title: "Tests", body: "Timed tests, page tests, and key drills. Print a certificate for a result you earned." },
  { href: "/games", tag: "Play", title: "Games", body: "Six original games built on the same typing. Clear a word, keep a life, finish the round." },
  { href: "/progress", tag: "Grow", title: "Progress", body: "Speed, accuracy, streaks, and achievements in one history that follows you." },
];

const STEPS = [
  { n: "01", title: "Find your keys", body: "Rest on the home row. F and J have bumps so your fingers know where they are." },
  { n: "02", title: "Type a passage", body: "Each key paints as it goes down. Backspace is forgiveness, not a penalty." },
  { n: "03", title: "Watch it stick", body: "Speed and accuracy build up lesson by lesson, with no leaderboard shouting." },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="content" className="home">
        <section className="page home-hero">
          <div className="home-hero-copy">
            <p className="home-pill">Free for students and classrooms</p>
            <h1 className="home-title">
              Learn to type <span>without looking.</span>
            </h1>
            <p className="lede">
              Lessons, tests, and short games that stay with your hands. Start as a guest and your progress stays on this device until you choose to save it.
            </p>
            <div className="home-actions">
              <Link className="pressable btn btn-primary home-btn-lg" href="/learn">
                Start typing — it&apos;s free
              </Link>
              {ACCOUNTS_ENABLED && (
                <SignUpButton className="pressable btn btn-quiet home-btn-lg">Create an account</SignUpButton>
              )}
            </div>
            <ul className="home-facts">
              <li>No ads beside the passage</li>
              <li>12 typing languages</li>
              <li>Works offline</li>
            </ul>
          </div>
          <HeroDemo />
        </section>

        <section className="page home-section">
          <p className="eyebrow">Everything in one place</p>
          <h2 className="home-h2">Four ways to practice.</h2>
          <div className="home-paths">
            {PATHS.map((p) => (
              <Link key={p.href} href={p.href} className="pressable home-path">
                <span className="home-path-tag">{p.tag}</span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
                <span className="home-path-go">Open {p.title.toLowerCase()} →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="page home-section">
          <p className="eyebrow">How it works</p>
          <h2 className="home-h2">Three steps, every day.</h2>
          <ol className="home-steps">
            {STEPS.map((s) => (
              <li key={s.n}>
                <span className="home-step-n">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="page home-section" id="educators">
          <div className="home-split">
            <div>
              <p className="eyebrow">For educators</p>
              <h2 className="home-h2">A quiet room for focused practice.</h2>
              <p className="home-muted">
                Students can practice as guests. When they create an account, the same progress is kept. School sign-in for Clever and ClassLink appears when a district connects it.
              </p>
            </div>
            <div id="privacy">
              <p className="eyebrow">Privacy</p>
              <h2 className="home-h2">Ask only when the save matters.</h2>
              <p className="home-muted">
                Guest progress lives in this browser. An account is how a result travels to another device. Sounds and read-aloud stay on the machine. We do not sell a typing profile.
              </p>
            </div>
          </div>
        </section>

        <section className="page">
          <div className="home-cta">
            <h2>Your fingers already know more than you think.</h2>
            <p>Take the first lesson in under two minutes.</p>
            <Link className="pressable btn home-btn-lg home-cta-btn" href="/learn">
              Start the first lesson
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
