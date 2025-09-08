import toast from 'react-hot-toast';

export function toastSuccess(message: string) {
  toast.success(message, {
    duration: 2000,
    position: 'bottom-center',
  });
}

export function toastError(message: string) {
  toast.error(message, {
    duration: 3000,
    position: 'bottom-center',
  });
}

// The speak function will be conditional on a user setting passed to it.
export function speak(message: string, voiceFeedbackEnabled: boolean) {
  if (!voiceFeedbackEnabled || typeof window === 'undefined' || !window.speechSynthesis) {
    return;
  }

  // Keep messages short and cancel previous speech.
  const utterance = new SpeechSynthesisUtterance(message);
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}
