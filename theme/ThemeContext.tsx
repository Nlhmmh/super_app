import { createContext, useContext } from "react";
import { Theme } from "./types";

const ThemeContext = createContext<Theme | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  currentTheme: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  currentTheme,
}) => {
  return (
    <ThemeContext.Provider value={currentTheme}>
      {children}
    </ThemeContext.Provider>
  );
};
