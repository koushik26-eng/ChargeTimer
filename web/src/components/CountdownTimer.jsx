import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Pause, Play, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const CountdownTimer = ({ totalSeconds, onComplete, onCancel }) => {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const audioContextRef = useRef(null);

  useEffect(() => {
    if (isPaused || isComplete) return;

    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, isComplete]);

  const handleComplete = () => {
    setIsComplete(true);
    playBeep();
    showNotification();
    onComplete?.();
  };

  const playBeep = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.5);
    } catch (error) {
      console.error('Failed to play beep:', error);
    }
  };

  const showNotification = () => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Charging Complete!', {
          body: 'Your device has reached the target battery level.',
          icon: '/favicon.ico',
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('Charging Complete!', {
              body: 'Your device has reached the target battery level.',
              icon: '/favicon.ico',
            });
          }
        });
      }
    }
    
    toast.success('Charging complete!', {
      description: 'Your device has reached the target battery level.',
    });
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-2xl p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
        >
          <CheckCircle2 className="w-24 h-24 text-primary mx-auto mb-6" />
        </motion.div>
        <h2 className="text-3xl font-bold mb-2">Charging Complete!</h2>
        <p className="text-muted-foreground mb-6">Your device has reached the target battery level.</p>
        <Button onClick={onCancel} className="bg-primary hover:bg-primary/90">
          Back to Calculator
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Charging in Progress</h2>
        <p className="text-muted-foreground">Keep your device connected</p>
      </div>

      <div className="relative mb-8">
        <svg className="w-full h-4 rounded-full overflow-hidden bg-secondary">
          <motion.rect
            width={`${progress}%`}
            height="100%"
            fill="url(#gradient)"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(199 89% 60%)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="text-center mb-8">
        <div className="text-7xl font-bold gradient-text mb-2" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {formatTime(secondsLeft)}
        </div>
        <p className="text-sm text-muted-foreground">Time remaining</p>
      </div>

      <div className="flex gap-3 justify-center">
        <Button
          onClick={() => setIsPaused(!isPaused)}
          variant="outline"
          size="lg"
          className="border-white/10 hover:bg-white/5"
        >
          {isPaused ? (
            <>
              <Play className="w-5 h-5 mr-2" />
              Resume
            </>
          ) : (
            <>
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </>
          )}
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          size="lg"
          className="border-destructive/50 text-destructive hover:bg-destructive/10"
        >
          <X className="w-5 h-5 mr-2" />
          Cancel
        </Button>
      </div>
    </motion.div>
  );
};

export default CountdownTimer;