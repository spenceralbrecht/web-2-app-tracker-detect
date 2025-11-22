import React from 'react';
import { Shield } from 'lucide-react';

export default function Header() {
    return (
        <header className="flex justify-center items-center py-6 bg-transparent">
            <div className="flex items-center space-x-2 text-[#1C1C28]">
                <Shield className="w-8 h-8 text-[#483FDD]" fill="currentColor" fillOpacity={0.2} />
                <span className="font-bold text-xl tracking-tight">Anti Spy</span>
            </div>
        </header>
    );
}
