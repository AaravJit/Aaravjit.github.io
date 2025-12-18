// year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// theme toggle
const toggle = document.getElementById("themeToggle");

function setTheme(mode) {
  document.documentElement.dataset.theme = mode;
  localStorage.setItem("theme", mode);
  if (toggle) {
    toggle.textContent = mode === "light" ? "☀️" : "🌙";
  }
}

const saved = localStorage.getItem("theme");
setTheme(saved || "dark");

if (toggle) {
  toggle.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme || "dark";
    setTheme(current === "dark" ? "light" : "dark");
  });
}

// tilt interactions
const tiltItems = document.querySelectorAll("[data-tilt]");

tiltItems.forEach((item) => {
  item.addEventListener("mousemove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    item.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  item.addEventListener("mouseleave", () => {
    item.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  });
});

// flyout toggles
const openButtons = document.querySelectorAll("[data-target]");
const flyouts = document.querySelectorAll(".flyout");

function closeFlyouts() {
  flyouts.forEach((panel) => panel.classList.remove("open"));
}

openButtons.forEach((btn) => {
  const targetId = btn.getAttribute("data-target");
  const panel = document.getElementById(targetId);
  if (!panel) return;

  btn.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = panel.classList.contains("open");
    closeFlyouts();
    if (!isOpen) panel.classList.add("open");
  });
});

flyouts.forEach((panel) => {
  panel.addEventListener("click", (event) => event.stopPropagation());
  const closeBtn = panel.querySelector("[data-close]");
  closeBtn?.addEventListener("click", () => panel.classList.remove("open"));
});

document.addEventListener("click", closeFlyouts);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeFlyouts();
});

// skill lab
const skillButtons = document.querySelectorAll("[data-skill]");
const skillTitle = document.querySelector("[data-skill-title]");
const skillBody = document.querySelector("[data-skill-body]");
const skillPills = document.querySelector("[data-skill-pills]");

const skillCopy = {
  frontend: {
    title: "Interactive UI systems",
    body: "Ship responsive layouts with motion and accessibility baked in. I pair design tokens with reusable glass components so the UI feels cohesive.",
    pills: ["React patterns", "Animation", "Design systems"],
  },
  backend: {
    title: "Service-minded backends",
    body: "APIs designed around contracts, validation, and observability. I keep payloads lean, schemas versioned, and logs human-friendly.",
    pills: ["API design", "Authentication", "Data modeling"],
  },
  automation: {
    title: "Automation + tooling",
    body: "Browser scripting, CLI tools, and repeatable setup scripts. If a task repeats, I script it so focus stays on building.",
    pills: ["Playwright", "Bash/Python", "CI hygiene"],
  },
  ai: {
    title: "AI & ML touches",
    body: "Prototype agents that combine retrieval, reranking, and vision. Always paired with UX that explains the why behind a result.",
    pills: ["Vector search", "Prompt design", "Evaluation"],
  },
};

skillButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.getAttribute("data-skill");
    const copy = skillCopy[key];
    if (!copy) return;

    skillButtons.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");

    skillTitle.textContent = copy.title;
    skillBody.textContent = copy.body;

    if (skillPills) {
      skillPills.innerHTML = copy.pills.map((pill) => `<span class="tag">${pill}</span>`).join("");
    }
  });
});
