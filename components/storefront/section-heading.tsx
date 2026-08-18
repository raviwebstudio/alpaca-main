type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "mx-auto text-center" : "";

  return (
    <div className={`space-y-4 ${alignment}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="text-balance text-4xl text-dark sm:text-5xl">{title}</h2>
      {description ? (
        <p className="max-w-2xl text-base text-text-secondary sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
