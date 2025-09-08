import { useEffect, useState } from "react";
import type { SavedFlow, PoseId } from "@/types/yoga";

export function useSavedFlows(persist: boolean) {
  const [saved, setSaved] = useState<SavedFlow[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem("yoga_saved_flows");
      const parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((f: any) =>
        typeof f?.id === "string" &&
        typeof f?.name === "string" &&
        Array.isArray(f?.flow) &&
        f.flow.every((id: any) => Object.values(PoseId).includes(id)) &&
        typeof f?.overrides === "object"
      );
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (!persist || typeof window === "undefined") return;
    try {
      localStorage.setItem("yoga_saved_flows", JSON.stringify(saved));
    } catch (e) {
      console.error("Failed to save flows to localStorage", e);
    }
  }, [persist, saved]);

  return { saved, setSaved };
}

