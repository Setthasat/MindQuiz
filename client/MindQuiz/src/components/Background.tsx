function Background() {
  const colors = {
    bg: "#1F05EE",
    gradLight: "#17DFFF",
    gradDark: "#1F05EE",
    gradAltLight: "#1b72f7",
    gradAltDark: "#1F05EE",
  };

  return (
    <div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#1D24CA] to-[#1F05EE] z-[-1] fixed">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2000 1500"
          className="w-full h-full object-cover"
        >
          <rect fill={colors.bg} width="2000" height="1500" />
          <defs>
            <radialGradient id="a" gradientUnits="objectBoundingBox">
              <stop offset="0" stopColor={colors.gradLight} />
              <stop offset="1" stopColor={colors.gradDark} />
            </radialGradient>
            <linearGradient
              id="b"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="750"
              x2="1550"
              y2="750"
            >
              <stop offset="0" stopColor={colors.gradAltLight} />
              <stop offset="1" stopColor={colors.gradAltDark} />
            </linearGradient>
          </defs>
          <g transform="rotate(0 0 0)">
            <g transform="rotate(0 0 0)">
              <circle fill="url(#a)" r="3000" />
              <g opacity="0.5">
                <circle fill="url(#a)" r="2000" />
                <circle fill="url(#a)" r="1800" />
                <circle fill="url(#a)" r="1700" />
                <circle fill="url(#a)" r="1651" />
                <circle fill="url(#a)" r="1450" />
                <circle fill="url(#a)" r="1250" />
                <circle fill="url(#a)" r="1175" />
                <circle fill="url(#a)" r="900" />
                <circle fill="url(#a)" r="750" />
                <circle fill="url(#a)" r="500" />
                <circle fill="url(#a)" r="380" />
                <circle fill="url(#a)" r="250" />
              </g>
              <g transform="rotate(0 0 0)">
                <use href="#g" transform="rotate(10)" />
                <use href="#g" transform="rotate(120)" />
                <use href="#g" transform="rotate(240)" />
              </g>
              <circle fillOpacity="0.1" fill="url(#a)" r="3000" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

export default Background;
