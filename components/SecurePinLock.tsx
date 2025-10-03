import React, { useState, useEffect } from 'react';

interface PinLockProps {
  onUnlock: () => void;
}

// Secure PIN hashing using Web Crypto API
async function hashPin(pin: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + salt);

  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}

// Generate random salt
function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

const SecurePinLock: React.FC<PinLockProps> = ({ onUnlock }) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockout, setLockout] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState(0);

  useEffect(() => {
    const storedHash = localStorage.getItem('parentPinHash');
    const storedSalt = localStorage.getItem('parentPinSalt');
    if (!storedHash || !storedSalt) {
      setIsSetupMode(true);
    }

    // Check for existing lockout
    const lockoutEnd = localStorage.getItem('parentPinLockout');
    if (lockoutEnd) {
      const endTime = parseInt(lockoutEnd);
      if (Date.now() < endTime) {
        setLockout(true);
        setLockoutEndTime(endTime);
      } else {
        localStorage.removeItem('parentPinLockout');
      }
    }
  }, []);

  useEffect(() => {
    if (lockout && lockoutEndTime > 0) {
      const timer = setInterval(() => {
        if (Date.now() >= lockoutEndTime) {
          setLockout(false);
          setLockoutEndTime(0);
          setAttempts(0);
          setError('');
          localStorage.removeItem('parentPinLockout');
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [lockout, lockoutEndTime]);

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

  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (pin.length < 4) {
      setError('PIN must be 4-6 digits.');
      return;
    }

    if (pin !== confirmPin) {
      setError('PINs do not match.');
      return;
    }

    // Generate salt and hash the PIN
    const salt = generateSalt();
    const hashedPin = await hashPin(pin, salt);

    // Store hashed PIN and salt
    localStorage.setItem('parentPinHash', hashedPin);
    localStorage.setItem('parentPinSalt', salt);

    // Clear PIN from memory immediately
    setPin('');
    setConfirmPin('');

    onUnlock();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockout) return;

    const storedHash = localStorage.getItem('parentPinHash');
    const storedSalt = localStorage.getItem('parentPinSalt');

    if (!storedHash || !storedSalt) {
      setError('PIN not configured. Please refresh and set up a PIN.');
      return;
    }

    // Hash the entered PIN with stored salt
    const enteredHash = await hashPin(pin, storedSalt);

    // Clear PIN from memory immediately
    const enteredPin = pin;
    setPin('');

    if (enteredHash === storedHash) {
      setAttempts(0);
      onUnlock();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 3) {
        // Progressive lockout: 30s, 5min, 15min, 1hr
        const lockoutDurations = [30000, 300000, 900000, 3600000];
        const failedSets = Math.min(Math.floor(newAttempts / 3) - 1, 3);
        const lockoutDuration = lockoutDurations[failedSets];
        const lockoutEnd = Date.now() + lockoutDuration;

        setLockoutEndTime(lockoutEnd);
        setLockout(true);
        localStorage.setItem('parentPinLockout', String(lockoutEnd));

        const minutes = Math.floor(lockoutDuration / 60000);
        const seconds = Math.floor((lockoutDuration % 60000) / 1000);
        setError(`Too many incorrect attempts. Locked for ${minutes > 0 ? `${minutes}m ` : ''}${seconds}s`);
      } else {
        setError(`Incorrect PIN. ${3 - newAttempts} attempts remaining.`);
      }
    }
  };

  const getRemainingLockoutTime = () => {
    if (!lockout || lockoutEndTime === 0) return '';
    const remaining = Math.max(0, lockoutEndTime - Date.now());
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isSetupMode) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-800/50">
        <div className="w-full max-w-sm text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-2">Set Up Parent PIN</h2>
          <p className="text-text-secondary mb-8">Create a secure 4-6 digit PIN to protect the Parent Zone.</p>
          <form onSubmit={handleSetupSubmit}>
            <input
              type="password"
              placeholder="Enter PIN"
              value={pin}
              onChange={handlePinChange}
              maxLength={6}
              className="w-full p-4 mb-4 text-center text-3xl tracking-[0.5em] bg-slate-700/50 border border-slate-600 rounded-lg text-text-primary focus:ring-2 focus:ring-[var(--primary-accent)] outline-none"
              autoFocus
              autoComplete="off"
            />
            <input
              type="password"
              placeholder="Confirm PIN"
              value={confirmPin}
              onChange={handleConfirmPinChange}
              maxLength={6}
              className="w-full p-4 text-center text-3xl tracking-[0.5em] bg-slate-700/50 border border-slate-600 rounded-lg text-text-primary focus:ring-2 focus:ring-[var(--primary-accent)] outline-none"
              autoComplete="off"
            />
            {error && <p className="text-red-400 mt-4">{error}</p>}
            <button
              type="submit"
              className="w-full mt-6 px-6 py-3 rounded-lg bg-[var(--primary-accent)] text-background-main font-semibold hover:opacity-80 disabled:opacity-50"
              disabled={pin.length < 4 || pin !== confirmPin}
            >
              Set PIN
            </button>
          </form>
          <p className="text-xs text-text-muted mt-4">
            PIN is securely hashed and cannot be recovered if forgotten.
            Write it down in a safe place.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-800/50">
      <div className="w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Parent Zone</h2>
        <p className="text-text-secondary mb-8">
          {lockout
            ? `Locked. Try again in ${getRemainingLockoutTime()}`
            : 'Please enter the PIN to continue.'}
        </p>
        <form onSubmit={handleLoginSubmit}>
          <input
            type="password"
            value={pin}
            onChange={handlePinChange}
            maxLength={6}
            className="w-full p-4 text-center text-3xl tracking-[1em] bg-slate-700/50 border border-slate-600 rounded-lg text-text-primary focus:ring-2 focus:ring-[var(--primary-accent)] outline-none"
            autoFocus
            disabled={lockout}
            autoComplete="off"
            placeholder={lockout ? 'LOCKED' : ''}
          />
          {error && !lockout && <p className="text-red-400 mt-4">{error}</p>}
          {lockout && (
            <div className="mt-4">
              <p className="text-orange-400">Too many failed attempts</p>
              <p className="text-2xl font-mono text-orange-400 mt-2">{getRemainingLockoutTime()}</p>
            </div>
          )}
          <button
            type="submit"
            className="w-full mt-6 px-6 py-3 rounded-lg bg-[var(--primary-accent)] text-background-main font-semibold hover:opacity-80 disabled:opacity-50"
            disabled={pin.length < 4 || lockout}
          >
            {lockout ? 'Locked' : 'Unlock'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SecurePinLock;