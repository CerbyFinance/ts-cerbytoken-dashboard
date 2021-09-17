import { useWeb3React } from "@web3-react/core";
import { Progress } from "antd";
import { useContext } from "react";
import BSCIcon from "../icons/BSCIcon";
import ETHIcon from "../icons/ETHIcon";
import InfoIcon from "../icons/InfoIcon";
import PolygonIcon from "../icons/PolygonIcon";
import QuestionMarkIcon from "../icons/QuestionMarkIcon";
import TelegramCardIcon from "../icons/TelegramCardIcon";
import WebsiteCardIcon from "../icons/WebsiteCardIcon";
import { PresaleItem } from "../shared/api.d";
import { NavContext } from "../shared/nav";
import { ThemeContext } from "../shared/theme";
import { classNames } from "../shared/utils";
import {
  chainCodeSymbol,
  networkChainButton,
  progressGradientColor,
} from "../utility";
import { MyModal } from "./MyModal";

function PresaleCard({
  chainId,
  presaleList,
  walletInfo,
  tokenomics,
  listingPrice,
}: PresaleItem) {
  const { sidebar } = useContext(NavContext);

  const { theme } = useContext(ThemeContext);

  const cardSocial = [
    {
      icon: <WebsiteCardIcon className="h-5" />,
      name: "Website",
      link: `${presaleList.website || ""}`,
    },
    {
      icon: <TelegramCardIcon className="h-5" />,
      name: "Telegram",
      link: `${presaleList.telegram || ""}`,
    },
  ];

  const tokenIcon =
    chainId === 97 || chainId === 56 ? (
      <BSCIcon className="h-4 text-icons" />
    ) : chainId === 1 || chainId === 42 || chainId === 3 ? (
      <ETHIcon className="h-4 text-icons" />
    ) : chainId === 137 || chainId === 80001 ? (
      <PolygonIcon className="h-4 text-icons" />
    ) : (
      ""
    );
  const tokenIconBig =
    chainId === 97 || chainId === 56 ? (
      <BSCIcon className="h-7 text-icons" />
    ) : chainId === 1 || chainId === 42 || chainId === 3 ? (
      <ETHIcon className="h-7 text-icons" />
    ) : chainId === 137 || chainId === 80001 ? (
      <PolygonIcon className="h-7 text-icons" />
    ) : (
      ""
    );

  const networkChain =
    presaleList.maxWethCap <= presaleList.totalInvestedWeth
      ? "disabledcard"
      : networkChainButton[chainId] || "";

  const progressGradient =
    presaleList?.maxWethCap <= presaleList?.totalInvestedWeth
      ? ["#646464", "#aaaaaa"]
      : progressGradientColor[chainId] || ["", ""];

  const { active, chainId: web3ChainId } = useWeb3React();

  // prettier-ignore
  const raised = (
    (presaleList.totalInvestedWeth / presaleList.maxWethCap) * 100
  ).toFixed(2) || 0

  const percent =
    (presaleList.totalInvestedWeth / presaleList.maxWethCap) * 100 || 0;

  return (
    <div
      style={
        presaleList && presaleList.maxWethCap <= presaleList.totalInvestedWeth
          ? { pointerEvents: "none" }
          : {}
      }
      className="w-10/12 max-w-xs p-5 mx-auto text-sm font-medium bg-white border-2 rounded-lg shadow-lg w-76 sm:w-full lg:min-w-full dark:border-gray-500 dark:bg-black"
    >
      <div className="flex justify-between lg:items-center">
        <div className="lg:flex">
          <h3 className="mr-2 text-base dark:text-white">
            {presaleList.presaleName || ""}
          </h3>
          <div className="flex items-center space-x-1 text-xs text-subtextsecondary">
            <QuestionMarkIcon className="transition-colors duration-200 cursor-pointer hover:text-icons" />
            <span>{raised}% Raised</span>
          </div>
        </div>
        {/* Tokenomics */}
        <div className="flex items-end space-x-1 text-xs transition-colors duration-200 cursor-pointer text-subtextsecondary has-tooltip hover:text-icons">
          <InfoIcon className="" />
          <span>Tokenomics</span>
          <div className="z-10 p-3 text-white transform -translate-x-56 translate-y-full rounded-md pointer-events-none bg-icons tooltip w-80 dark:bg-darksecondary">
            <div className="flex justify-between">
              <p>Listing Price:</p>
              <p>{`$${Number(listingPrice).toFixed(2)}`}</p>
            </div>
            {tokenomics.map(element => {
              return (
                <div
                  key={element.tokenomicsName}
                  className="flex justify-between"
                >
                  <p>
                    {element.tokenomicsName}:
                    <span className="ml-1 font-light">
                      (Locked {element.tokenomicsLockedFor}; Vested:{" "}
                      {element.tokenomicsVestedFor})
                    </span>
                  </p>
                  <p>{`${element.tokenomicsPercentage * 100}%`}</p>
                </div>
              );
            })}
          </div>
        </div>
        {/* /Tokenomics */}
      </div>

      <div className="mt-3 lg:flex">
        {/* Circular Progress Bar */}
        <div className="relative flex items-center justify-center mx-auto lg:mr-8 lg:w-4/12 lg:justify-start">
          <Progress
            showInfo={false}
            width={150}
            type="circle"
            strokeColor={{
              "0%": progressGradient[0],
              "100%": progressGradient[1],
            }}
            percent={percent}
            trailColor={`${theme === "dark" ? "#646464" : "#e4f4ee"}`}
            strokeWidth={5}
            style={{ color: "red" }}

            // success={{ percent: 70, strokeColor: "#eee" }}
          />
          <div className="absolute flex flex-col items-center justify-center h-full mx-auto text-center w-150 text-icons ">
            {tokenIconBig}
            <div className="text-xs cursor-pointer text-subtextprimary dark:text-white has-tooltip">
              {`${presaleList.totalInvestedWeth.toFixed(2)}`}
              <div className="z-10 p-3 text-white transform -translate-x-3 rounded-md pointer-events-none bg-icons tooltip min-w-min dark:bg-darksecondary">
                {presaleList.totalInvestedWeth}
              </div>
            </div>
            <p className="text-xs">
              Total Invested
              <br />
              {chainCodeSymbol[chainId]}
            </p>
          </div>
        </div>
        {/* /Circular Progress Bar */}

        <div
          className={classNames(
            sidebar ? "ml-3 lg:w-7/12" : "lg:w-8/12",
            "text-subtextsecondary text-xs",
          )}
        >
          <div>
            <h3 className="mb-1 text-sm dark:text-white text-subtextprimary">
              My Investments
            </h3>
            <dl>
              <div className="flex justify-between mb-1">
                <dt className="">My Total Contribution</dt>
                <dd className="flex items-center space-x-1 text-subtextprimary dark:text-gray-300">
                  <span>
                    {Number(walletInfo.walletInvestedWeth).toFixed(2) || ""}
                  </span>
                  {tokenIcon}
                </dd>
              </div>
              <div className="flex justify-between mb-1">
                <dt className="">My Investment Share</dt>
                <dd className="flex items-center space-x-1 text-subtextprimary dark:text-gray-300">
                  <span>
                    {+Number(
                      (walletInfo.walletInvestedWeth /
                        presaleList.totalInvestedWeth) *
                        100,
                    ).toFixed(2) || 0}
                  </span>
                  <span>%</span>
                </dd>{" "}
              </div>
            </dl>
          </div>
          <div>
            <h3 className="mt-3 mb-1 text-sm dark:text-white text-subtextprimary">
              Limits
            </h3>
            <dl>
              <div className="flex justify-between mb-1">
                <dt className="">Min. per Wallet</dt>
                <dd className="flex items-center space-x-1 text-subtextprimary dark:text-gray-300">
                  <span>
                    {Number(walletInfo.minimumWethPerWallet).toFixed(2) || ""}
                  </span>
                  {tokenIcon}
                </dd>
              </div>
              <div className="flex justify-between mb-1">
                <dt className="">Max. per Wallet</dt>
                <dd className="flex items-center space-x-1 text-subtextprimary dark:text-gray-300">
                  <span>
                    {Number(walletInfo.maximumWethPerWallet).toFixed(2) || ""}
                  </span>
                  {tokenIcon}
                </dd>
              </div>
              <div className="flex justify-between mb-1">
                <dt className="">Hard Cap</dt>
                <dd className="flex items-center space-x-1 text-subtextprimary dark:text-gray-300">
                  <span>{Number(presaleList.maxWethCap).toFixed(2) || ""}</span>
                  {tokenIcon}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="flex flex-col mt-3 lg:items-baseline lg:flex-row-reverse">
        <div
          className={classNames(
            sidebar ? "ml-2 lg:w-7/12" : "lg:m-0 lg:w-8/12",
          )}
        >
          {!active ? (
            <button
              type="button"
              className={`w-full mr-5 btn ${networkChain} `}
            >
              <p className="truncate">Unlock Wallet</p>
            </button>
          ) : chainId === web3ChainId ? (
            <MyModal
              chainId={chainId}
              presaleList={presaleList}
              walletInfo={walletInfo}
              networkChain={networkChain}
            />
          ) : (
            <button type="button" className={`w-full btn mr-5 ${networkChain}`}>
              <p className="truncate">Switch Network</p>
            </button>
          )}
        </div>
        <div className="flex justify-center mt-3 text-xs lg:w-4/12 lg:justify-start lg:mr-8 ">
          {cardSocial.map(({ icon, name, link }) => (
            <div
              key={name}
              className={classNames(
                sidebar ? "lg:mr-2 lg:-ml-1" : "mr-3",
                "flex items-center  space-x-1  text-icons underline cursor-pointer hover:text-gray-600 xl:ml-0 xl:mr-3",
              )}
              onClick={() => window.open(link)}
            >
              {icon}
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PresaleCard;
