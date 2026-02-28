/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import logo from './assets/logo.png';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, ChevronRight, Hash, History, Award, Sparkles, Zap, Mail, Linkedin, Github } from 'lucide-react';

type GameStatus = 'playing' | 'won';


interface GuessHistory {
  value: number;
  result: 'high' | 'low' | 'correct';
}

export default function App() {
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [guess, setGuess] = useState<string>('');
  const [message, setMessage] = useState<string>('Enter a number between 1 and 100');
  const [attempts, setAttempts] = useState<number>(0);
  const [status, setStatus] = useState<GameStatus>('playing');
  const [history, setHistory] = useState<GuessHistory[]>([]);
  const [highScore, setHighScore] = useState<number | null>(null);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    startNewGame();
    const savedScore = localStorage.getItem('guess_number_highscore');
    if (savedScore) setHighScore(parseInt(savedScore));
  }, []);

  const startNewGame = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1);
    setGuess('');
    setMessage('Enter a number between 1 and 100');
    setAttempts(0);
    setStatus('playing');
    setHistory([]);
    setShake(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'won') return;

    const numGuess = parseInt(guess);
    if (isNaN(numGuess) || numGuess < 1 || numGuess > 100) {
      setMessage('Please enter a valid number between 1 and 100');
      triggerShake();
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    let result: 'high' | 'low' | 'correct';
    if (numGuess < targetNumber) {
      setMessage('Too LOW! Aim higher! 🚀');
      result = 'low';
      triggerShake();
    } else if (numGuess > targetNumber) {
      setMessage('Too HIGH! Bring it down! 📉');
      result = 'high';
      triggerShake();
    } else {
      setMessage(`BOOM! You found it in ${newAttempts} attempts! 🎯`);
      setStatus('won');
      result = 'correct';
      
      if (highScore === null || newAttempts < highScore) {
        setHighScore(newAttempts);
        localStorage.setItem('guess_number_highscore', newAttempts.toString());
      }
    }

    setHistory([{ value: numGuess, result }, ...history]);
    setGuess('');
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const [activeModal, setActiveModal] = useState<'rules' | 'about' | 'support' | null>(null);

  const Modal = ({ title, children, onClose }: { title: string, children: React.ReactNode, onClose: () => void }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-[#1E293B] border border-white/10 rounded-[32px] p-8 w-full max-w-md relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
        >
          <Zap className="w-6 h-6 rotate-45" />
        </button>
        <h2 className="text-2xl font-black mb-6 tracking-tight text-indigo-400 uppercase">{title}</h2>
        <div className="text-white/70 leading-relaxed text-sm space-y-4">
          {children}
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className="w-full mt-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold transition-all uppercase tracking-widest text-[10px]"
        >
          Close
        </motion.button>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-sans selection:bg-indigo-500/30 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <AnimatePresence>
        {activeModal === 'rules' && (
          <Modal title="Game Rules" onClose={() => setActiveModal(null)}>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="text-indigo-400 font-black">01.</span>
                <p>I have selected a secret number between <span className="text-white font-bold">1 and 100</span>.</p>
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-400 font-black">02.</span>
                <p>Your goal is to guess it in the <span className="text-white font-bold">fewest attempts</span> possible.</p>
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-400 font-black">03.</span>
                <p>After each guess, I'll tell you if you're <span className="text-blue-400 font-bold">Too Low</span> or <span className="text-rose-400 font-bold">Too High</span>.</p>
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-400 font-black">04.</span>
                <p>Rankings: <span className="text-emerald-400 font-bold">S</span> (1-5 tries), <span className="text-indigo-400 font-bold">A</span> (6-8 tries), <span className="text-white/40 font-bold">B</span> (9+ tries).</p>
              </li>
            </ul>
          </Modal>
        )}
        {activeModal === 'about' && (
          <Modal title="About Guess Master" onClose={() => setActiveModal(null)}>
            <p>Guess Master is a high-octane, minimalist number guessing experience designed for speed and precision.</p>
            <p>Developed by <span className="text-indigo-400 font-bold">Suraj Patil</span>, this project showcases modern web technologies including React, Tailwind CSS, and Framer Motion.</p>
            <p className="text-xs italic opacity-50">Version 2.0 - "The Neon Update"</p>
          </Modal>
        )}
        {activeModal === 'support' && (
          <Modal title="Support & Contact" onClose={() => setActiveModal(null)}>
            <p className="mb-6">Need help or have feedback? Reach out to the developer directly.</p>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center justify-between group">
                <div>
                  <p className="text-[10px] uppercase font-bold text-white/40 mb-1">Developer</p>
                  <p className="font-bold text-white">Suraj Patil</p>
                </div>
                <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-indigo-400" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <motion.a 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href="mailto:surajp7275@gmail.com" 
                  className="bg-white/5 p-6 rounded-3xl border border-white/5 flex flex-col items-center gap-3 hover:bg-white/10 transition-colors group"
                  title="Email"
                >
                  <Mail className="w-8 h-8 text-indigo-400 group-hover:text-white transition-colors" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Email</span>
                </motion.a>

                <motion.a 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://www.linkedin.com/in/suraj-patil90/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-white/5 p-6 rounded-3xl border border-white/5 flex flex-col items-center gap-3 hover:bg-white/10 transition-colors group"
                  title="LinkedIn"
                >
                  <Linkedin className="w-8 h-8 text-indigo-400 group-hover:text-white transition-colors" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">LinkedIn</span>
                </motion.a>

                <motion.a 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://github.com/Suraj2429" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-white/5 p-6 rounded-3xl border border-white/5 flex flex-col items-center gap-3 hover:bg-white/10 transition-colors group"
                  title="GitHub"
                >
                  <Github className="w-8 h-8 text-indigo-400 group-hover:text-white transition-colors" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">GitHub</span>
                </motion.a>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-indigo-600/20 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-600/20 blur-[120px] rounded-full"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md z-10"
      >
        {/* Header */}
        <header className="text-center mb-6">
          <motion.div 
              whileHover={{ rotate: 2, scale: 1.05 }}
              className="inline-flex items-center justify-center 
                        w-40 h-40 
                        bg-gradient-to-br from-indigo-500 to-purple-600 
                        rounded-full 
                        shadow-2xl shadow-indigo-500/30 
                        mb-6 
                        overflow-hidden 
                        border-4 border-white/10"
            >
              
              <img
                src={logo}
                alt="Suraj Patil - Guess Master"
                className="w-full h-full object-cover rounded-full"
              />
            </motion.div>
          <h1 className="text-4xl font-black tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            GUESS MASTER
          </h1>
          <div className="flex items-center justify-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-[0.2em]">
            <Sparkles className="w-3 h-3" />
            <span>The Ultimate Challenge</span>
            <Sparkles className="w-3 h-3" />
          </div>
        </header>

        {/* Main Game Card */}
        <motion.div 
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          className="bg-white/10 backdrop-blur-2xl rounded-[40px] shadow-2xl border border-white/10 p-8 relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {status === 'playing' ? (
              <motion.div
                key="playing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <motion.p 
                    key={message}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-xl font-bold transition-colors duration-300 ${
                      message.includes('LOW') ? 'text-blue-400' : 
                      message.includes('HIGH') ? 'text-rose-400' : 'text-white'
                    }`}
                  >
                    {message}
                  </motion.p>
                </div>

                <form onSubmit={handleGuess} className="relative group">
                  <input
                    ref={inputRef}
                    type="number"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    placeholder="??"
                    className="w-full text-7xl font-black text-center py-10 bg-black/20 rounded-3xl border-2 border-white/5 focus:border-indigo-500 focus:bg-black/40 focus:outline-none transition-all placeholder:text-white/10"
                    autoFocus
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white text-indigo-600 rounded-2xl flex items-center justify-center shadow-xl hover:bg-indigo-50 transition-all"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </motion.button>
                </form>

                <div className="flex justify-between items-center px-4">
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Attempts</span>
                    <div className="flex items-center gap-2 text-white">
                      <History className="w-4 h-4 text-indigo-400" />
                      <span className="text-lg font-black">{attempts}</span>
                    </div>
                  </div>
                  {highScore && (
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Personal Best</span>
                      <div className="flex items-center gap-2 text-amber-400">
                        <Award className="w-4 h-4" />
                        <span className="text-lg font-black">{highScore}</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="won"
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                className="text-center space-y-8 py-6"
              >
                <motion.div 
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-300 to-amber-600 rounded-full shadow-[0_0_50px_rgba(245,158,11,0.3)]"
                >
                  <Trophy className="w-12 h-12 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-5xl font-black mb-4 tracking-tighter">VICTORY!</h2>
                  <p className="text-white/60 text-xl">
                    The secret number was <span className="text-white font-black bg-white/10 px-3 py-1 rounded-lg">{targetNumber}</span>
                  </p>
                  <div className="mt-6 flex items-center justify-center gap-4">
                    <div className="bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
                      <p className="text-[10px] uppercase font-bold text-white/40">Attempts</p>
                      <p className="text-2xl font-black">{attempts}</p>
                    </div>
                    <div className="bg-indigo-500/20 px-4 py-2 rounded-2xl border border-indigo-500/20">
                      <p className="text-[10px] uppercase font-bold text-indigo-400">Rank</p>
                      <p className="text-2xl font-black">{attempts <= 5 ? 'S' : attempts <= 8 ? 'A' : 'B'}</p>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={startNewGame}
                  className="w-full py-5 bg-white text-indigo-600 rounded-3xl font-black text-xl shadow-2xl hover:shadow-white/10 transition-all flex items-center justify-center gap-3"
                >
                  <RefreshCw className="w-6 h-6" />
                  PLAY AGAIN
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* History List */}
        {history.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 space-y-4"
          >
            <div className="flex items-center justify-between px-6">
              <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Timeline</h3>
              <Zap className="w-3 h-3 text-white/20" />
            </div>
            <div className="space-y-3">
              {history.slice(0, 4).map((h, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={history.length - i}
                  className="bg-white/5 backdrop-blur-md border border-white/5 rounded-[24px] p-4 flex items-center justify-between group hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg font-black text-white group-hover:scale-110 transition-transform">
                      {h.value}
                    </span>
                    <span className={`text-sm font-bold uppercase tracking-wider ${
                      h.result === 'low' ? 'text-blue-400' : 
                      h.result === 'high' ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {h.result === 'low' ? 'Too Low' : h.result === 'high' ? 'Too High' : 'Perfect!'}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-white/20 font-black">STEP</span>
                    <span className="text-xs font-black text-white/40">{history.length - i}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Custom Footer */}
      <footer className="mt-0 pt-5 pb-2 w-full max-w-md">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-6">
            <motion.button 
              whileHover={{ y: -2 }} 
              onClick={() => setActiveModal('rules')}
              className="text-white/40 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
            >
              Rules
            </motion.button>
            <motion.button 
              whileHover={{ y: -2 }} 
              onClick={() => setActiveModal('about')}
              className="text-white/40 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
            >
              About
            </motion.button>
            <motion.button 
              whileHover={{ y: -2 }} 
              onClick={() => setActiveModal('support')}
              className="text-white/40 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
            >
              Support
            </motion.button>
          </div>
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
            Designed by <span className="text-indigo-400">Suraj Patil</span>
          </p>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </footer>
    </div>
  );
}
