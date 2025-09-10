"use client";

interface SaveFlowButtonProps {
  flowName: string;
}

export const SaveFlowButton = ({ flowName }: SaveFlowButtonProps) => {
  const handleSave = () => {
    const flow = {
      schema: "flow.v1",
      id: crypto.randomUUID(),
      name: flowName || "Untitled Flow",
      timingMode: "pose",
      tts: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      blocks: [],
    };

    const blob = new Blob([JSON.stringify(flow, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${flow.name}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleSave} className="btn btn-secondary w-full">
      Save to Device
    </button>
  );
};
