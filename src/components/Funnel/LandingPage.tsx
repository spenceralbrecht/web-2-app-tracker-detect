"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface LandingPageProps {
    onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center max-w-md mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="mb-8 relative w-64 h-64 mx-auto">
                    {/* Placeholder for hero image - using a div for now if no asset */}
                    <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-4xl">🛡️</span>
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-[#1C1C28] mb-4 leading-tight">
                    Stop your phone from being spied on.
                </h1>

                <p className="text-[#6B6B7F] mb-8 text-lg">
                    Protect your personal data, photos, and passwords from prying eyes.
                </p>

                <button
                    onClick={onStart}
                    className="w-full bg-[#483FDD] hover:bg-[#3A32B0] text-white font-semibold py-4 rounded-full text-lg transition-colors shadow-lg shadow-blue-500/30"
                >
                    Get started
                </button>
            </motion.div>
        </div>
    );
}
