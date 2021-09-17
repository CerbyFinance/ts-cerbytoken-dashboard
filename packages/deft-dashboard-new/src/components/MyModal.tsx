import { Web3Provider } from "@ethersproject/providers";
import { Dialog, Transition } from "@headlessui/react";
import { useWeb3React } from "@web3-react/core";
import { serializeError } from "eth-rpc-errors";
import { ethers } from "ethers";
import { Fragment, useContext, useEffect, useState } from "react";
import Loader from "react-loader-spinner";
import { toast } from "react-toastify";
import BSCIcon from "../icons/BSCIcon";
import ETHIcon from "../icons/ETHIcon";
import PolygonIcon from "../icons/PolygonIcon";
import { PresaleList, WalletInfo } from "../shared/api.d";
import { PresaleContext } from "../shared/presale";
import { usePresaleContract } from "../shared/useContract";
import { TEAM_REF_ADDRESS, useReferrer } from "../shared/useReferrer";
import { chainCodeSymbol } from "../utility";

function MyModal({
  chainId,
  presaleList,
  walletInfo,
  networkChain,
}: {
  chainId: number;
  walletInfo: WalletInfo;
  presaleList: PresaleList;
  networkChain: string;
}) {
  const [loader, setLoader] = useState(false);

  const referrer = useReferrer();
  const { refetch: refetchPresale } = useContext(PresaleContext);

  const { account, library, chainId: web3ChainId } = useWeb3React();

  const minPerWallet = walletInfo.minimumWethPerWallet;
  const maxPerWallet = walletInfo.maximumWethPerWallet;
  const walletInvested = walletInfo.walletInvestedWeth;

  const possibleInvestmentPerWallet = maxPerWallet - walletInvested;

  const possibleInvestment =
    presaleList.maxWethCap - presaleList.totalInvestedWeth <=
    possibleInvestmentPerWallet
      ? presaleList.maxWethCap - presaleList.totalInvestedWeth
      : possibleInvestmentPerWallet;

  const [balance, setMyBalance] = useState<number | undefined>();

  const refetchBalance = async () => {
    try {
      const balance = await (library as Web3Provider).getBalance(account!);
      setMyBalance(Number(ethers.utils.formatEther(balance)));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (account) {
      refetchBalance();
    }
  }, [account, chainId]);

  const [invest, setInvest] = useState(String(minPerWallet));
  const [errorMessage, setErrorMessage] = useState("");

  const contract = usePresaleContract(presaleList.presaleContractAddress);

  const handleMaxClick = () => {
    if (!balance) {
      return;
    }

    if (possibleInvestment && possibleInvestment > balance) {
      setInvest(balance.toFixed(4).toString());
    } else {
      setInvest(possibleInvestment.toFixed(4).toString());
    }
  };

  const invset = async () => {
    // if (Number(invest) < Number(minPerWallet))
    //   return setErrorMessage(
    //     "Minimum Investment Should Be At Least " + minPerWallet,
    //   );
    // if (Number(invest) > Number(possibleInvestment))
    //   return setErrorMessage("Exceeding Hardcap Limit");
    // if (Number(invest) > Number(balance)) {
    //   return setErrorMessage("Insufficient Wallet Balance");
    // }

    setErrorMessage("");
    try {
      setLoader(true);

      const result = await contract.invest(referrer, {
        value: ethers.utils.parseEther(invest),
      });
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
      refetchBalance();
      refetchPresale();
    }
  };

  const tokenIcon =
    chainId === 97 || chainId === 56 ? (
      <BSCIcon className="h-4 text-gray-500 dark:text-white" />
    ) : chainId === 1 || chainId === 42 || chainId === 3 ? (
      <ETHIcon className="h-4 text-gray-500 dark:text-white" />
    ) : chainId === 137 || chainId === 80001 ? (
      <PolygonIcon className="h-4 text-gray-500 dark:text-white" />
    ) : (
      ""
    );

  const networkColor =
    chainId === 97 || chainId === 56
      ? "bscbtn-modal"
      : chainId === 1 || chainId === 42 || chainId === 3
      ? "ethbtn-modal"
      : chainId === 137 || chainId === 80001
      ? "polybtn-modal"
      : "";

  const [disabled, setDisabled] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    if (!loader) {
      setIsOpen(false);
    }
  }
  function openModal() {
    setIsOpen(true);
    setErrorMessage("");
  }

  const tokenName = presaleList.presaleName.split(" ")[0];

  return (
    <>
      <div className="">
        <button
          type="button"
          onClick={openModal}
          className={`w-full btn mr-5 ${networkChain}`}
        >
          Add Investment
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={closeModal}
        >
          {/* Use the overlay to style a dim backdrop for your dialog */}
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-xs px-8 py-4 my-8 overflow-hidden text-sm text-left align-middle transition-all transform bg-white border shadow-xl dark:border-2 rounded-2xl dark:border-gray-500 dark:bg-black">
                <Dialog.Title
                  as="h3"
                  className="mb-2 text-lg font-medium leading-6 text-center text-gray-900 dark:text-white"
                >
                  {tokenName} Presale
                </Dialog.Title>
                <div className="flex justify-center p-2 mt-2 mb-2 text-xs bg-gray-200 rounded-md dark:bg-blue-800">
                  <p className="text-gray-700 dark:text-white">Referred by:</p>
                  <span className="ml-1 text-blue-500 dark:text-blue-300">
                    {/* {referalAddress} */}

                    {referrer === TEAM_REF_ADDRESS
                      ? "Team Address"
                      : `${referrer?.slice(0, 6)}...${referrer?.slice(-4)}`}
                  </span>
                </div>

                <p className="dark:text-white">
                  {chainCodeSymbol[chainId]} Amount
                </p>

                <div className="flex justify-between mb-2 text-xs">
                  <p className="text-gray-400">
                    My Balance:
                    <span className="ml-3 text-blue-400">
                      {balance?.toFixed(4)}
                    </span>
                  </p>
                </div>

                <div>
                  <p className="text-xs text-center text-red-700">
                    {errorMessage}
                  </p>
                </div>

                <div className="">
                  <div
                    className={`flex items-center justify-start w-full px-2 py-1 mb-3 space-x-2 bg-white border-2 rounded-md shadow-sm dark:border-gray-500 dark:bg-black ${
                      disabled ? "pointer-events-none" : ""
                    }`}
                  >
                    <div className="">{tokenIcon}</div>

                    <input
                      className="text-gray-500 border-none w-136 dark:bg-black dark:text-white focus:outline-none"
                      type="text"
                      placeholder={`${minPerWallet}`}
                      value={invest}
                      formNoValidate
                      onKeyUp={() => {
                        if (!disabled) {
                          setErrorMessage("");
                        }
                      }}
                      onChange={e => {
                        if (!isNaN(+e.target.value) && !disabled) {
                          setInvest(e.target.value);
                        }
                      }}
                    />
                    <button
                      className="px-4 py-1 font-medium text-blue-500 transition-colors duration-200 bg-blue-100 rounded-md hover:bg-blue-200 hover:text-blue-600 dark:bg-blue-800 dark:text-blue-300 dark:hover:bg-blue-900 dark:hover:text-blue-400"
                      aria-label="Copy Link"
                      onClick={() => handleMaxClick()}
                    >
                      MAX
                    </button>
                  </div>
                  <button
                    className={` w-full mb-2 btn  ${
                      disabled
                        ? "pointer-events-none from-gray-500 to-gray-400"
                        : networkColor
                    } ${loader ? "pointer-events-none" : ""}`}
                    onClick={e => {
                      if (invest && !isNaN(+invest)) {
                        invset();
                      }
                    }}
                  >
                    {loader ? (
                      <Loader
                        type="ThreeDots"
                        color="#fff"
                        height={12}
                        width={250}
                      />
                    ) : (
                      "Confirm Investment"
                    )}
                  </button>
                </div>

                <p className="text-xs tracking-tighter text-gray-400">
                  You will receive the tokens once the liquidity is added.
                </p>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export { MyModal };
