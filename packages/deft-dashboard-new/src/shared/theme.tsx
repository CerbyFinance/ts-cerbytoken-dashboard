import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext({
  theme: "light",
  setTheme: (theme: string) => {},
});

const getInitialTheme = () => {
  if (typeof window !== "undefined" && window.localStorage) {
    const storedPrefs = window.localStorage.getItem("color-theme");
    if (typeof storedPrefs === "string") {
      return storedPrefs;
    }
  }

  return "light";
};

export const ThemeProvider = ({
  initialTheme,
  children,
}: {
  initialTheme?: string;
  children: JSX.Element;
}) => {
  const [theme, setTheme] = useState(getInitialTheme);

  const rawSetTheme = (theme: string) => {
    const root = window.document.documentElement;
    const isDark = theme === "dark";

    root.classList.remove(isDark ? "light" : "dark");
    root.classList.add(theme);

    localStorage.setItem("color-theme", theme);
  };

  if (initialTheme) {
    rawSetTheme(initialTheme);
  }

  useEffect(() => {
    rawSetTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
