import React, { useState } from 'react';

interface PinLockProps {
  onUnlock: () => void;
}

const CORRECT_PIN = '1234'; // Hardcoded for this example

const PinLock: React.FC<PinLockProps> = ({ onUnlock }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPin = e.target.value;
    if (/^\d*$/.test(newPin) && newPin.length <= 4) {
      setPin(newPin);
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === CORRECT_PIN) {
      onUnlock();
    } else {
      setError('Incorrect PIN. Please try again.');
      setPin('');
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-800/50">
      <div className="w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Parent Zone</h2>
        <p className="text-text-secondary mb-8">Please enter the PIN to continue.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={pin}
            onChange={handlePinChange}
            maxLength={4}
            className="w-full p-4 text-center text-3xl tracking-[1em] bg-slate-700/50 border border-slate-600 rounded-lg text-text-primary focus:ring-2 focus:ring-[var(--primary-accent)] outline-none"
            autoFocus
          />
          {error && <p className="text-red-400 mt-4">{error}</p>}
          <button type="submit" className="w-full mt-6 px-6 py-3 rounded-lg bg-[var(--primary-accent)] text-background-main font-semibold hover:opacity-80 disabled:opacity-50" disabled={pin.length !== 4}>
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
};

export default PinLock;
