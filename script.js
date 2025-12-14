// year
document.getElementById("year").textContent = new Date().getFullYear();

// theme toggle
const toggle = document.getElementById("themeToggle");

function setTheme(mode) {
  document.documentElement.dataset.theme = mode;
  localStorage.setItem("theme", mode);
  toggle.textContent = mode === "light" ? "☀️" : "🌙";
}

const saved = localStorage.getItem("theme");
if (saved) setTheme(saved);

toggle.addEventListener("click", () => {
  const current = document.documentElement.dataset.theme || "dark";
  setTheme(current === "dark" ? "light" : "dark");
});
