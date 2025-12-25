// Year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Theme toggle
const toggle = document.getElementById("themeToggle");
const root = document.documentElement;

function setTheme(mode) {
  root.dataset.theme = mode;
  localStorage.setItem("theme", mode);
}

// Default to light, respect saved preference
const saved = localStorage.getItem("theme");
if (saved) setTheme(saved);

if (toggle) {
  toggle.addEventListener("click", () => {
    const current = root.dataset.theme || "light";
    setTheme(current === "light" ? "dark" : "light");
  });
}
