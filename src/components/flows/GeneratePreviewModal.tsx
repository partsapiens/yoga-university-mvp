import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { POSES } from '@/lib/yoga-data';
import { PoseId } from '@/types/yoga';

interface GeneratePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  preview: PoseId[] | null;
  onShuffle: () => void;
  onAccept: () => void;
}

export function GeneratePreviewModal({ isOpen, onClose, preview, onShuffle, onAccept }: GeneratePreviewModalProps) {
  if (!isOpen || !preview) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-medium">Proposed sequence</Dialog.Title>
            <Dialog.Close asChild>
              <button aria-label="Close preview" className="rounded-full border border-border h-7 w-7 flex items-center justify-center text-sm">✕</button>
            </Dialog.Close>
          </div>
          <ol className="my-4 max-h-[60vh] list-decimal space-y-1.5 overflow-auto pl-5 text-sm">
            {preview.map((id, i) => {
              const p = POSES.find((x) => x.id === id);
              return <li key={`${id}-${i}`}>{p?.name || id}</li>;
            })}
          </ol>
          <div className="flex items-center justify-end gap-2">
            <button onClick={onShuffle} className="rounded-full border border-border px-4 py-1.5 text-sm hover:bg-accent">Shuffle</button>
            <Dialog.Close asChild>
              <button className="rounded-full border border-border px-4 py-1.5 text-sm hover:bg-accent">Cancel</button>
            </Dialog.Close>
            <button onClick={onAccept} className="rounded-full bg-primary px-4 py-1.5 text-sm text-primary-foreground hover:bg-primary/90">
              Use this
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
