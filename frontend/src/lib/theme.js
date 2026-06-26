export const themes = [
  { id: "blue", hex: "#1E40AF", on: "#ffffff" },
  { id: "teal", hex: "#0D9488", on: "#ffffff" },
  { id: "purple", hex: "#7C3AED", on: "#3c0091" },
  { id: "orange", hex: "#EA580C", on: "#ffffff" },
  { id: "green", hex: "#16A34A", on: "#ffffff" },
];

const DEFAULT_THEME_ID = "purple";

function hexToRgbA(hex, alpha = 1) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgb(${r} ${g} ${b} / ${alpha})`;
}

export function getSavedTheme() {
  const saved = localStorage.getItem("theme");
  if (saved && themes.some((t) => t.id === saved)) {
    return saved;
  }
  return DEFAULT_THEME_ID;
}

export function applyThemeVariables(themeId) {
  const th = themes.find((t) => t.id === themeId) || themes[2];
  const root = document.documentElement;
  root.style.setProperty("--accent", th.hex);
  root.style.setProperty("--on-accent", th.on);
  root.style.setProperty("--accent-container", hexToRgbA(th.hex, 0.65));
  root.style.setProperty(
    "--on-accent-container",
    th.on === "#ffffff" ? "#1a1a2e" : "#340080"
  );
  root.style.setProperty("--inverse-accent", hexToRgbA(th.hex, 0.55));
  root.style.setProperty("--accent-fixed", hexToRgbA(th.hex, 0.22));
  root.style.setProperty(
    "--on-accent-fixed",
    th.on === "#ffffff" ? "#e0e0ff" : "#23005c"
  );
  root.style.setProperty(
    "--on-accent-fixed-variant",
    th.on === "#ffffff" ? "#c0c0ff" : "#5516be"
  );
}
