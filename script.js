// DOM Elements
const generatedPassword = document.getElementById("generatedPassword");
const passwordInput = document.getElementById("passwordInput");
const passwordLength = document.getElementById("passwordLength");
const lengthValue = document.getElementById("lengthValue");
const uppercase = document.getElementById("uppercase");
const lowercase = document.getElementById("lowercase");
const numbers = document.getElementById("numbers");
const special = document.getElementById("special");
const generateBtn = document.getElementById("generatePassword");
const copyBtn = document.getElementById("copyPassword");
const togglePassword = document.getElementById("togglePassword");
const toggleCheckPassword = document.getElementById("toggleCheckPassword");
const themeToggle = document.getElementById("themeToggle");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");
const suggestions = document.getElementById("suggestions");

// Character sets
const charSets = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  special: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

// Theme handling
const savedTheme = localStorage.getItem("theme") || "light";
document.body.classList.add(savedTheme + "-mode");
updateThemeIcon();

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  document.body.classList.toggle("dark-mode");
  const currentTheme = document.body.classList.contains("dark-mode")
    ? "dark"
    : "light";
  localStorage.setItem("theme", currentTheme);
  updateThemeIcon();
});

function updateThemeIcon() {
  const icon = themeToggle.querySelector("i");
  icon.className = document.body.classList.contains("dark-mode")
    ? "fas fa-sun"
    : "fas fa-moon";
}

// Password length slider
passwordLength.addEventListener("input", () => {
  lengthValue.textContent = passwordLength.value;
  updateRangeProgress(passwordLength);
});

function updateRangeProgress(rangeInput) {
  const min = rangeInput.min || 0;
  const max = rangeInput.max || 100;
  const val = rangeInput.value;
  const percentage = ((val - min) * 100) / (max - min);
  rangeInput.style.setProperty("--range-progress", `${percentage}%`);
}

// Password visibility toggle
togglePassword.addEventListener("click", () => {
  const type = generatedPassword.type === "password" ? "text" : "password";
  generatedPassword.type = type;
  togglePassword.querySelector("i").className =
    type === "password" ? "fas fa-eye" : "fas fa-eye-slash";
});

toggleCheckPassword.addEventListener("click", () => {
  const type = passwordInput.type === "password" ? "text" : "password";
  passwordInput.type = type;
  toggleCheckPassword.querySelector("i").className =
    type === "password" ? "fas fa-eye" : "fas fa-eye-slash";
});

// Copy password to clipboard
copyBtn.addEventListener("click", async () => {
  if (generatedPassword.value) {
    try {
      await navigator.clipboard.writeText(generatedPassword.value);
      copyBtn.querySelector("i").className = "fas fa-check";
      setTimeout(() => {
        copyBtn.querySelector("i").className = "fas fa-copy";
      }, 2000);
    } catch (err) {
      console.error("Failed to copy password:", err);
    }
  }
});

// Generate password
generateBtn.addEventListener("click", () => {
  let availableChars = "";
  let password = "";

  if (uppercase.checked) availableChars += charSets.uppercase;
  if (lowercase.checked) availableChars += charSets.lowercase;
  if (numbers.checked) availableChars += charSets.numbers;
  if (special.checked) availableChars += charSets.special;

  if (!availableChars) {
    alert("Please select at least one character type");
    return;
  }

  const length = parseInt(passwordLength.value);
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * availableChars.length);
    password += availableChars[randomIndex];
  }

  generatedPassword.value = password;
  generatedPassword.type = "text";
  checkPasswordStrength(password);
});

// Password strength checker
function checkPasswordStrength(password) {
  let strength = 0;
  let feedback = [];

  // Length check
  if (password.length >= 12) strength += 25;
  else if (password.length >= 8) strength += 15;
  else feedback.push("Password should be at least 8 characters long");

  // Character variety checks
  if (/[A-Z]/.test(password)) strength += 25;
  else feedback.push("Add uppercase letters");

  if (/[a-z]/.test(password)) strength += 25;
  else feedback.push("Add lowercase letters");

  if (/[0-9]/.test(password)) strength += 15;
  else feedback.push("Add numbers");

  if (/[^A-Za-z0-9]/.test(password)) strength += 10;
  else feedback.push("Add special characters");

  // Update UI
  strengthBar.style.width = `${strength}%`;
  strengthBar.className = "progress-bar " + getStrengthClass(strength);
  strengthText.textContent = getStrengthText(strength);

  if (feedback.length > 0) {
    suggestions.textContent = "Suggestions: " + feedback.join(", ");
    suggestions.classList.remove("d-none");
  } else {
    suggestions.classList.add("d-none");
  }
}

function getStrengthClass(strength) {
  if (strength < 50) return "strength-weak";
  if (strength < 75) return "strength-medium";
  return "strength-strong";
}

function getStrengthText(strength) {
  if (strength < 50) return "Weak Password";
  if (strength < 75) return "Medium Password";
  return "Strong Password";
}

// Real-time password strength checking
passwordInput.addEventListener("input", (e) => {
  checkPasswordStrength(e.target.value);
});

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  updateRangeProgress(passwordLength);
  generateBtn.click();
});
