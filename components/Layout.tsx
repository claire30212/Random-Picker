import React from 'react';
import { Sparkles } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onHomeClick: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onHomeClick }) => {
  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 font-sans transition-colors duration-500">
      {/* Header */}
      <header className="w-full max-w-5xl flex justify-between items-center mb-8 md:mb-12">
        <div 
          onClick={onHomeClick}
          className="flex items-center gap-2 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 bg-morandi-dark text-morandi-base rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
            <Sparkles size={20} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-serif font-bold tracking-wide text-morandi-dark">
              Random Picker
            </h1>
            <span className="text-xs text-morandi-gray tracking-widest uppercase">
              Aesthetic Selection Tool
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-4xl relative z-10 flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-12 text-morandi-gray text-sm font-light tracking-wide text-center">
        © {new Date().getFullYear()} Random Picker. Designed with Morandi Esthetics.
      </footer>
    </div>
  );
};

export default Layout;