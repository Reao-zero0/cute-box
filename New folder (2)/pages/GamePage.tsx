import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Settings, Volume2, VolumeX } from 'lucide-react';
// @ts-ignore
import confetti from 'canvas-confetti';
import { drawRandomPaper } from '../services/storageService';
import { ResultModal } from '../components/ResultModal';

const CLICKS_NEEDED = 5;

export const GamePage: React.FC = () => {
  const [clicks, setClicks] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [resultText, setResultText] = useState('');
  const [isError, setIsError] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const controls = useAnimation();

  // Reset clicks when modal closes
  const handleCloseModal = () => {
    setModalOpen(false);
    setClicks(0);
  };

  const playPopSound = () => {
    if (isMuted) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      // Ignore errors (user interaction policy)
    }
  };

  const playWinSound = () => {
    if (isMuted) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; 
      
      notes.forEach((note, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.value = note;
        const now = ctx.currentTime + (i * 0.1);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      });
    } catch (e) {
      // Ignore
    }
  };

  const handleBoxClick = async () => {
    if (modalOpen) return;

    playPopSound();

    // Haptic animation
    await controls.start({
      x: [0, -10, 10, -10, 10, 0],
      rotate: [0, -5, 5, -5, 5, 0],
      scale: [1, 1.05, 1],
      transition: { duration: 0.15 } 
    });

    const newClicks = clicks + 1;
    setClicks(newClicks);

    if (newClicks >= CLICKS_NEEDED) {
      const paper = drawRandomPaper();
      
      if (paper) {
        setResultText(paper);
        setIsError(false);
        playWinSound();
        confetti({
          particleCount: 200,
          spread: 120,
          origin: { y: 0.6 },
          colors: ['#D946EF', '#8B5CF6', '#06B6D4', '#FFFFFF'],
          scalar: 1.2
        });
      } else {
        setResultText('الصندوق خلص يا قمر! 🥺 ارجعي للأدمن يزود مفاجآت.');
        setIsError(true);
      }
      
      setTimeout(() => setModalOpen(true), 300);
    }
  };

  const progress = Math.min((clicks / CLICKS_NEEDED) * 100, 100);

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
      {/* Top Controls */}
      <div className="absolute top-6 left-0 right-0 px-6 flex justify-between items-center z-20">
        <Link 
          to="/admin" 
          className="p-3 glass-panel rounded-full text-chic-muted hover:text-white hover:bg-white/10 transition-all hover:scale-110"
        >
          <Settings size={24} />
        </Link>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-3 glass-panel rounded-full text-chic-muted hover:text-white hover:bg-white/10 transition-all hover:scale-110"
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </div>

      <div className="text-center mb-12 relative">
        <div className="absolute inset-0 bg-chic-primary blur-[60px] opacity-20" />
        <h1 className="relative font-display text-5xl md:text-7xl text-gradient font-bold mb-4 tracking-wide drop-shadow-lg">
          بوكس السعادة
        </h1>
        <p className="relative text-chic-muted text-lg tracking-wider font-light">
          Mystery Box Edition
        </p>
      </div>

      {/* The Box */}
      <div className="relative group">
        {/* Glow behind box */}
        <div className="absolute inset-0 bg-gradient-to-tr from-chic-primary to-chic-accent rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
        
        <motion.div
          className="cursor-pointer select-none relative z-10"
          animate={controls}
          onClick={handleBoxClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="text-[160px] md:text-[240px] leading-none filter drop-shadow-2xl">
            🎁
          </div>
        </motion.div>
      </div>

      {/* Modern Progress Bar */}
      <div className="w-72 mt-16 relative">
        <div className="h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div 
            className="h-full bg-gradient-to-r from-chic-primary via-chic-secondary to-chic-accent shadow-[0_0_15px_rgba(217,70,239,0.8)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-chic-muted font-medium px-1">
          <span>START</span>
          <span className="text-chic-accent tracking-widest">UNLOCKING</span>
          <span>OPEN</span>
        </div>
      </div>
      
      <p className="mt-8 text-sm text-white/50 font-light tracking-widest animate-pulse">
        {clicks === 0 ? 'TAP TO UNLOCK' : clicks >= CLICKS_NEEDED ? 'UNLOCKED!' : 'KEEP TAPPING...'}
      </p>

      <ResultModal 
        isOpen={modalOpen} 
        content={resultText} 
        onClose={handleCloseModal}
        isError={isError}
      />
    </div>
  );
};