// src/app.styles.ts
import type { CSSProperties } from "react";

export type Theme = "dark" | "light";

export function createPalette(theme: Theme) {
  const isDark = theme === "dark";

  return {
    pageBg: isDark ? "#0b0f14" : "#f6f7fb",
    text: isDark ? "#ffffff" : "#0f172a",
    mutedText: isDark ? "rgba(255,255,255,0.7)" : "rgba(15,23,42,0.65)",

    panelBg: isDark ? "rgba(255,255,255,0.03)" : "#ffffff",
    border: isDark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.12)",

    controlBg: isDark ? "rgba(0,0,0,0.25)" : "#ffffff",
    controlBorder: isDark ? "rgba(255,255,255,0.14)" : "rgba(15,23,42,0.18)",
    controlText: isDark ? "#ffffff" : "#0f172a",

    activeBg: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.06)",
    activeBorder: isDark ? "rgba(255,255,255,0.35)" : "rgba(15,23,42,0.28)",

    tableHeadBorder: isDark ? "rgba(255,255,255,0.15)" : "rgba(15,23,42,0.15)",
    tableRowBorder: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)",
  };
}

export function createStyles(palette: ReturnType<typeof createPalette>, theme: Theme) {
  const isDark = theme === "dark";

  const row: CSSProperties = {
    display: "flex",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
  };

  const btn: CSSProperties = {
    padding: "10px 14px",
    borderRadius: 10,
    border: `1px solid ${palette.controlBorder}`,
    background: palette.controlBg,
    color: palette.controlText,
    cursor: "pointer",
  };

  const btnActive: CSSProperties = {
    ...btn,
    border: `1px solid ${palette.activeBorder}`,
    background: palette.activeBg,
  };

  const input: CSSProperties = {
    padding: "10px 12px",
    borderRadius: 10,
    border: `1px solid ${palette.controlBorder}`,
    background: palette.controlBg,
    color: palette.controlText,
    outline: "none",
    minWidth: 220,
  };

  const select: CSSProperties = {
    ...input,
    minWidth: 260,
  };

  const panelBox: CSSProperties = {
    border: `1px solid ${palette.border}`,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    background: palette.panelBg,
  };

  // Full-window layout (no "card"/fixed border feel)
  const page: CSSProperties = {
    width: "100%",
    minHeight: "100vh",
    margin: 0,
    padding: 16,
    fontFamily: "system-ui, sans-serif",
    color: palette.text,
    background: palette.pageBg,
  };

  const table: CSSProperties = { borderCollapse: "collapse" };

  const tableHeadRow: CSSProperties = {
    textAlign: "left",
    borderBottom: `1px solid ${palette.tableHeadBorder}`,
  };

  const tableRow: CSSProperties = {
    borderBottom: `1px solid ${palette.tableRowBorder}`,
  };

  // Toggle button (top-right)
  const toggleButton: CSSProperties = {
    position: "fixed",
    top: 14,
    right: 14,
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 10px",
    borderRadius: 999,
    border: `1px solid ${palette.controlBorder}`,
    background: palette.controlBg,
    color: palette.controlText,
    cursor: "pointer",
    userSelect: "none",
    zIndex: 10,
  };

  const toggleTrack: CSSProperties = {
    width: 44,
    height: 24,
    borderRadius: 999,
    border: `1px solid ${palette.controlBorder}`,
    background: isDark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.10)",
    position: "relative",
  };

  const toggleThumb: CSSProperties = {
    width: 18,
    height: 18,
    borderRadius: 999,
    position: "absolute",
    top: 2,
    left: isDark ? 22 : 2, // slide
    transition: "left 120ms ease",
    background: isDark ? "#ffffff" : "#0f172a",
  };

  const headerTopSpace: CSSProperties = {
    // so the fixed toggle doesn't overlap your title area on small screens
    paddingTop: 6,
  };

  return {
    row,
    btn,
    btnActive,
    input,
    select,
    panelBox,
    page,
    table,
    tableHeadRow,
    tableRow,
    toggleButton,
    toggleTrack,
    toggleThumb,
    headerTopSpace,
  };
}
