// Keep React in development mode so Testing Library can use React.act.
process.env.NODE_ENV = 'development';
(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

// Vitest setup file for React Testing Library
import '@testing-library/jest-dom';

class AudioParamMock {
  setValueAtTime() {}
  exponentialRampToValueAtTime() {}
}

class AudioNodeMock {
  connect() {}
  disconnect() {}
}

class OscillatorNodeMock extends AudioNodeMock {
  frequency = new AudioParamMock();
  type = 'sine';

  start() {}
  stop() {}
}

class GainNodeMock extends AudioNodeMock {
  gain = new AudioParamMock();
}

class AudioContextMock {
  currentTime = 0;
  destination = {} as AudioDestinationNode;
  state: AudioContextState = 'running';

  createOscillator() {
    return new OscillatorNodeMock() as unknown as OscillatorNode;
  }

  createGain() {
    return new GainNodeMock() as unknown as GainNode;
  }

  resume() {
    return Promise.resolve();
  }

  close() {
    return Promise.resolve();
  }
}

Object.defineProperty(globalThis, 'AudioContext', {
  value: AudioContextMock,
  writable: true,
});

if (typeof window !== 'undefined') {
  // Mock matchMedia for tests
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });

  // Mock localStorage
  const localStorageMock = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    length: 0,
    key: () => null,
  };
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });

  // Mock ResizeObserver
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserverMock;

  Object.defineProperty(window, 'AudioContext', {
    value: AudioContextMock,
    writable: true,
  });
  Object.defineProperty(window, 'webkitAudioContext', {
    value: AudioContextMock,
    writable: true,
  });
}
