import Link from "next/link";

export default function NotFound() {
  return (
    <main className="shell section-space">
      <div className="surface-card rounded-[32px] px-6 py-20 text-center sm:px-10">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 text-5xl text-dark sm:text-6xl">That page moved faster than we did.</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
          The link you followed does not point to an available page right now. Head back to the
          storefront and keep exploring the ALPACA collection.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full border border-dark bg-dark px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
