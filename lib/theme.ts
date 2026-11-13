/** Inline script that applies a saved theme before first paint. Kept out of the client component so server code can read the string. */
export const themeScript = `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;
