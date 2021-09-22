import { useWeb3React } from "@web3-react/core";
import { Progress } from "antd";
import { serializeError } from "eth-rpc-errors";
import { useContext, useState } from "react";
import Loader from "react-loader-spinner";
import { toast } from "react-toastify";
import BSCIcon from "../icons/BSCIcon";
import ETHIcon from "../icons/ETHIcon";
import PolygonIcon from "../icons/PolygonIcon";
import QuestionMarkIcon from "../icons/QuestionMarkIcon";
import TelegramCardIcon from "../icons/TelegramCardIcon";
import WebsiteCardIcon from "../icons/WebsiteCardIcon";
import { PresaleItem } from "../shared/api.d";
import { NavContext } from "../shared/nav";
import { PresaleContext } from "../shared/presale";
import { ThemeContext } from "../shared/theme";
import { usePresaleContract } from "../shared/useContract";
import { classNames } from "../shared/utils";
import {
  chainCodeName,
  networkChainButton,
  progressGradientColor,
} from "../utility";

function VestingCard({
  chainId,
  presaleList,
  vestingInfo,
  walletInfo,
  tokenomics,
  listingPrice,
}: PresaleItem) {
  const [errorMessage, setErrorMessage] = useState("");

  const { refetch: refetchPresale } = useContext(PresaleContext);

  const { sidebar } = useContext(NavContext);
  const { theme } = useContext(ThemeContext);

  const cardSocial = [
    {
      icon: <WebsiteCardIcon className="h-5" />,
      name: "Website",
      link: `${presaleList.website}`,
    },
    {
      icon: <TelegramCardIcon className="h-5" />,
      name: "Telegram",
      link: `${presaleList.telegram}`,
    },
  ];

  const contract = usePresaleContract(presaleList.presaleContractAddress);

  const claimToken = async () => {
    setErrorMessage("");
    try {
      setLoader(true);

      const result = await contract.claimVesting();
      const result2 = await result.wait();

      setLoader(false);

      if (result2.status === 1) {
        toast.success("Transaction successful");
      } else {
        toast.error("Transaction Canceled");
      }

      console.log(result2.status);
    } catch (error) {
      setLoader(false);
      const serializedError = serializeError(error);
      const originalErrorMessage = (serializedError.data as any)?.originalError
        ?.error?.message;

      if (originalErrorMessage && originalErrorMessage.includes("PR: ")) {
        const message = originalErrorMessage.split("PR: ")[1];

        // @ts-ignore
        const readableError = message || "Unknown error";
        toast.error("Transaction failed");
        setErrorMessage(readableError);
      } else {
        setErrorMessage("Transaction Canceled");
      }
    } finally {
      refetchPresale();
    }
  };

  const { account, active, activate, chainId: web3ChainId } = useWeb3React();
  const [loader, setLoader] = useState(false);

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

  const networkChain =
    presaleList.maxWethCap > presaleList.totalInvestedWeth
      ? "disabledcard"
      : networkChainButton[chainId] || "";

  const progressGradient =
    presaleList.maxWethCap > presaleList.totalInvestedWeth
      ? ["#646464", "#aaaaaa"]
      : progressGradientColor[chainId] || ["", ""];

  const tokenName = presaleList.presaleName.split(" ")[0];

  const claimed = vestingInfo.tokensClaimed;
  const available = vestingInfo.tokensReserved - vestingInfo.tokensClaimed;
  const total = vestingInfo.tokensReserved;

  return (
    <div className="flex flex-col justify-between w-10/12 max-w-sm p-5 mx-auto text-xs font-medium bg-white border-2 rounded-lg shadow-lg sm:w-full md:min-w-full dark:border-gray-500 dark:bg-black ">
      <div className="flex justify-between mb-2">
        <div className="flex justify-between flex-grow space-x-2 lg:justify-start lg:flex-grow-0 ">
          <span className="text-sm text-subtextprimary dark:text-white">
            {tokenName} Vesting
          </span>
          <div className="flex items-center space-x-1 text-icons">
            {tokenIcon}
            <span style={{ textTransform: "capitalize" }}>
              {" "}
              {chainCodeName[chainId]}
            </span>
          </div>
        </div>
        <div className="justify-end hidden lg:flex ">
          {cardSocial.map(({ icon, name, link }) => (
            <div
              key={name}
              className={classNames(
                sidebar ? "mr-2 -ml-1" : "mr-3 ml-0",
                "flex items-center mr-3 space-x-1  text-icons underline cursor-pointer last:mr-0 hover:text-iconsdark transition-color duration-200",
              )}
              onClick={() => window.open(link)}
            >
              {icon}
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
      <span className="mb-2 text-sm ">Claim Status</span>
      <div className="flex justify-between mb-1 text-subtextsecondary">
        <div className="flex space-x-1">
          <QuestionMarkIcon className="cursor-pointer hover:text-iconsdark transition-color duration" />
          <span>{`${
            +Number((claimed / total) * 100).toFixed(2) || 0
          }% Claimed`}</span>
        </div>
        <span>
          {+Number((available / total) * 100).toFixed(2) || 0}% Remaining
        </span>
      </div>

      {/* Progress bar */}

      <div className="my-2">
        <div className="overflow-hidden rounded-md">
          <Progress
            showInfo={false}
            strokeColor={{
              "0%": progressGradient[0],
              "100%": progressGradient[1],
            }}
            percent={Number(((claimed / total) * 100).toFixed(2))}
            trailColor={`${theme === "dark" ? "#646464" : "#e4f4ee"}`}
            strokeLinecap="round"
          />
        </div>
        <div className="flex justify-between text-subtextprimary dark:text-white">
          <span>0</span>
          <span>Available Token(s): {available.asCurrency(1)}</span>
          <span>{total.asCurrency(1)}</span>
        </div>
      </div>

      {/* /Progress bar */}

      <div className="flex flex-col mb-2 space-y-1 text-subtextsecondary">
        <div className="flex justify-between">
          <span>Total Amount</span>
          <span className="text-subtextprimary dark:text-gray-300 ">
            <span className="mr-2 text-activetext">
              {vestingInfo.tokensReserved.asCurrency(1)}
            </span>
            {tokenName}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Locked Until</span>
          <span className="text-subtextprimary dark:text-gray-300">
            {/* Sept 1, 17:33 UTC */}
            {vestingInfo.lockedUntilTimestamp === 0
              ? "N/A"
              : vestingInfo?.lockedUntilTimestamp &&
                new Date(vestingInfo.lockedUntilTimestamp * 1000).toUTCString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Vested Until</span>
          <span className="text-subtextprimary dark:text-gray-300">
            {/* Sept 30, 17:33 UTC */}
            {vestingInfo.vestedUntilTimestamp === 0
              ? "N/A"
              : vestingInfo?.vestedUntilTimestamp &&
                new Date(vestingInfo.vestedUntilTimestamp * 1000).toUTCString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Claimed Amount</span>
          <span className="text-subtextprimary dark:text-gray-300">
            <span className="mr-2 text-activetext">
              {vestingInfo.tokensClaimed.asCurrency(1)}
            </span>
            {tokenName}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Available Amount</span>
          <span className="text-subtextprimary dark:text-gray-300">
            <span className="mr-2 text-activetext">
              {available.asCurrency(1)}
            </span>
            {tokenName}
          </span>
        </div>
      </div>
      <div className="flex flex-col justify-center w-full">
        {!active ? (
          <button
            type="button"
            className={`w-8/12 mx-auto mt-2 btn ${networkChain}`}
            onClick={() => {}}
          >
            <p className="truncate">Unlock Wallet</p>
          </button>
        ) : chainId === web3ChainId ? (
          <>
            <div>
              <p className="text-xs text-center text-red-700">{errorMessage}</p>
            </div>
            <button
              type="button"
              className={`w-8/12 mx-auto mt-2 btn ${networkChain} ${
                loader ? "pointer-events-none" : ""
              }`}
              onClick={() => claimToken()}
            >
              {loader ? (
                <Loader type="ThreeDots" color="#fff" height={12} width={250} />
              ) : (
                `Claim ${tokenName}`
              )}
            </button>
          </>
        ) : (
          <button
            type="button"
            className={`w-8/12 mx-auto mt-2 btn ${networkChain}`}
            onClick={() => {}}
          >
            <p className="truncate">Switch Network</p>
          </button>
        )}
        <div className="flex justify-center mt-2 lg:hidden ">
          {cardSocial.map(({ icon, name, link }) => (
            <div
              key={name}
              className="flex items-center mr-3 space-x-1 underline duration-200 cursor-pointer text-icons last:mr-0 hover:text-iconsdark transition-color"
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

export { VestingCard };
