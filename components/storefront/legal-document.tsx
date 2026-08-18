import { LegalDocument as LegalDocumentType } from "@/lib/storefront";

export function LegalDocument({ document }: { document: LegalDocumentType }) {
  return (
    <div className="shell section-space">
      <div className="max-w-4xl space-y-12">
        <div className="space-y-5">
          <p className="eyebrow">Legal</p>
          <h1 className="text-balance text-5xl text-dark sm:text-6xl">{document.title}</h1>
          <p className="max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
            {document.description}
          </p>
        </div>

        <div className="space-y-6">
          {document.sections.map((section) => (
            <section key={section.title} className="surface-card p-6 sm:p-8">
              <h2 className="text-3xl text-dark sm:text-4xl">{section.title}</h2>
              <div className="mt-4 space-y-4 text-base leading-7 text-text-secondary">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
