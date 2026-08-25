/** Decorative microchip / processor backdrop with traveling trace pulses. */
const CircuitBackground = () => {
  return (
    <div className="circuit-bg" aria-hidden="true">
      <div className="circuit-bg__grid" />
      <div className="circuit-bg__die">
        <span className="circuit-bg__pad" />
        <span className="circuit-bg__pad" />
        <span className="circuit-bg__pad" />
        <span className="circuit-bg__pad" />
        <span className="circuit-bg__core" />
      </div>
      <span className="circuit-bg__scan circuit-bg__scan--h circuit-bg__scan--a" />
      <span className="circuit-bg__scan circuit-bg__scan--h circuit-bg__scan--b" />
      <span className="circuit-bg__scan circuit-bg__scan--v circuit-bg__scan--c" />
      <span className="circuit-bg__scan circuit-bg__scan--v circuit-bg__scan--d" />
      <svg
        className="circuit-bg__svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
      >
        <defs>
          <linearGradient id="circuit-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--circuit-cyan)" stopOpacity="0.15" />
            <stop offset="50%" stopColor="var(--circuit-cyan)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="var(--circuit-violet)" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path
          className="circuit-bg__trace circuit-bg__trace--fast"
          d="M80 120 H420 V260 H640 V180 H820 V320 H1100 V90 H1360"
        />
        <path
          className="circuit-bg__trace circuit-bg__trace--slow"
          d="M40 760 H280 V620 H520 V740 H780 V540 H1020 V700 H1400"
        />
        <path
          className="circuit-bg__trace"
          d="M180 40 V340 H340 V500 H180 V820"
        />
        <path
          className="circuit-bg__trace circuit-bg__trace--slow"
          d="M1260 40 V220 H980 V400 H1260 V640 H900 V860"
        />
        <path
          className="circuit-bg__trace circuit-bg__trace--fast"
          d="M0 450 H260 V380 H480 V520 H720 V430 H960 V560 H1440"
        />
        <circle className="circuit-bg__via" cx="420" cy="120" r="4" />
        <circle className="circuit-bg__via" cx="640" cy="260" r="4" />
        <circle className="circuit-bg__via" cx="820" cy="180" r="4" />
        <circle className="circuit-bg__via" cx="280" cy="760" r="4" />
        <circle className="circuit-bg__via" cx="780" cy="740" r="4" />
        <circle className="circuit-bg__via" cx="340" cy="500" r="4" />
        <circle className="circuit-bg__via" cx="980" cy="400" r="4" />
        <circle className="circuit-bg__via" cx="720" cy="520" r="4" />
      </svg>
    </div>
  );
};

export default CircuitBackground;
