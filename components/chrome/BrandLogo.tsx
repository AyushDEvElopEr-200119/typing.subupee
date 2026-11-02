/* eslint-disable @next/next/no-img-element */

/**
 * The Subupee Typing logo. Two images are rendered and CSS shows the one that fits the
 * current background: the original on light themes, a light-lettered copy on dark ones.
 * `tone="light"` always uses the original (for printed pages such as certificates).
 */
export function BrandLogo({ className = "", tone = "auto" }: { className?: string; tone?: "auto" | "light" }) {
  return (
    <span className={`brand-logo ${tone === "light" ? "brand-logo-fixed" : ""} ${className}`}>
      <img src="/brand/subupee-logo.webp" alt="Subupee Typing" width={960} height={264} className="brand-logo-light" />
      {tone === "auto" && (
        <img src="/brand/subupee-logo-dark.webp" alt="" aria-hidden width={960} height={264} className="brand-logo-dark" />
      )}
    </span>
  );
}
