import { createContext, useState } from "react";

export const NavContext = createContext({
  mobileNav: false,
  sidebar: false,
  setMobileNav: (value: boolean) => {},
  setSidebar: (value: boolean) => {},
});

export const NavProvider = ({ children }: { children: JSX.Element }) => {
  const [mobileNav, setMobileNav] = useState<boolean>(false);
  const [sidebar, setSidebar] = useState<boolean>(false);

  return (
    <NavContext.Provider
      value={{ mobileNav, setMobileNav, setSidebar, sidebar }}
    >
      {children}
    </NavContext.Provider>
  );
};
