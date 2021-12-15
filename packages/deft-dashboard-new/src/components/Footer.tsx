import { useWeb3React } from "@web3-react/core";
import { useContext, useEffect, useState } from "react";
import CopyIcon from "../icons/CopyIcon";
import DiscordIcon from "../icons/DiscordIcon";
import GithubIcon from "../icons/GithubIcon";
import TelegramIcon from "../icons/TelegramIcon";
import TwitterIcon from "../icons/TwitterIcon";
import YoutubeIcon from "../icons/YoutubeIcon";
import { NavContext } from "../shared/nav";
import { classNames } from "../shared/utils";

function Footer() {
  const { sidebar } = useContext(NavContext);

  const social = [
    {
      link: "https://t.me/CerbyToken",
      icon: <TelegramIcon className="h-4" />,
      name: "Telegram",
    },
    {
      link: "https://twitter.com/CerbyToken",
      icon: <TwitterIcon className="h-4" />,
      name: "Twitter",
    },
    {
      link: "https://discord.gg/w89sgr9WAZ",
      icon: <DiscordIcon className="h-4" />,
      name: "Discord",
    },
    {
      link: "https://www.youtube.com/c/CerbyToken",
      icon: <YoutubeIcon className="h-4" />,
      name: "YouTube",
    },
    {
      link: "https://github.com/DefiFactoryToken/DefiFactoryToken",
      icon: <GithubIcon className="h-4" />,
      name: "GitHub",
    },
  ];

  const { account } = useWeb3React();

  const [referalUrl, setReferalUrl] = useState("");
  useEffect(() => {
    setReferalUrl(
      typeof window !== "undefined"
        ? `${window.location.origin}/?ref=${account || ""}`
        : "",
    );
  }, [account]);

  return (
    <div
      className={classNames(
        sidebar ? "lg:pl-60" : "lg:pl-28",
        "mt-auto inset-x-0 bottom-0 z-10 px-3 py-2 text-xs text-icons bg-background border-t-2 border-gray-300 sm:px-5 dark:bg-black  dark:border-gray-500 transform-all duration-200 lg:pr-4  ",
      )}
    >
      <div className="flex items-center w-full mx-auto lg:justify-between lg:max-w-screen-lg">
        <form className="flex items-center flex-1 lg:mr-10 ">
          <div className="w-32">
            <label className="">My referral link:</label>
          </div>
          <div className="flex items-center w-full p-0 bg-white border-2 rounded-md shadow-sm dark:border-gray-500 dark:bg-black ">
            <input
              className="flex-grow px-2 text-gray-700 border-none lg:mr-3 dark:bg-black dark:text-gray-300 focus:outline-none"
              type="text"
              placeholder="--"
              aria-label="Referal Code"
              value={referalUrl}
              id="referalCodeId"
              readOnly
            />
            <button
              type="button"
              className="flex items-center px-2 py-1 space-x-2 font-medium transition-all duration-200 rounded-md hover:bg-activetextbg hover:text-activetext dark:hover:bg-blue-900 dark:hover:text-blue-300"
              aria-label="Copy Link"
              onClick={() => {
                const copyGfGText = document.getElementById(
                  "referalCodeId",
                ) as HTMLInputElement;
                copyGfGText && copyGfGText.select();
                document.execCommand("copy");
              }}
            >
              <p className="hidden md:inline-block">Copy Link</p>
              <CopyIcon className="" />
            </button>
          </div>
        </form>
        <div className="hidden lg:flex">
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
    </div>
  );
}

export { Footer };
