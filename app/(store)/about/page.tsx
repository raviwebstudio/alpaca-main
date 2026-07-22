import type { Metadata } from "next";
import { SectionHeading } from "@/components/storefront/section-heading";
import { reasons } from "@/lib/storefront";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn the brand story behind ALPACA and the design principles shaping its premium essentials.",
};

const principles = [
  "Design fewer, better silhouettes.",
  "Focus on weight, touch, and proportion.",
  "Keep the wardrobe calm so movement feels effortless.",
];

export default function AboutPage() {
  return (
    <div className="shell section-space space-y-16">
      <SectionHeading
        eyebrow="About ALPACA"
        title="A fashion brand built around pace, softness, and restraint."
        description="ALPACA was imagined as a quieter answer to fast-moving wardrobes: premium pieces that still feel light in motion."
      />

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface-card rounded-[32px] p-8 sm:p-10">
          <h2 className="text-4xl text-dark sm:text-5xl">The story</h2>
          <div className="mt-5 space-y-5 text-base leading-8 text-text-secondary sm:text-lg">
            <p>
              ALPACA began with a simple observation: most essentials are either functional and
              forgettable or expressive and exhausting. We wanted a third option.
            </p>
            <p>
              The brand centers on premium fabrics, deliberate silhouettes, and a palette that
              feels composed from morning to night. Every piece is intended to move easily through
              transit, work, travel, and time off.
            </p>
            <p>
              The result is a wardrobe with less noise and more presence. Clean design, strong
              drape, and a little extra room to breathe.
            </p>
          </div>
        </div>

        <div className="surface-card rounded-[32px] p-8 sm:p-10">
          <p className="eyebrow">Principles</p>
          <div className="mt-6 grid gap-4">
            {principles.map((principle, index) => (
              <div key={principle} className="rounded-[24px] border border-line bg-background px-5 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-secondary">
                  0{index + 1}
                </p>
                <p className="mt-3 text-2xl text-dark">{principle}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {reasons.map((reason) => (
          <div key={reason.title} className="surface-card rounded-[28px] p-6">
            <h3 className="text-3xl text-dark">{reason.title}</h3>
            <p className="mt-3 text-sm leading-7 text-text-secondary">{reason.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
