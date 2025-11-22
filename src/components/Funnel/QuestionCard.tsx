"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import clsx from 'clsx';

export type QuestionType = 'single' | 'multiple';

interface Option {
    id: string;
    label: string;
    icon?: string;
}

interface QuestionCardProps {
    question: React.ReactNode;
    description?: string;
    type: QuestionType;
    options: Option[];
    selected: string[];
    onSelect: (id: string) => void;
    onNext: () => void;
}

export default function QuestionCard({
    question,
    description,
    type,
    options,
    selected,
    onSelect,
    onNext,
}: QuestionCardProps) {
    const isMulti = type === 'multiple';

    return (
        <div className="flex flex-col items-center w-full px-6 pt-4">
            <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[26px] leading-tight font-bold text-center text-[#1C1C28] mb-3"
            >
                {question}
            </motion.h2>

            {description && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[#6B6B7F] text-center mb-8 text-lg"
                >
                    {description}
                </motion.p>
            )}

            <div className="w-full space-y-4 mb-8 mt-4">
                {options.map((option, index) => {
                    const isSelected = selected.includes(option.id);
                    return (
                        <motion.button
                            key={option.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => onSelect(option.id)}
                            className={clsx(
                                "w-full p-5 rounded-2xl text-left text-lg font-medium transition-all duration-200 flex items-center justify-between group",
                                isSelected
                                    ? "bg-[#1C1C28] text-white shadow-xl scale-[1.02]"
                                    : "bg-[#EBF0FF] text-[#1C1C28] hover:bg-[#DCE5FF] hover:scale-[1.01]"
                            )}
                        >
                            <span className="pl-1">{option.label}</span>
                            {isSelected && isMulti && (
                                <div className="bg-white/20 rounded-full p-1">
                                    <Check className="w-5 h-5 text-white" />
                                </div>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {isMulti && (
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={onNext}
                    className="w-full bg-[#483FDD] hover:bg-[#3A32B0] text-white font-bold py-5 rounded-full text-xl transition-all shadow-lg shadow-[#483FDD]/30 hover:shadow-[#483FDD]/50 active:scale-95"
                >
                    Next
                </motion.button>
            )}
        </div>
    );
}
