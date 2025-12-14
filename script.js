:root {
  --bg:#070a14;
  --bg2:#0b1030;
  --text:#e9ecff;
  --muted:rgba(233,236,255,.7);
  --glass:rgba(255,255,255,.1);
  --border:rgba(255,255,255,.2);
}

* { box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  margin: 0;
  font-family: Inter, system-ui, sans-serif;
  background: radial-gradient(circle at top, var(--bg2), var(--bg));
  color: var(--text);

  /* hide scrollbar */
  -ms-overflow-style: none;
  scrollbar-width: none;
}
body::-webkit-scrollbar { display: none; }

.container {
  max-width: 1100px;
  margin: auto;
  padding: 40px 20px;
}

/* background blobs */
.bg { position: fixed; inset: 0; z-index: -1; }
.blob {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  filter: blur(50px);
  opacity: .6;
}
.b1 { background:#7aa0ff; top:-150px; left:-150px; }
.b2 { background:#57ffd1; top:100px; right:-150px; }
.b3 { background:#ff78d6; bottom:-200px; left:30%; }

/* glass */
.glass {
  background: var(--glass);
  border: 1px solid var(--border);
  border-radius: 20px;
  backdrop-filter: blur(18px);
  padding: 24px;
}

/* nav */
.top { position: sticky; top: 20px; z-index: 10; }
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.links a {
  margin-left: 16px;
  text-decoration: none;
  color: var(--muted);
  font-weight: 700;
}
.links a:hover { color: var(--text); }

.theme-btn {
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 8px 12px;
  cursor: pointer;
  color: var(--text);
}

/* hero */
.hero { margin-top: 80px; }
.hero h1 {
  font-size: clamp(32px, 5vw, 52px);
  line-height: 1.1;
}
.subtitle { font-size: 18px; color: var(--muted); max-width: 800px; }
.tagline { font-weight: 700; margin-top: 12px; }

.cta { margin-top: 24px; display: flex; gap: 12px; }

/* buttons */
.btn {
  padding: 12px 18px;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 700;
}
.primary {
  background: linear-gradient(135deg, #7aa0ff, #57ffd1);
  color: #000;
}
.ghost {
  border: 1px solid var(--border);
  color: var(--text);
}

/* sections */
.section { margin-top: 80px; }
.section h2 { font-size: 28px; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.card h3 { margin-top: 0; }
.card p { color: var(--muted); line-height: 1.6; }

.card-links { margin-top: 12px; }
.card-links a, .card-links span {
  font-weight: 700;
  color: var(--text);
  text-decoration: none;
}

/* footer */
.footer {
  margin: 80px 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.footer a {
  color: var(--muted);
  text-decoration: none;
}
.footer a:hover { color: var(--text); }

/* light mode */
:root[data-theme="light"] {
  --bg:#f5f7ff;
  --bg2:#ffffff;
  --text:#0c1020;
  --muted:rgba(12,16,32,.65);
  --glass:rgba(0,0,0,.05);
  --border:rgba(0,0,0,.15);
}
