import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Flower2, Flower } from 'lucide-react';

export const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0F0518]">
      {/* Moving Gradient Orbs */}
      <motion.div 
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-chic-primary rounded-full mix-blend-screen filter blur-[100px] opacity-20"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-[10%] right-[-5%] w-[40vw] h-[40vw] bg-chic-secondary rounded-full mix-blend-screen filter blur-[100px] opacity-20"
        animate={{
          x: [0, -40, 0],
          y: [0, -40, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      
      {/* Neon Flowers & Sparkles */}
      {[...Array(8)].map((_, i) => {
        const Icon = i % 3 === 0 ? Flower2 : i % 3 === 1 ? Flower : Sparkles;
        const color = i % 2 === 0 ? '#D946EF' : '#06B6D4'; // Pink or Cyan
        
        return (
          <motion.div
            key={i}
            className="absolute opacity-20"
            style={{
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 90}%`,
              filter: `drop-shadow(0 0 10px ${color})`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 45, -45, 0],
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          >
            <Icon size={Math.random() * 40 + 30} color={color} strokeWidth={1.5} />
          </motion.div>
        );
      })}

      {/* Grid overlay for texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
    </div>
  );
};