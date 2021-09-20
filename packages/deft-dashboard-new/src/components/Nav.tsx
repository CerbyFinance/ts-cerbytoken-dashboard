// import { getPresaleList, SET_ACTIVE_SUB_MENU } from "../store/action";
// import { IState } from "../store/store";
import { useContext } from "react";
import { matchPath, useHistory, useLocation } from "react-router-dom";
import useMedia from "use-media";
import CloseMenuIcon from "../icons/CloseMenuIcon";
import CrossChainBridgeIcon from "../icons/CrossChainBridgeIcon";
import DayModeIcon from "../icons/DayModeIcon";
import DefiFactoryIcon from "../icons/DefiFactoryIcon";
import DiscordIcon from "../icons/DiscordIcon";
import GithubIcon from "../icons/GithubIcon";
import LaunchpadIcon from "../icons/LaunchpadIcon";
import LeftArrowIcon from "../icons/LeftArrowIcon";
import MediumIcon from "../icons/MediumIcon";
import NightModeIcon from "../icons/NightModeIcon";
import RightArrowIcon from "../icons/RightArrowIcon";
import TelegramIcon from "../icons/TelegramIcon";
import TwitterIcon from "../icons/TwitterIcon";
import VestingIcon from "../icons/VestingIcon";
import WhitepaperIcon from "../icons/WhitepaperIcon";
import YoutubeIcon from "../icons/YoutubeIcon";
import { NavContext } from "../shared/nav";
import { ThemeContext } from "../shared/theme";
import { classNames } from "../shared/utils";

const isActivePath = (path: string, currentPath: string) => {
  const result = matchPath(currentPath, {
    path,
    exact: false,
    strict: false,
  });

  return result ? true : false;
};

function Nav() {
  const { theme, setTheme } = useContext(ThemeContext);
  const { mobileNav, setMobileNav, setSidebar, sidebar } =
    useContext(NavContext);

  const isTabletOrMobile = useMedia({
    maxWidth: "1023px",
  });

  const location = useLocation();

  const history = useHistory();

  const navigation = [
    {
      icon: <LaunchpadIcon className="" />,
      name: "Presale",
      path: "/presale",
    },
    {
      icon: <VestingIcon className="" />,
      name: "Vesting",
      path: "/vesting",
    },
    {
      icon: <CrossChainBridgeIcon className="" />,
      name: "Cross-Chain Bridge",
      path: "https://bridge.defifactory.fi/",
      isExternal: true,
    },
  ];

  const darkmode = [
    { icon: <DayModeIcon className="" />, name: "Day", type: "light" },
    { icon: <NightModeIcon className="" />, name: "Night", type: "dark" },
  ];

  const social = [
    {
      link: "https://t.me/DefiFactory",
      icon: <TelegramIcon className="h-4" />,
      name: "Telegram",
    },
    {
      link: "https://twitter.com/DefiFactory",
      icon: <TwitterIcon className="h-4" />,
      name: "Twitter",
    },
    {
      link: "https://discord.gg/w89sgr9WAZ",
      icon: <DiscordIcon className="h-4" />,
      name: "Discord",
    },
    {
      link: "https://www.youtube.com/channel/UCWt80BebLmUWkWBPx4d_Q3A",
      icon: <YoutubeIcon className="h-4" />,
      name: "YouTube",
    },
    {
      link: "https://github.com/DefiFactoryToken/DefiFactoryToken",
      icon: <GithubIcon className="h-4" />,
      name: "GitHub",
    },
    {
      link: "https://defi-factory.medium.com/",
      icon: <MediumIcon className="h-4" />,
      name: "Medium",
    },
  ];

  return (
    <nav
      className={classNames(
        mobileNav ? "" : "transform",
        "fixed inset-y-0 left-0 z-40 flex flex-col justify-between max-w-xs w-5/6 max-h-screen py-8 px-5 text-icons transition-all duration-200 -translate-x-full bg-white border-r-2 lg:translate-x-0  lg:p-3 dark:border-gray-500 dark:bg-black ",
        sidebar ? "lg:w-56" : " lg:w-24",
      )}
    >
      <div className="">
        <div className="relative">
          {sidebar ? (
            <div
              className="absolute right-0 hidden h-5 transform translate-x-6 rounded-full cursor-pointer lg:block top-1"
              onClick={() => setSidebar(false)}
            >
              <LeftArrowIcon />
            </div>
          ) : (
            <div
              className="absolute right-0 hidden h-5 transform translate-x-6 rounded-full cursor-pointer lg:block top-1"
              onClick={() => setSidebar(true)}
            >
              <RightArrowIcon />
            </div>
          )}
          <div className="relative flex items-center justify-center font-semibold ">
            <div
              className="absolute left-0 h-5 mr-3 transition duration-200 cursor-pointer hover:text-activetext lg:hidden"
              onClick={() => setMobileNav(false)}
            >
              <CloseMenuIcon className="h-4" />
            </div>
            <div
              className="flex items-center justify-center cursor-pointer overflow-ellipsis"
              onClick={() => history.push("/")}
            >
              <DefiFactoryIcon className="" />
              {(sidebar || isTabletOrMobile) && (
                <span
                  className={`${
                    sidebar ? "min-w-min" : "w-0"
                  }  ml-3 overflow-hidden  text-black dark:text-white whitespace-nowrap`}
                >
                  Defi Factory
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex-grow overflow-x-hidden overflow-y-auto">
          <ul className="flex flex-col py-6 space-y-1">
            {navigation.map(({ icon, name, path, isExternal }) => (
              <li key={name}>
                <div
                  className={classNames(
                    isActivePath(path, location.pathname)
                      ? "bg-activetextbg  dark:bg-darksecondary text-activetext"
                      : "",
                    sidebar ? "pl-3" : " lg:justify-center",
                    mobileNav && isTabletOrMobile ? "pl-3" : "",
                    "flex items-center cursor-pointer transition-all duration-200 rounded-md h-11 focus:outline-none hover:bg-activetextbg hover:text-activetext dark:hover:bg-blue-900 dark:hover:text-blue-300 flex-nowrap overflow-hidden",
                  )}
                  onClick={() => {
                    if (isExternal) {
                      window.open(path);
                    } else {
                      history.push(path);
                    }
                  }}
                >
                  <span className="items-center justify-center inline">
                    {icon}
                  </span>
                  {(sidebar || isTabletOrMobile) && (
                    <span className="ml-3 text-sm font-medium tracking-wide truncate ">
                      {name}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="">
        <div
          onClick={() =>
            window.open(
              "https://defifactory.finance/wp-content/uploads/sites/10/2021/05/DeFT_whitepaper.pdf",
            )
          }
          className="flex items-center justify-center mb-5 transition-all duration-200 cursor-pointer hover:text-activetext"
        >
          <WhitepaperIcon className="" />
          {(sidebar || isTabletOrMobile) && (
            <span className="ml-3">Whitepaper</span>
          )}
        </div>
        <div className="flex justify-center my-3">
          {darkmode.map(({ icon, name, type }) => (
            <button
              key={name}
              type="button"
              className={`${
                theme === type
                  ? "bg-activetextbg text-activetext dark:bg-blue-900 dark:text-blue-300"
                  : ""
              } flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 rounded-md dark:hover:bg-blue-900 dark:hover:text-blue-300 hover:bg-activetextbg hover:text-activetext`}
              onClick={() => setTheme(type)}
            >
              {icon}
              {(sidebar || isTabletOrMobile) && (
                <span className="ml-3">{name}</span>
              )}
            </button>
          ))}
        </div>
        <div className="flex justify-center lg:hidden">
          {social.map(({ icon, name, link }) => (
            <div
              className="h-5 mr-3 transition-all duration-200 cursor-pointer hover:text-iconsdark last:mr-0 "
              key={name}
              onClick={() => window.open(link)}
            >
              {icon}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}

export { Nav };
