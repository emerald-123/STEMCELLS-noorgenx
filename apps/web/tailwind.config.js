module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#0A0D14",
        slateElevated: "#121824",
        convexBorder: "#1F293D",
        noorEmerald: "#10B981",
        cyanCore: "#06B6D4",
        alertAmber: "#F59E0B",
        signalRose: "#F43F5E",
      },
      boxShadow: {
        convex: "6px 6px 12px #07090e, -6px -6px 12px #151d2c",
        concave: "inset 4px 4px 8px #07090e, inset -4px -4px 8px #151d2c",
        glowEmerald: "0 0 15px rgba(16, 185, 129, 0.3)",
        glowCyan: "0 0 15px rgba(6, 182, 212, 0.3)",
      }
    },
  },
  plugins: [],
}
