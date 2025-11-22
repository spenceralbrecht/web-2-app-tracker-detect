"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Smartphone } from 'lucide-react';

interface ProcessingScreenProps {
    onComplete: () => void;
}

export default function ProcessingScreen({ onComplete }: ProcessingScreenProps) {
    const [steps, setSteps] = useState([
        { id: 1, text: "Run a deep scan of all your phone apps", completed: false },
        { id: 2, text: "See which apps can access your private info", completed: false },
        { id: 3, text: "Use our tool to remove hidden spyware", completed: false },
    ]);

    useEffect(() => {
        const timer1 = setTimeout(() => {
            setSteps(s => s.map(step => step.id === 1 ? { ...step, completed: true } : step));
        }, 1500);

        const timer2 = setTimeout(() => {
            setSteps(s => s.map(step => step.id === 2 ? { ...step, completed: true } : step));
        }, 3000);

        const timer3 = setTimeout(() => {
            setSteps(s => s.map(step => step.id === 3 ? { ...step, completed: true } : step));
        }, 4500);

        const completeTimer = setTimeout(() => {
            onComplete();
        }, 5500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center max-w-md mx-auto">
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-white mb-8"
            >
                Anti-spy scan
            </motion.h2>

            {/* Phone Scanning Animation */}
            <div className="relative w-64 h-96 bg-[#1C1C28] rounded-[3rem] border-8 border-[#2D2D44] mb-12 overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <Smartphone className="w-32 h-32 text-gray-600" />
                </div>

                {/* Scanning Line */}
                <motion.div
                    className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#50E3C2] to-transparent opacity-70 shadow-[0_0_20px_#50E3C2]"
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />

                {/* Radar Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#483FDD]/20 to-transparent pointer-events-none" />
            </div>

            <div className="w-full space-y-4 text-left">
                {steps.map((step) => (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center space-x-3"
                    >
                        <div className={`flex-shrink-0 transition-colors duration-300 ${step.completed ? 'text-[#483FDD]' : 'text-gray-300'}`}>
                            <CheckCircle className="w-6 h-6 fill-current" />
                        </div>
                        <span className="text-[#1C1C28] font-medium">{step.text}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
