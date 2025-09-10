interface Pose {
  id: string;
  name_en: string;
  slug: string;
}

interface AddToFlowButtonProps {
  pose: Pose;
  className?: string;
}

export default function AddToFlowButton({ pose, className = "" }: AddToFlowButtonProps) {
  const handleAddToFlow = () => {
    // Get current flow from localStorage or create new one
    const currentFlow = JSON.parse(localStorage.getItem('currentFlow') || '[]');
    
    // Add pose to flow if not already present
    if (!currentFlow.find((p: Pose) => p.id === pose.id)) {
      const updatedFlow = [...currentFlow, pose];
      localStorage.setItem('currentFlow', JSON.stringify(updatedFlow));
      
      // Show confirmation (could be replaced with toast notification)
      alert(`${pose.name_en} added to your flow!`);
    } else {
      alert(`${pose.name_en} is already in your flow.`);
    }
  };

  return (
    <button 
      onClick={handleAddToFlow}
      className={`bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors ${className}`}
      aria-label={`Add ${pose.name_en} to flow`}
    >
      Add to Flow
    </button>
  );
}