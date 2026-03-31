"use client";

import { useEffect, useState } from "react";
import { Button } from "@radix-ui/themes";
import styles from "./SettingsPanel.module.scss";

const colorVars = [
  "--cube-color-white",
  "--cube-color-yellow",
  "--cube-color-red",
  "--cube-color-orange",
  "--cube-color-green",
  "--cube-color-blue"
] as const;

type ThemeMode = "light" | "dark";

export function SettingsPanel() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem("cube-theme") as ThemeMode | null;
    const nextTheme = savedTheme ?? "dark";
    root.dataset.theme = nextTheme;
    setTheme(nextTheme);
  }, []);

  const updateVar = (name: string, value: string) => {
    document.documentElement.style.setProperty(name, value);
  };

  const updateTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("cube-theme", next);
  };

  const currentVar = (name: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#ffffff";

  return (
    <aside className={styles.root}>
      <button className={styles.gear} onClick={() => setOpen((prev) => !prev)} type="button">
        ⚙
      </button>
      {open && (
        <div className={styles.panel}>
          <h4>Settings</h4>
          {colorVars.map((varName) => (
            <label key={varName} className={styles.row}>
              <span>{varName.replace("--cube-color-", "")}</span>
              <input
                type="color"
                value={currentVar(varName)}
                onChange={(event) => updateVar(varName, event.target.value)}
              />
            </label>
          ))}
          <label className={styles.row}>
            <span>Cube size</span>
            <input
              type="range"
              min={90}
              max={220}
              defaultValue={150}
              onChange={(event) => updateVar("--cube-size", `${event.target.value}px`)}
            />
          </label>
          <label className={styles.row}>
            <span>Glassmorphism</span>
            <input
              type="checkbox"
              defaultChecked
              onChange={(event) =>
                updateVar("--blur-amount", event.target.checked ? "12px" : "0px")
              }
            />
          </label>
          <Button onClick={updateTheme}>Theme: {theme}</Button>
        </div>
      )}
    </aside>
  );
}
