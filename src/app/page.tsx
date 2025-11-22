"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';
import LandingPage from '@/components/Funnel/LandingPage';
import QuestionCard, { QuestionType } from '@/components/Funnel/QuestionCard';
import ProcessingScreen from '@/components/Funnel/ProcessingScreen';
import Paywall from '@/components/Funnel/Paywall';
import { AnimatePresence, motion } from 'framer-motion';

type Step = 'landing' | 'questions' | 'processing' | 'paywall';

interface Question {
  id: string;
  text: React.ReactNode; // Changed to ReactNode to allow formatting
  description?: string;
  type: QuestionType;
  options: { id: string; label: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'q_recording',
    text: <>Do you think someone is <span className="text-[#483FDD]">recording</span> your phone calls?</>,
    type: 'single',
    options: [
      { id: 'yes', label: 'Yes' },
      { id: 'no', label: 'No' },
    ]
  },
  {
    id: 'q_passcode',
    text: <>Does someone know your <span className="text-[#483FDD]">phone’s passcode</span>?</>,
    type: 'single',
    options: [
      { id: 'yes', label: 'Yes' },
      { id: 'no', label: 'No' },
      { id: 'not_sure', label: 'Not sure' },
    ]
  },
  {
    id: 'q_talk',
    text: 'Does someone seem to know what you talk about on the phone?',
    type: 'single',
    options: [
      { id: 'yes', label: 'Yes' },
      { id: 'no', label: 'No' },
      { id: 'not_sure', label: 'Not sure' },
    ]
  },
  {
    id: 'q_protect',
    text: 'What do you want to protect most?',
    type: 'multiple',
    options: [
      { id: 'texts', label: 'Texts and calls' },
      { id: 'location', label: 'Location' },
      { id: 'photos', label: 'Photos and videos' },
      { id: 'browsing', label: 'Browsing history' },
      { id: 'passwords', label: 'Passwords' },
      { id: 'financial', label: 'Financial data' },
      { id: 'personal', label: 'Personal data' },
    ]
  },
  {
    id: 'q_data',
    text: <>Okay, what type of <span className="text-[#483FDD]">personal data</span> do you want to protect?</>,
    description: 'Pick as many options as you want.',
    type: 'multiple',
    options: [
      { id: 'messages', label: 'Messages' },
      { id: 'photos', label: 'Photos' },
      { id: 'contacts', label: 'Contacts' },
      { id: 'passwords', label: 'Passwords' },
      { id: 'financial', label: 'Financial data' },
      { id: 'personal', label: 'Personal data' },
    ]
  }
];

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>('landing');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  const handleStart = () => {
    setCurrentStep('questions');
  };

  const handleSelect = (questionId: string, optionId: string, type: QuestionType) => {
    setAnswers(prev => {
      const current = prev[questionId] || [];
      if (type === 'single') {
        // For single select, set immediately and move next
        setTimeout(() => handleNextQuestion(), 250);
        return { ...prev, [questionId]: [optionId] };
      } else {
        // For multi select, toggle
        if (current.includes(optionId)) {
          return { ...prev, [questionId]: current.filter(id => id !== optionId) };
        } else {
          return { ...prev, [questionId]: [...current, optionId] };
        }
      }
    });
  };

  const handleNextQuestion = () => {
    if (questionIndex < QUESTIONS.length - 1) {
      setQuestionIndex(prev => prev + 1);
    } else {
      setCurrentStep('processing');
    }
  };

  const handleProcessingComplete = () => {
    setCurrentStep('paywall');
  };

  const currentQuestion = QUESTIONS[questionIndex];

  return (
    <main className="min-h-screen flex flex-col bg-[#F4F6FC]">
      <Header />

      <div className="flex-1 flex flex-col relative overflow-hidden pb-10 max-w-lg mx-auto w-full">
        {/* Progress Bar for Questions */}
        {currentStep === 'questions' && (
          <div className="w-full px-6 mt-2 mb-8">
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#50E3C2]"
                initial={{ width: 0 }}
                animate={{ width: `${((questionIndex + 1) / QUESTIONS.length) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {currentStep === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <LandingPage onStart={handleStart} />
            </motion.div>
          )}

          {currentStep === 'questions' && (
            <motion.div
              key={`question-${questionIndex}`}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full"
            >
              <QuestionCard
                question={currentQuestion.text}
                description={currentQuestion.description}
                type={currentQuestion.type}
                options={currentQuestion.options}
                selected={answers[currentQuestion.id] || []}
                onSelect={(optionId) => handleSelect(currentQuestion.id, optionId, currentQuestion.type)}
                onNext={handleNextQuestion}
              />
            </motion.div>
          )}

          {currentStep === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <ProcessingScreen onComplete={handleProcessingComplete} />
            </motion.div>
          )}

          {currentStep === 'paywall' && (
            <motion.div
              key="paywall"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full"
            >
              <Paywall />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
