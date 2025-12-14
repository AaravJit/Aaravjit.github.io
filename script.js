const yearEl = document.getElementById("year");
yearEl.textContent = new Date().getFullYear();

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

menuBtn?.addEventListener("click", () => {
  const expanded = menuBtn.getAttribute("aria-expanded") === "true";
  menuBtn.setAttribute("aria-expanded", String(!expanded));
  mobileMenu.hidden = expanded;
});

mobileMenu?.addEventListener("click", (e) => {
  const a = e.target.closest("a");
  if (a) {
    menuBtn.setAttribute("aria-expanded", "false");
    mobileMenu.hidden = true;
  }
});

// Theme toggle (dark is default)
const themeToggle = document.getElementById("themeToggle");
const icon = themeToggle?.querySelector(".icon");

function setTheme(mode) {
  document.documentElement.dataset.theme = mode;
  localStorage.setItem("theme", mode);
  if (icon) icon.textContent = mode === "light" ? "☀" : "☾";
}

const saved = localStorage.getItem("theme");
if (saved) setTheme(saved);

themeToggle?.addEventListener("click", () => {
  const cur = document.documentElement.dataset.theme || "dark";
  setTheme(cur === "dark" ? "light" : "dark");
});

// Light theme variables (optional)
const style = document.createElement("style");
style.innerHTML = `
:root[data-theme="light"]{
  --bg0:#f6f7ff;
  --bg1:#eef1ff;
  --text:#0b1020;
  --muted:rgba(11,16,32,.68);
  --glass:rgba(0,0,0,.05);
  --glass2:rgba(0,0,0,.08);
  --stroke:rgba(0,0,0,.12);
  --stroke2:rgba(0,0,0,.18);
  --shadow: 0 20px 80px rgba(0,0,0,.10);
  --shadow2: 0 10px 30px rgba(0,0,0,.08);
}
:root[data-theme="light"] body{
  background: radial-gradient(1200px 900px at 20% 10%, #eef1ff 0%, #f6f7ff 55%, #ffffff 100%);
}
`;
document.head.appendChild(style);

// Copy email
const email = "aaravjit16@gmail.com";
async function copy(text){
  try{
    await navigator.clipboard.writeText(text);
    toast("Copied!");
  }catch{
    toast("Copy failed");
  }
}
document.getElementById("copyEmail")?.addEventListener("click", () => copy(email));
document.getElementById("copyEmail2")?.addEventListener("click", () => copy(email));

// Tiny toast
let toastEl;
function toast(msg){
  if(!toastEl){
    toastEl = document.createElement("div");
    toastEl.style.position = "fixed";
    toastEl.style.bottom = "18px";
    toastEl.style.left = "50%";
    toastEl.style.transform = "translateX(-50%)";
    toastEl.style.padding = "10px 12px";
    toastEl.style.borderRadius = "999px";
    toastEl.style.border = "1px solid rgba(255,255,255,.18)";
    toastEl.style.background = "rgba(255,255,255,.10)";
    toastEl.style.backdropFilter = "blur(16px)";
    toastEl.style.fontWeight = "800";
    toastEl.style.zIndex = "9999";
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = msg;
  toastEl.style.opacity = "1";
  clearTimeout(toastEl._t);
  toastEl._t = setTimeout(()=> toastEl.style.opacity = "0", 900);
}

// Animated counters
const counters = document.querySelectorAll("[data-counter]");
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.getAttribute("data-counter"), 10);
    let cur = 0;
    const step = Math.max(1, Math.floor(target / 60));
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) {
        cur = target;
        clearInterval(t);
      }
      el.textContent = String(cur);
    }, 16);
    io.unobserve(el);
  });
}, { threshold: 0.3 });

counters.forEach((c) => io.observe(c));
