import { useWeb3React } from "@web3-react/core";
import { useContext } from "react";
import BSCIcon from "../icons/BSCIcon";
import BurgerMenuIcon from "../icons/BurgerMenuIcon";
import ETHIcon from "../icons/ETHIcon";
import PolygonIcon from "../icons/PolygonIcon";
import WalletIcon from "../icons/WalletIcon";
import { HoveredElement } from "../shared/hooks";
import { ModalsContext } from "../shared/modals";
import { NavContext } from "../shared/nav";
import { chainCodeName } from "../utility";

function Header() {
  const { setMobileNav } = useContext(NavContext);
  const { active, account, activate, chainId } = useWeb3React();

  const { showConnectWalletModal } = useContext(ModalsContext);

  return (
    <div className="flex items-center justify-between mt-4 lg:mx-auto md:w-full lg:max-w-screen-lg">
      <div
        className="h-5 mr-3 text-gray-500 transition duration-200 cursor-pointer hover:text-blue-600 lg:pointer-events-none lg:opacity-0"
        onClick={() => setMobileNav(true)}
      >
        <BurgerMenuIcon className="h-4" />
      </div>
      <div className="flex">
        {chainId && (
          <div className="flex items-center justify-center px-4 py-2 mr-2 space-x-2 font-medium truncate transition-all duration-200 bg-white border rounded-md pointer-events-none text-icons dark:border-gray-500 dark:bg-black dark:text-activetext md:text-sm w-28 lg:w-56 md:w-32">
            {(chainId === 97 || chainId === 56) && (
              <BSCIcon className={"h-4"} />
            )}
            {(chainId === 1 || chainId === 42 || chainId === 3) && (
              <ETHIcon className={"h-4"} />
            )}
            {(chainId === 137 || chainId === 80001) && (
              <PolygonIcon className={"h-4"} />
            )}
            {(chainId === 250 || chainId === 43114) && (
              <ETHIcon className={"h-4"} />
            )}

            <span className="text-xs md:text-sm">{chainCodeName[chainId]}</span>
          </div>
        )}

        {active ? (
          <HoveredElement
            render={binder => (
              <div
                {...binder.bind}
                onClick={() => {
                  // activate(injected);
                  showConnectWalletModal();
                }}
                className="flex items-center space-x-2 text-xs font-medium bg-gray-200 border-2 border-gray-400 rounded-md text-icons dark:border-gray-500 dark:bg-black dark:text-iconsdark md:text-sm hover-blue"
              >
                <div className="flex items-center h-full px-5 border-gray-400 dark:border-gray-500">
                  <p>
                    {account &&
                      `${account?.slice(0, 8)}...${account?.slice(-4)}`}
                  </p>
                </div>
              </div>
            )}
          />
        ) : (
          <button
            type="button"
            className="space-x-2 text-xs btn md:text-sm w-28 from-blue-500 md:w-min to-green-500 hover:from-blue-700 hover:to-green-700"
            onClick={() => {
              // activate(injected);
              showConnectWalletModal();
            }}
          >
            <WalletIcon className="" />
            <p className="truncate">Connect Wallet</p>
          </button>
        )}
      </div>
    </div>
  );
}

export { Header };
