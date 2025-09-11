import { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../../utils/supabaseClient';

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
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToFlow = async () => {
    setIsLoading(true);
    
    try {
      // Get current user - in a real app, this would come from authentication context
      // For now, we'll use localStorage to get or create a user session
      let userId = localStorage.getItem('currentUserId');
      
      if (!userId) {
        // For demo purposes, create a temporary user ID
        userId = 'temp-user-' + Date.now();
        localStorage.setItem('currentUserId', userId);
      }

      // Check if user has a current draft flow, or create one
      let currentFlowId = localStorage.getItem('currentFlowId');
      
      if (!currentFlowId) {
        // Create a new flow
        const { data: flow, error: flowError } = await supabase
          .from('flows')
          .insert({
            user_id: userId,
            name: 'My Flow - ' + new Date().toLocaleDateString(),
            description: 'Flow created from Pose Library',
            duration: 30, // Default duration
            difficulty: 'beginner',
            style: 'hatha',
            focus_areas: ['full-body'],
            is_public: false,
            is_ai_generated: false
          })
          .select()
          .single();

        if (flowError) {
          console.error('Error creating flow:', flowError);
          toast.error('Error creating flow. Please try again.');
          return;
        }

        currentFlowId = flow.id;
        localStorage.setItem('currentFlowId', flow.id);
      }

      // Check if pose is already in the flow
      const { data: existingSequences, error: checkError } = await supabase
        .from('flow_sequences')
        .select('id')
        .eq('flow_id', currentFlowId)
        .eq('pose_id', pose.id);

      if (checkError) {
        console.error('Error checking existing sequences:', checkError);
        toast.error('Error checking flow. Please try again.');
        return;
      }

      if (existingSequences && existingSequences.length > 0) {
        toast(`${pose.name_en} is already in your current flow.`, {
          icon: 'ℹ️',
          duration: 3000,
        });
        return;
      }

      // Get the next order index
      const { data: lastSequence, error: orderError } = await supabase
        .from('flow_sequences')
        .select('order_index')
        .eq('flow_id', currentFlowId)
        .order('order_index', { ascending: false })
        .limit(1);

      if (orderError) {
        console.error('Error getting order index:', orderError);
      }

      const nextOrderIndex = lastSequence && lastSequence.length > 0 
        ? lastSequence[0].order_index + 1 
        : 0;

      // Add pose to flow
      const { error: addError } = await supabase
        .from('flow_sequences')
        .insert({
          flow_id: currentFlowId,
          pose_id: pose.id,
          order_index: nextOrderIndex,
          duration: 30, // Default duration
          instructions: null,
          transition_notes: null
        });

      if (addError) {
        console.error('Error adding pose to flow:', addError);
        toast.error('Error adding pose to flow. Please try again.');
        return;
      }

      // Update localStorage with current flow for quick access
      const currentFlow = JSON.parse(localStorage.getItem('currentFlow') || '[]');
      const updatedFlow = [...currentFlow, pose];
      localStorage.setItem('currentFlow', JSON.stringify(updatedFlow));

      // Dispatch storage event to update flow count in UI
      window.dispatchEvent(new Event('storage'));

      // Show success message
      toast.success(`${pose.name_en} added to your flow! (${updatedFlow.length} poses total)`, {
        duration: 3000,
      });
    } catch (error) {
      console.error('Error adding pose to flow:', error);
      toast.error('Error adding pose to flow. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleAddToFlow}
      disabled={isLoading}
      className={`${isLoading 
        ? 'bg-gray-400 cursor-not-allowed' 
        : 'bg-green-600 hover:bg-green-700'
      } text-white px-3 py-1 rounded text-sm transition-colors ${className}`}
      aria-label={`Add ${pose.name_en} to flow`}
    >
      {isLoading ? 'Adding...' : 'Add to Flow'}
    </button>
  );
}