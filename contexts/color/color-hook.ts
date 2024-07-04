export type ColorMode = "dark" | "light";

export interface ColorHook {
  colorMode: ColorMode;
  toggleColorMode: () => void;
  setColorMode: (mode: ColorMode) => void;
}
