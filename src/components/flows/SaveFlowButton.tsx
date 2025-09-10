"use client";

interface SaveFlowButtonProps {
  flowName: string;
}

export const SaveFlowButton = ({ flowName }: SaveFlowButtonProps) => {
  const handleSave = () => {
    const now = new Date();
    const slug = (flowName || "untitled")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const timestamp = now
      .toISOString()
      .replace(/[-:]/g, "")
      .slice(0, 15)
      .replace("T", "_");

    const flow = {
      schema: "flow.v1",
      id: crypto.randomUUID(),
      name: flowName || "Untitled Flow",
      timingMode: "pose",
      tts: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      tags: [],
      blocks: [],
    };

    // Persist to localStorage
    try {
      const stored = JSON.parse(localStorage.getItem("flows") || "[]");
      localStorage.setItem("flows", JSON.stringify([...stored, flow]));
    } catch (e) {
      // ignore storage errors
    }

    const blob = new Blob([JSON.stringify(flow, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `flow_${slug}_${timestamp}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleSave} className="btn btn-secondary w-full">
      Save to Device
    </button>
  );
};
