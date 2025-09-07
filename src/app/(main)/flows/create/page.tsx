import { InteractiveFlowBuilder } from '@/components/flows/InteractiveFlowBuilder';
import React from 'react';

const CreateFlowPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-12">
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-bold text-center mb-8">
          Create a New Yoga Flow
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Use the AI-assisted builder to design your practice. Select a suggested pose to add it to your flow.
        </p>
        <InteractiveFlowBuilder />
      </div>
    </main>
  );
};

export default CreateFlowPage;
