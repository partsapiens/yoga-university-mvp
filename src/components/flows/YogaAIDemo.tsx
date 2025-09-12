import React, { useState } from 'react';
import { Loader2, Sparkles, Clock, Target, User } from 'lucide-react';

interface GeneratedPose {
  name: string;
  duration: string;
  description: string;
  modification?: string;
}

interface GeneratedFlow {
  poses: GeneratedPose[];
}

const YogaFlowGenerator = () => {
  const [preferences, setPreferences] = useState({
    duration: 30,
    level: 'beginner',
    focus: 'flexibility',
    injuries: []
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFlow, setGeneratedFlow] = useState<GeneratedFlow | null>(null);

  const generateFlow = async () => {
    setIsGenerating(true);
    
    try {
      // This would call your backend API that interfaces with OpenAI
      const response = await fetch('/api/ai/generateFlow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences)
      });
      
      const flow = await response.json();
      setGeneratedFlow(flow);
    } catch (error) {
      console.error('Error generating flow:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
          <Sparkles className="text-purple-600" />
          ✨ Yoga Flow Generator
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Create personalized yoga sequences tailored to your needs and goals
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Preferences Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Practice Duration
            </label>
            <select
              value={preferences.duration}
              onChange={(e) => setPreferences({...preferences, duration: parseInt(e.target.value)})}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
              <option value={90}>90 minutes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              Experience Level
            </label>
            <select
              value={preferences.level}
              onChange={(e) => setPreferences({...preferences, level: e.target.value})}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Primary Focus
            </label>
            <select
              value={preferences.focus}
              onChange={(e) => setPreferences({...preferences, focus: e.target.value})}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="flexibility">Flexibility</option>
              <option value="strength">Strength</option>
              <option value="balance">Balance</option>
              <option value="relaxation">Relaxation</option>
              <option value="core">Core Strength</option>
              <option value="backbends">Backbends</option>
              <option value="hip_openers">Hip Openers</option>
            </select>
          </div>

          <button
            onClick={generateFlow}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Flow...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate ✨ Flow
              </>
            )}
          </button>
        </div>

        {/* Generated Flow Display */}
        <div className="bg-gray-50 rounded-lg p-6">
          {generatedFlow ? (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Your Personalized Flow
              </h3>
              <div className="space-y-4">
                {generatedFlow.poses?.map((pose, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-800">{pose.name}</h4>
                      <span className="text-sm text-purple-600 font-medium">
                        {pose.duration}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{pose.description}</p>
                    {pose.modification && (
                      <p className="text-xs text-blue-600 italic">
                        Modification: {pose.modification}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                Your ✨-generated yoga flow will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const YogaChatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your ✨ yoga assistant. Ask me about poses, sequences, yoga philosophy, or any practice questions you have!'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // This would call your backend API
      const response = await fetch('/api/ai/manual-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: inputMessage,
          history: messages.slice(-10) // Send last 10 messages for context
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant' as const, content: data.response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant' as const, 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">✨ Yoga Assistant</h2>
      
      <div className="h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about yoga poses, philosophy, or practice tips..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <button
          onClick={sendMessage}
          disabled={!inputMessage.trim() || isTyping}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default function YogaAIDemo() {
  const [activeTab, setActiveTab] = useState('generator');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Yoga Platform
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your yoga practice with personalized flows and intelligent assistance
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveTab('generator')}
              className={`px-6 py-2 rounded-md transition-all ${
                activeTab === 'generator'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Flow Generator
            </button>
            <button
              onClick={() => setActiveTab('chatbot')}
              className={`px-6 py-2 rounded-md transition-all ${
                activeTab === 'chatbot'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              AI Assistant
            </button>
          </div>
        </div>

        {activeTab === 'generator' && <YogaFlowGenerator />}
        {activeTab === 'chatbot' && <YogaChatbot />}
      </div>
    </div>
  );
}