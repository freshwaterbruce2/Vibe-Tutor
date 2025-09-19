import React, { useState, useEffect } from 'react';

interface PinLockProps {
  onUnlock: () => void;
}

const PinLock: React.FC<PinLockProps> = ({ onUnlock }) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockout, setLockout] = useState(false);

  useEffect(() => {
    const storedPin = localStorage.getItem('parentPin');
    if (!storedPin) {
      setIsSetupMode(true);
    }
  }, []);

  useEffect(() => {
    if (lockout) {
      const timer = setTimeout(() => {
        setLockout(false);
        setAttempts(0);
        setError('');
      }, 30000); // 30-second lockout
      return () => clearTimeout(timer);
    }
  }, [lockout]);

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPin = e.target.value;
    if (/^\d*$/.test(newPin) && newPin.length <= 6) {
      setPin(newPin);
      setError('');
    }
  };
  
  const handleConfirmPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPin = e.target.value;
    if (/^\d*$/.test(newPin) && newPin.length <= 6) {
      setConfirmPin(newPin);
      setError('');
    }
  };

  const handleSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) {
      setError('PIN must be 4-6 digits.');
      return;
    }
    if (pin !== confirmPin) {
      setError('PINs do not match.');
      return;
    }
    localStorage.setItem('parentPin', pin);
    onUnlock();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockout) return;

    const storedPin = localStorage.getItem('parentPin');
    if (pin === storedPin) {
      onUnlock();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPin('');
      if (newAttempts >= 3) {
        setError('Too many incorrect attempts. Please wait 30 seconds.');
        setLockout(true);
      } else {
        setError(`Incorrect PIN. ${3 - newAttempts} attempts remaining.`);
      }
    }
  };

  if (isSetupMode) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-800/50">
        <div className="w-full max-w-sm text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-2">Set Up Parent PIN</h2>
          <p className="text-text-secondary mb-8">Create a 4-6 digit PIN to protect the Parent Zone.</p>
          <form onSubmit={handleSetupSubmit}>
            <input
              type="password"
              placeholder="Enter PIN"
              value={pin}
              onChange={handlePinChange}
              maxLength={6}
              className="w-full p-4 mb-4 text-center text-3xl tracking-[0.5em] bg-slate-700/50 border border-slate-600 rounded-lg text-text-primary focus:ring-2 focus:ring-[var(--primary-accent)] outline-none"
              autoFocus
            />
            <input
              type="password"
              placeholder="Confirm PIN"
              value={confirmPin}
              onChange={handleConfirmPinChange}
              maxLength={6}
              className="w-full p-4 text-center text-3xl tracking-[0.5em] bg-slate-700/50 border border-slate-600 rounded-lg text-text-primary focus:ring-2 focus:ring-[var(--primary-accent)] outline-none"
            />
            {error && <p className="text-red-400 mt-4">{error}</p>}
            <button type="submit" className="w-full mt-6 px-6 py-3 rounded-lg bg-[var(--primary-accent)] text-background-main font-semibold hover:opacity-80 disabled:opacity-50" disabled={pin.length < 4 || pin !== confirmPin}>
              Set PIN
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-800/50">
      <div className="w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Parent Zone</h2>
        <p className="text-text-secondary mb-8">Please enter the PIN to continue.</p>
        <form onSubmit={handleLoginSubmit}>
          <input
            type="password"
            value={pin}
            onChange={handlePinChange}
            maxLength={6}
            className="w-full p-4 text-center text-3xl tracking-[1em] bg-slate-700/50 border border-slate-600 rounded-lg text-text-primary focus:ring-2 focus:ring-[var(--primary-accent)] outline-none"
            autoFocus
            disabled={lockout}
          />
          {error && <p className="text-red-400 mt-4">{error}</p>}
          <button type="submit" className="w-full mt-6 px-6 py-3 rounded-lg bg-[var(--primary-accent)] text-background-main font-semibold hover:opacity-80 disabled:opacity-50" disabled={pin.length < 4 || lockout}>
            {lockout ? 'Locked' : 'Unlock'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PinLock;