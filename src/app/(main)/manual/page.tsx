"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type PageContent = { img?: string; text: string };
type Manifest = {
  title: string;
  pages: number;
  files: { i: number; file: string; chars: number; sha1: string }[];
};

export default function ManualViewer() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [page, setPage] = useState<number>(1);
  const [content, setContent] = useState<PageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cache, setCache] = useState<Record<number, PageContent>>({});

  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize page from URL search param or localStorage
  useEffect(() => {
    const pageFromQuery = searchParams.get("page");
    const initialPage = Number(pageFromQuery);
    if (initialPage > 0) {
      setPage(initialPage);
    } else {
      const savedPage = Number(globalThis.localStorage?.getItem("manual:lastPage") || "1");
      setPage(savedPage > 0 ? savedPage : 1);
    }
  }, [searchParams]);

  // Fetch manifest on component mount
  useEffect(() => {
    fetch("/manual/manifest.json")
      .then(res => {
        if (!res.ok) throw new Error('Manifest file not found. Please run the "prepare:manual" script.');
        return res.json();
      })
      .then(setManifest)
      .catch(err => setError(err.message));
  }, []);

  const loadPage = useCallback(async (i: number, manifestData: Manifest) => {
    if (cache[i]) {
      setContent(cache[i]);
      return;
    }
    setIsLoading(true);
    try {
      const pageInfo = manifestData.files.find(p => p.i === i);
      if (!pageInfo) throw new Error(`Page ${i} not found in manifest.`);

      const res = await fetch(`/manual/${pageInfo.file}`);
      if (!res.ok) throw new Error(`Failed to load page content for page ${i}`);

      const text = await res.text();
      const newContent = { text };

      setCache(prev => ({ ...prev, [i]: newContent }));
      setContent(newContent);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [cache]);

  // Effect to handle page changes, fetching, and pre-fetching
  useEffect(() => {
    if (!manifest) return;

    const totalPages = manifest.pages;
    const clampedPage = Math.max(1, Math.min(page, totalPages));

    if (clampedPage !== page) {
      setPage(clampedPage);
      return;
    }

    router.replace(`/manual?page=${clampedPage}`, { scroll: false });
    globalThis.localStorage?.setItem("manual:lastPage", String(clampedPage));
    loadPage(clampedPage, manifest);

    // Preload neighbors
    [clampedPage - 1, clampedPage + 1].forEach(i => {
      if (i >= 1 && i <= totalPages && !cache[i]) {
        const pageInfo = manifest.files.find(p => p.i === i);
        if (pageInfo) {
          fetch(`/manual/${pageInfo.file}`)
            .then(r => r.text())
            .then(text => {
              setCache(prev => ({ ...prev, [i]: { text } }));
            });
        }
      }
    });

  }, [page, manifest, router, loadPage, cache]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setPage(p => Math.min(p + 1, manifest?.pages || p));
      } else if (e.key === 'ArrowLeft') {
        setPage(p => Math.max(p - 1, 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [manifest?.pages]);

  const totalPages = manifest?.pages || 1;
  const goToPage = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-500">{error}</div>
  }

  return (
    <main className="mx-auto max-w-4xl p-4">
      <header className="flex items-center justify-between gap-4 mb-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
        <h1 className="font-bold text-lg">{manifest?.title || "Manual"}</h1>
        <div className="flex items-center gap-2">
          <Button onClick={() => goToPage(page - 1)} disabled={page <= 1} variant="outline" size="sm">◀ Prev</Button>
          <Input
            type="number"
            min={1}
            max={totalPages}
            value={page}
            onChange={e => goToPage(Number(e.target.value || 1))}
            className="w-20 text-center"
            aria-label="Current Page"
          />
          <span className="text-muted-foreground">/ {totalPages}</span>
          <Button onClick={() => goToPage(page + 1)} disabled={page >= totalPages} variant="outline" size="sm">Next ▶</Button>
        </div>
      </header>

      <div className="p-4 border rounded-lg min-h-[60vh]">
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading Page {page}…</p>
        ) : (
          <article>
            {/* The user requested to skip images for v1, so we only render text */}
            {content?.text && (
              <pre className="whitespace-pre-wrap font-sans text-lg leading-relaxed">{content.text}</pre>
            )}
          </article>
        )}
      </div>
    </main>
  );
}
