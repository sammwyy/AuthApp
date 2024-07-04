"use client";

import React, { PropsWithChildren, useEffect, useState } from "react";
import { ColorHook, ColorMode } from "./color-hook";

const STORAGE_KEY = "color-mode";

function getStorageColor() {
  if (typeof window === "undefined") {
    return "dark";
  }

  return (window.localStorage.getItem(STORAGE_KEY) || "dark") as ColorMode;
}

function setStorageColor(color: ColorMode) {
  window.localStorage.setItem(STORAGE_KEY, color);
}

export const ColorContext = React.createContext<ColorHook>({
  colorMode: "dark",
  setColorMode: () => {},
  toggleColorMode: () => {},
});

export const ColorProvider = ({ children }: PropsWithChildren) => {
  const [colorMode, setColorMode] = useState<ColorMode>(getStorageColor());

  const toggleColorMode = () => {
    const newColorMode = colorMode === "light" ? "dark" : "light";
    setColorMode(newColorMode);
    setStorageColor(newColorMode);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", colorMode);

    if (colorMode == "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [colorMode]);

  return (
    <ColorContext.Provider value={{ colorMode, setColorMode, toggleColorMode }}>
      {children}
    </ColorContext.Provider>
  );
};
