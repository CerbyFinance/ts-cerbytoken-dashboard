import { createContext, useEffect, useState } from "react";

export const globalTheme = {
  global: {
    colors: {
      "grey-1": "#29343E",
      "white-1": "#FFFFFF",
      text: {
        light: "grey-1",
        dark: "white-1",
      },
      background: {
        light: "#e5e7eb",
        dark: "#000000",
      },
    },
    focus: {
      outline: undefined,
      border: {
        color: "all",
      },
      shadow: undefined,
    },
  },
};

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
