import { notFound } from "next/navigation";
import { mdToHtml } from "@/lib/md";
import { listPages, readPage } from "@/lib/manual";
import "../manual.css";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const files = await listPages();
  return files.map(({ slug }) => ({ slug }));
}

export default async function ManualPage({ params }: { params: { slug: string } }) {
  const pages = await listPages();
  const idx = pages.findIndex(p => p.slug === params.slug);
  if (idx === -1) return notFound();

  const md = await readPage(params.slug);
  const html = await mdToHtml(md);

  // derive prev/next if you want custom buttons on top too:
  const prev = idx > 0 ? `/manual/${pages[idx - 1].slug}` : null;
  const next = idx < pages.length - 1 ? `/manual/${pages[idx + 1].slug}` : null;

  return (
    <main className="manual">
      <header className="manual-bar">
        <a href="/manual" className="btn">← TOC</a>
        <div className="spacer" />
        {prev && <a className="btn" href={prev}>← Prev</a>}
        {next && <a className="btn primary" href={next}>Next →</a>}
      </header>
      <article dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
