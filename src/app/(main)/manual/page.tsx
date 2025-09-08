import { mdToHtml } from "@/lib/md";
import { readIndexMd } from "@/lib/manual";
import SearchClient from "./SearchClient";
import "./manual.css";

export const dynamic = "force-static";

export default async function ManualTOC() {
  const md = await readIndexMd();
  const html = await mdToHtml(md);
  return (
    <main className="manual">
      <header className="manual-bar">
        <h1>CPYU 200HR Manual</h1>
        <a href="/manual/page-001" className="btn">Start reading →</a>
      </header>
      <SearchClient />
      <article dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
