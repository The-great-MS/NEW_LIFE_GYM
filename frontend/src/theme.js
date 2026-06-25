// 🌿 GREEN GYM MULTI-THEME CONFIGURATION (CONTRAST ENHANCED)

export const gymTheme = (isDarkMode) => {
  return {
    // 🎨 BACKGROUNDS
    bgMain: isDarkMode ? "bg-[#0b130e]" : "bg-[#f0f4f1]", // Rich crisp contrast background
    bgCard: isDarkMode ? "bg-[#121e16]" : "bg-white",     // Dark Turf Card vs Absolute Clean White
    bgInput: isDarkMode ? "bg-gray-900" : "bg-gray-100",   // Dark Input vs Structured Light Gray

    // 🔤 TEXT COLORS (CONTRAST ENHANCED FOR READABILITY)
    textPrimary: isDarkMode ? "text-[#39b54a]" : "text-[#1e7e2c]", // Stronger, deeper forest green for Light Mode
    textLight: isDarkMode ? "text-gray-300" : "text-gray-800",     // Solid text weight for readable paragraphs
    textInverse: isDarkMode ? "text-white" : "text-gray-900",      // Deepest black for headers in light mode

    // 🎛️ BORDERS & BUTTONS (MORE DISTINCT)
    borderAccent: isDarkMode ? "border-[#39b54a]/30" : "border-[#1e7e2c]/40", // Bold borders
    borderInput: isDarkMode ? "border-gray-700" : "border-gray-400",

    buttonMain: isDarkMode
      ? "bg-[#39b54a] hover:bg-green-600 text-[#0b130e]"
      : "bg-[#1e7e2c] hover:bg-green-800 text-white font-bold", // Strong solid dark green button

    buttonSecondary: isDarkMode
      ? "bg-[#39b54a]/10 hover:bg-[#39b54a] text-[#39b54a] hover:text-[#0b130e]"
      : "bg-green-100 hover:bg-[#1e7e2c] text-[#1e7e2c] hover:text-white font-bold"
  };
};
