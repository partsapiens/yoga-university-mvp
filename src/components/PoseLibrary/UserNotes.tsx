import { useState, useEffect } from 'react';

interface UserNotesProps {
  poseId: string;
  className?: string;
}

export default function UserNotes({ poseId, className = "" }: UserNotesProps) {
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load notes from localStorage
    const savedNotes = localStorage.getItem(`poseNotes_${poseId}`);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, [poseId]);

  const saveNotes = async (newNotes: string) => {
    setIsSaving(true);
    // Save to localStorage
    localStorage.setItem(`poseNotes_${poseId}`, newNotes);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSaving(false);
  };

  const handleNotesChange = (newNotes: string) => {
    setNotes(newNotes);
    // Debounced save
    clearTimeout((globalThis as any).notesTimeout);
    (globalThis as any).notesTimeout = setTimeout(() => {
      saveNotes(newNotes);
    }, 1000);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 ${className}`}>
      <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">My Notes</h4>
      <textarea
        value={notes}
        onChange={e => handleNotesChange(e.target.value)}
        placeholder="Add your personal notes about this pose..."
        className="w-full border rounded p-2 h-24 resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        aria-label="Personal notes for this pose"
      />
      {isSaving && (
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Saving...
        </div>
      )}
    </div>
  );
}