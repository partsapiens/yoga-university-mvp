'use client';

import React, { useState } from 'react';
import { Brain, Check, X, RotateCcw, Trophy, BookOpen } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topic: string;
}

interface QuizGeneratorProps {
  className?: string;
}

export default function QuizGenerator({ className = '' }: QuizGeneratorProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizConfig, setQuizConfig] = useState({
    topic: '',
    difficulty: 'intermediate' as 'beginner' | 'intermediate' | 'advanced',
    questionCount: 5
  });

  const generateQuiz = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/manual-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizConfig),
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }

      const data = await response.json();
      setQuestions(data.questions);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setShowResults(false);
    } catch (error) {
      console.error('Error generating quiz:', error);
      // Show error state
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResults) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answerIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const resetQuiz = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  const getScore = () => {
    let correct = 0;
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return { correct, total: questions.length };
  };

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = currentQuestion ? selectedAnswers[currentQuestion.id] : undefined;

  // Quiz configuration screen
  if (questions.length === 0 && !isGenerating) {
    return (
      <div className={`bg-white rounded-lg shadow-lg border p-6 ${className}`}>
        <div className="text-center mb-6">
          <Brain className="h-12 w-12 text-purple-600 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-gray-900">Practice Quiz Generator</h3>
          <p className="text-gray-600">Create a personalized quiz from the yoga manual content</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topic or Chapter (optional)
            </label>
            <input
              type="text"
              value={quizConfig.topic}
              onChange={(e) => setQuizConfig(prev => ({ ...prev, topic: e.target.value }))}
              placeholder="e.g., 'yamas and niyamas', 'pranayama', 'anatomy'"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave blank for general yoga philosophy questions
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <select
              value={quizConfig.difficulty}
              onChange={(e) => setQuizConfig(prev => ({ 
                ...prev, 
                difficulty: e.target.value as 'beginner' | 'intermediate' | 'advanced' 
              }))}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="beginner">Beginner - Basic concepts</option>
              <option value="intermediate">Intermediate - Applied knowledge</option>
              <option value="advanced">Advanced - Deep understanding</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Questions
            </label>
            <select
              value={quizConfig.questionCount}
              onChange={(e) => setQuizConfig(prev => ({ 
                ...prev, 
                questionCount: parseInt(e.target.value) 
              }))}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value={3}>3 questions</option>
              <option value={5}>5 questions</option>
              <option value={8}>8 questions</option>
              <option value={10}>10 questions</option>
            </select>
          </div>

          <button
            onClick={generateQuiz}
            disabled={isGenerating}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating Quiz...</span>
              </>
            ) : (
              <>
                <Brain className="h-4 w-4" />
                <span>Generate Quiz</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Quiz results screen
  if (showResults) {
    const score = getScore();
    const percentage = Math.round((score.correct / score.total) * 100);
    
    return (
      <div className={`bg-white rounded-lg shadow-lg border p-6 ${className}`}>
        <div className="text-center mb-6">
          <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-gray-900">Quiz Complete!</h3>
          <p className="text-2xl font-bold text-purple-600 mt-2">
            {score.correct} / {score.total} ({percentage}%)
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {questions.map((question, index) => {
            const userAnswer = selectedAnswers[question.id];
            const isCorrect = userAnswer === question.correctAnswer;
            
            return (
              <div key={question.id} className="border rounded-lg p-4">
                <div className="flex items-start space-x-2 mb-2">
                  {isCorrect ? (
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{question.question}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Your answer: {question.options[userAnswer!]} 
                      {!isCorrect && (
                        <span className="block text-green-600">
                          Correct: {question.options[question.correctAnswer]}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-700 mt-2 bg-gray-50 p-2 rounded">
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={resetQuiz}
            className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>New Quiz</span>
          </button>
        </div>
      </div>
    );
  }

  // Quiz question screen
  if (currentQuestion) {
    return (
      <div className={`bg-white rounded-lg shadow-lg border ${className}`}>
        {/* Progress header */}
        <div className="bg-gray-50 p-4 rounded-t-lg border-b">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
              {currentQuestion.difficulty}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {currentQuestion.question}
          </h3>

          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedAnswer === index
                    ? 'border-purple-500 bg-purple-50 text-purple-900'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center">
                  <span className="w-6 h-6 rounded-full border-2 border-current mr-3 flex items-center justify-center text-xs font-medium">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </span>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <button
              onClick={nextQuestion}
              disabled={selectedAnswer === undefined}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}