import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

interface ResultModalProps {
  isOpen: boolean;
  content: string;
  onClose: () => void;
  isError?: boolean;
}

export const ResultModal: React.FC<ResultModalProps> = ({ isOpen, content, onClose, isError = false }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            className={`relative glass-panel w-full max-w-md p-1 rounded-[40px] overflow-hidden`}
          >
            {/* Holographic Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/5 pointer-events-none rounded-[40px]" />
            
            <div className="bg-[#1a0b2e]/60 rounded-[36px] p-8 text-center relative z-10 h-full flex flex-col items-center">
              <button 
                onClick={onClose}
                className="absolute top-4 left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white/80"
              >
                <X size={20} />
              </button>
              
              <div className="flex justify-center mb-6 relative">
                <div className="absolute inset-0 bg-chic-primary blur-2xl opacity-40 rounded-full" />
                <div className="relative p-4 bg-gradient-to-tr from-chic-secondary to-chic-primary rounded-2xl shadow-neon-pink">
                  <Sparkles className="text-white w-10 h-10" />
                </div>
              </div>

              <h2 className="font-display text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 mb-4">
                {isError ? 'أوبس!' : 'مبروك!'}
              </h2>
              
              <p className="text-xl text-gray-100 leading-relaxed font-body font-medium drop-shadow-sm">
                {content}
              </p>

              <button
                onClick={onClose}
                className="mt-8 w-full bg-gradient-to-r from-chic-primary to-chic-secondary hover:from-fuchsia-400 hover:to-violet-400 text-white font-bold py-4 px-8 rounded-2xl shadow-neon-pink transform active:scale-95 transition-all border border-white/20"
              >
                {isError ? 'حسنًا' : 'استمري! ✨'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};