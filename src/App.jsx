import React, { useState, useEffect, useCallback } from "react";

// Translation data
const translations = {
  en: {
    title: "Password Generator",
    subtitle: "Length: 12-16 characters • Special character: @",
    language: "Language",
    generatedPassword: "Generated Password",
    passwordPlaceholder: "Your password will appear here",
    strength: "Strength",
    characters: "characters",
    passwordLength: "Password Length",
    characterOptions: "Character Options",
    includeUppercase: "Uppercase Letters",
    uppercaseChars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    includeLowercase: "Lowercase Letters",
    lowercaseChars: "abcdefghijklmnopqrstuvwxyz",
    includeNumbers: "Numbers",
    numberChars: "0123456789",
    includeSymbols: "Special Character",
    symbolChars: "@",
    generateButton: "Generate New Password",
    copyButton: "Copy",
    copied: "Copied!",
    securityTips: "Security Tips",
    tip1: "Use 12-16 characters for optimal security and memorability",
    tip2: "Combine uppercase, lowercase, numbers, and @ for maximum strength",
    tip3: "Avoid using personal information in passwords",
    tip4: "Use different passwords for important accounts",
    footer:
      "Made with React & Tailwind CSS • Length: 12-16 characters • Special character: @",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
  },
  vi: {
    title: "Trình Tạo Mật Khẩu",
    subtitle: "Độ dài: 12-16 ký tự • Ký tự đặc biệt: @",
    language: "Ngôn ngữ",
    generatedPassword: "Mật Khẩu Được Tạo",
    passwordPlaceholder: "Mật khẩu sẽ xuất hiện ở đây",
    strength: "Độ Mạnh",
    characters: "ký tự",
    passwordLength: "Độ Dài Mật Khẩu",
    characterOptions: "Tùy Chọn Ký Tự",
    includeUppercase: "Chữ Hoa",
    uppercaseChars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    includeLowercase: "Chữ Thường",
    lowercaseChars: "abcdefghijklmnopqrstuvwxyz",
    includeNumbers: "Số",
    numberChars: "0123456789",
    includeSymbols: "Ký Tự Đặc Biệt",
    symbolChars: "@",
    generateButton: "Tạo Mật Khẩu Mới",
    copyButton: "Sao Chép",
    copied: "Đã Sao Chép!",
    securityTips: "Mẹo Bảo Mật",
    tip1: "Sử dụng 12-16 ký tự để cân bằng giữa bảo mật và dễ nhớ",
    tip2: "Kết hợp chữ hoa, chữ thường, số và @ để tăng độ mạnh",
    tip3: "Tránh sử dụng thông tin cá nhân trong mật khẩu",
    tip4: "Sử dụng mật khẩu khác nhau cho các tài khoản quan trọng",
    footer:
      "Được tạo bằng React & Tailwind CSS • Độ dài: 12-16 ký tự • Ký tự đặc biệt: @",
    theme: "Giao Diện",
    light: "Sáng",
    dark: "Tối",
    system: "Hệ Thống",
  },
};

// Custom Checkbox Component
const CustomCheckbox = ({
  checked,
  onChange,
  label,
  description,
  className = "",
}) => {
  return (
    <label
      className={`flex items-start space-x-3 cursor-pointer group p-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
        checked
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
          : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
      } ${className}`}
    >
      <div className="relative mt-1">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div
          className={`w-6 h-6 rounded-lg border-2 transition-all duration-300 flex items-center justify-center ${
            checked
              ? "bg-blue-500 border-blue-500 scale-110"
              : "bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 group-hover:border-blue-300"
          }`}
        >
          {checked && (
            <svg
              className="w-4 h-4 text-white animate-scaleIn"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
      <div className="flex-1">
        <span
          className={`font-semibold transition-colors duration-300 ${
            checked
              ? "text-blue-700 dark:text-blue-300"
              : "text-gray-900 dark:text-white"
          }`}
        >
          {label}
        </span>
        <p
          className={`text-sm mt-1 transition-colors duration-300 ${
            checked
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {description}
        </p>
      </div>
    </label>
  );
};

function App() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(14);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [strength, setStrength] = useState("");
  const [theme, setTheme] = useState("system");
  const [language, setLanguage] = useState("vi");
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const t = translations[language];

  // Character sets
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const symbolChars = "@";

  // Generate password function
  const generatePassword = useCallback(async () => {
    setIsGenerating(true);

    // Add slight delay for animation
    await new Promise((resolve) => setTimeout(resolve, 150));

    let chars = "";
    let generatedPassword = "";

    if (includeUppercase) chars += uppercaseChars;
    if (includeLowercase) chars += lowercaseChars;
    if (includeNumbers) chars += numberChars;
    if (includeSymbols) chars += symbolChars;

    if (chars === "") {
      setPassword("");
      setStrength("Weak");
      setIsGenerating(false);
      return;
    }

    // Ensure at least one character from each selected type
    let tempPassword = "";

    if (includeUppercase) {
      const randomIndex = Math.floor(Math.random() * uppercaseChars.length);
      tempPassword += uppercaseChars[randomIndex];
    }
    if (includeLowercase) {
      const randomIndex = Math.floor(Math.random() * lowercaseChars.length);
      tempPassword += lowercaseChars[randomIndex];
    }
    if (includeNumbers) {
      const randomIndex = Math.floor(Math.random() * numberChars.length);
      tempPassword += numberChars[randomIndex];
    }
    if (includeSymbols) {
      tempPassword += "@";
    }

    // Add random characters to reach desired length
    for (let i = tempPassword.length; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      tempPassword += chars[randomIndex];
    }

    // Shuffle the password
    generatedPassword = tempPassword
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    setPassword(generatedPassword);
    calculateStrength(generatedPassword);
    setIsGenerating(false);
  }, [
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
  ]);

  // Calculate password strength
  const calculateStrength = (pwd) => {
    let score = 0;

    if (pwd.length >= 12) score++;
    if (pwd.length >= 14) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/@/.test(pwd)) score++;

    if (score <= 2) setStrength("Weak");
    else if (score <= 4) setStrength("Medium");
    else setStrength("Strong");
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    if (!password) return;

    try {
      await navigator.clipboard.writeText(password);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // Theme handling
  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.toggle("dark", systemTheme === "dark");
    } else {
      root.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  // Generate password on mount and when dependencies change
  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                {t.title}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {t.subtitle}
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Language Selector */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {t.language}:
                </span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-md"
                >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                </select>
              </div>

              {/* Theme Selector */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {t.theme}:
                </span>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-md"
                >
                  <option value="light">{t.light}</option>
                  <option value="dark">{t.dark}</option>
                  <option value="system">{t.system}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border border-white/50 dark:border-gray-700/50">
          {/* Password Display */}
          <div className="mb-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
              <label className="text-lg font-semibold text-gray-900 dark:text-white">
                {t.generatedPassword}
              </label>
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-semibold px-3 py-1.5 rounded-full border transition-all duration-300 ${
                    strength === "Weak"
                      ? "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
                      : strength === "Medium"
                      ? "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800"
                      : "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                  }`}
                >
                  {t.strength}: {strength}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {password.length} {t.characters}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={password}
                  readOnly
                  className="w-full px-6 py-4 pr-32 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-lg font-mono text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500"
                  placeholder={t.passwordPlaceholder}
                />
                {isCopied && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium animate-bounce">
                    {t.copied}
                  </div>
                )}
              </div>

              <button
                onClick={copyToClipboard}
                disabled={!password}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 sm:w-auto w-full shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                {t.copyButton}
              </button>
            </div>
          </div>

          {/* Password Length Slider */}
          <div
            className="mb-8 animate-fadeIn"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex justify-between items-center mb-4">
              <label className="text-xl font-semibold text-gray-900 dark:text-white">
                {t.passwordLength}:{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  {length}
                </span>
              </label>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                12-16
              </span>
            </div>
            <input
              type="range"
              min="12"
              max="16"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-xl appearance-none cursor-pointer slider-thumb"
            />
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2 px-1">
              {[12, 13, 14, 15, 16].map((num) => (
                <span
                  key={num}
                  className={`font-medium ${
                    length === num
                      ? "text-blue-600 dark:text-blue-400 scale-110"
                      : ""
                  } transition-transform duration-200`}
                >
                  {num}
                </span>
              ))}
            </div>
          </div>

          {/* Character Options */}
          <div
            className="mb-8 animate-fadeIn"
            style={{ animationDelay: "0.2s" }}
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t.characterOptions}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <CustomCheckbox
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                label={t.includeUppercase}
                description={t.uppercaseChars}
              />
              <CustomCheckbox
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                label={t.includeLowercase}
                description={t.lowercaseChars}
              />
              <CustomCheckbox
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                label={t.includeNumbers}
                description={t.numberChars}
              />
              <CustomCheckbox
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                label={t.includeSymbols}
                description={t.symbolChars}
              />
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generatePassword}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-5 px-6 rounded-xl transition-all duration-300 text-lg flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95 disabled:transform-none disabled:cursor-not-allowed "
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {t.generateButton}
              </>
            )}
          </button>
        </div>

        {/* Security Tips Section */}
        <div
          className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm animate-fadeIn"
          style={{ animationDelay: "0.3s" }}
        >
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            {t.securityTips}
          </h3>
          <ul className="text-blue-800 dark:text-blue-200 space-y-3 text-sm">
            {[t.tip1, t.tip2, t.tip3, t.tip4].map((tip, index) => (
              <li
                key={index}
                className="flex items-start gap-3 group hover:translate-x-1 transition-transform duration-200"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 group-hover:scale-150 transition-transform duration-200"></div>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-8 text-center text-gray-600 dark:text-gray-400 text-sm border-t border-gray-200/50 dark:border-gray-700/50">
        <p>{t.footer}</p>
      </footer>
    </div>
  );
}

export default App;
