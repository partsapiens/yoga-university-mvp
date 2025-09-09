import React, { useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { useSpeechRecognition } from '@/lib/voice/useSpeechRecognition';
import { parseTranscript } from '@/lib/voice/nlu';
import { executeIntent, AppContext } from '@/lib/voice/capability-registry';
import { toastSuccess, toastError, speak } from '@/lib/voice/feedback';
import { CommandConsole, CommandLog } from './CommandConsole';

interface VoiceAssistantPopupProps {
  isOpen: boolean;
  onClose: () => void;
  appContext: AppContext;
  voiceFeedbackOn: boolean;
  logs: CommandLog[];
  addLog: (log: CommandLog) => void;
  onCommand: (command: string) => void;
}

export function VoiceAssistantPopup({
  isOpen, onClose, appContext, voiceFeedbackOn, logs, addLog, onCommand
}: VoiceAssistantPopupProps) {
  const speech = useSpeechRecognition();

  useEffect(() => {
    if (isOpen && speech.supported && !speech.listening) {
      speech.start();
    }
  }, [isOpen, speech.supported, speech.listening]);

  useEffect(() => {
    const process = async () => {
      if (speech.transcript) {
        const intent = parseTranscript(speech.transcript);
        if (!intent) {
          toastError("I didn't understand that command.");
          addLog({ id: new Date().toISOString(), transcript: speech.transcript, feedback: "Unknown command" });
          return;
        }
        const feedback = await executeIntent(intent, appContext);
        speak(feedback, voiceFeedbackOn);
        toastSuccess(feedback);
        addLog({ id: new Date().toISOString(), transcript: speech.transcript, feedback });
      }
    };
    process();
  }, [speech.transcript, appContext, voiceFeedbackOn, addLog]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6 shadow-xl"
        >
          {speech.supported ? (
            <div className="flex items-center gap-4">
              <div className={cn("flex h-16 w-16 items-center justify-center rounded-full bg-muted text-3xl transition-colors", speech.listening && "bg-primary/20")}>
                {speech.listening ? <span className="animate-pulse">🤖</span> : '🤖'}
              </div>
              <div className="flex-1">
                <Dialog.Title className="font-semibold text-lg">{speech.listening ? "Listening..." : "Voice Assistant"}</Dialog.Title>
                <p className={cn("h-6 text-muted-foreground transition-colors", speech.listening && "text-primary")}>{speech.interimTranscript || speech.transcript || "Say a command..."}</p>
              </div>
            </div>
          ) : (
            <CommandConsole logs={logs} onCommand={onCommand} show={true} isPopupVersion={true} />
          )}
          <Dialog.Close asChild>
            <button className="absolute top-4 right-4 rounded-full border border-border h-7 w-7 flex items-center justify-center text-sm" aria-label="Close">✕</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
