import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import { serializeError } from "eth-rpc-errors";
import { ethers } from "ethers";
import { Box, Grommet, Text } from "grommet";
import Tooltip from "rc-tooltip";
import React, {
  createContext,
  CSSProperties,
  useContext,
  useEffect,
  useState,
} from "react";
import AutosizeInput from "react-input-autosize";
import {
  BrowserRouter as Router,
  Route,
  useHistory,
  useParams,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import styled from "styled-components";
import useMedia from "use-media";
import { Chains } from "./chains";
import { Hint } from "./components/Hint";
import {
  BridgeTransferDocument,
  BridgeTransferQuery,
  BridgeTransferQueryVariables,
  MetaBlockNumberDocument,
  MetaBlockNumberQuery,
  MetaBlockNumberQueryVariables,
  MyLastProofDocument,
  MyLastProofQuery,
  MyLastProofQueryVariables,
  Proof,
  ProofByIdDocument,
  ProofByIdQuery,
  ProofByIdQueryVariables,
  ProofByTxHashDocument,
  ProofByTxHashQuery,
  ProofByTxHashQueryVariables,
  ProofType,
} from "./graphql/types";
import {
  BinanceLogo,
  CheckLg,
  Direction,
  EthereumLogo,
  QuestionIcon,
  TelegramIcon,
} from "./Icons";
import { Logo } from "./logo";
import { clientByChain, noopApollo } from "./shared/client";
import { injected } from "./shared/connectors";
import { HoveredElement } from "./shared/hooks";
import { useBridgeContract, useTokenContract } from "./shared/useContract";
import { dynamicTemplate, formatNum } from "./shared/utils";
import Web3ReactManager from "./shared/Web3Manager";
import { txnToast } from "./toaster";

const Input = styled(AutosizeInput)`
  input {
    border: none;
    /* height: 48px; */
    border-radius: 6px;
    font-size: 18px;
    font-weight: 500;
    padding-right: 6px;
    padding-left: 1px;
    outline: none;
    color: #414141;

    font-weight: 600;

    /* background: #f6f2e9; */

    &::placeholder {
      color: #c1c1c1;
    }

    transition: none;
  }
  /* &:active,
  &:focus {
    border-color: #2379ff;
  } */
`;

const Divider = styled.div`
  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 1px;
    background: #f2f2f2;
    left: 0;
    box-sizing: border-box;
  }
`;

const processes = ["transfer", "validation", "receive"] as const;

type Process = typeof processes[number];

const stepToProcess = {
  1: "transfer",
  2: "validation",
  3: "receive",
} as {
  [key: number]: Process;
};

type ProcessStatus = "none" | "loading" | "error" | "success";

const processesTextStatuses = {
  transfer: {
    none: "transfer <b>${transferAmount} ${token}</b> from <b>${src}</b> to <b>${dest}</b>",
    loading:
      "transfering <b>${transferAmount} ${token}</b> from <b>${src}</b> to <b>${dest}</b>",
    error: "",
    success:
      "transfered <b>${transferAmount} ${token}</b> from <b>${src}</b> to <b>${dest}</b>",
  },
  validation: {
    none: "ensure correctness of transfer",
    loading: "ensuring correctness of transfer",
    error: "",
    success: "transfer is correct",
  },
  receive: {
    none: "receive <b>${receiveAmount} ${token}</b> on <b>${dest}</b>",
    loading: "receiving <b>${receiveAmount} ${token}</b> on <b>${dest}</b>",
    error: "",
    success: "you received <b>${receiveAmount} ${token}</b> on <b>${dest}</b>",
  },
} as {
  [key in Process]: {
    [key in ProcessStatus]: string;
  };
};

const getLastProof = async (
  client: ApolloClient<NormalizedCacheObject>,
  account: string,
) => {
  const result = await client.query<
    MyLastProofQuery,
    MyLastProofQueryVariables
  >({
    variables: {
      proofType: ProofType.Burn,
      sender: account,
    },
    query: MyLastProofDocument,
    fetchPolicy: "network-only",
  });

  return result.data.proofs[0];
};

const getBridgeTransfer = async (
  client: ApolloClient<NormalizedCacheObject>,
  proofId: string,
) => {
  const bridgeTransferResult = await client.query<
    BridgeTransferQuery,
    BridgeTransferQueryVariables
  >({
    query: BridgeTransferDocument,
    variables: {
      id: proofId,
    },
    fetchPolicy: "network-only",
  });

  return bridgeTransferResult.data.bridgeTransfer;
};

const getProof = async (
  client: ApolloClient<NormalizedCacheObject>,
  proofId: string,
  proofType: ProofType,
) => {
  const result = await client.query<ProofByIdQuery, ProofByIdQueryVariables>({
    variables: {
      id: proofId,
      proofType: proofType,
    },
    query: ProofByIdDocument,
    fetchPolicy: "network-only",
  });

  return result.data.proofs[0];
};

const BridgeWidgetProcess = () => {
  const { account, activate, chainId, connector, error } = useWeb3React();

  const {
    src: srcChainId,
    dest: destChainId,
    id: currentProofId,
  } = useParams<{ id: string; src: string; dest: string }>();

  const path = [Number(srcChainId), Number(destChainId)] as [Chains, Chains];

  const [transferAmount, setTransferAmount] = useState<string | undefined>();
  // const [fee, setAmountAsFee] = useState<string | undefined>();

  const bridgeContract = useBridgeContract();

  const [loader, setLoader] = useState(false);
  const [nonce, setNonce] = useState<number>(0);

  const { balance, fee, setFee, token, tokenAddress, refetchBalance } =
    useContext(GlobalContext);

  // const [currentProofId, setCurrentProofId] = useState<string>("");
  // const [path, setPath] = useState([0, 0] as unknown as [Chains, Chains]);

  const srcClient = clientByChain[idToChain[path[0]]] || noopApollo;
  const destClient = clientByChain[idToChain[path[1]]] || noopApollo;

  // const fee = data?.global?.currentFee || 0;

  const receiveAmount = transferAmount
    ? Number(transferAmount) - fee
    : undefined;

  const [processesStatus, setProcessesStatus] = useState({
    transfer: "none",
    validation: "none",
    receive: "none",
  } as {
    [key in Process]: ProcessStatus;
  });

  useEffect(() => {
    const fire = async (client: ApolloClient<NormalizedCacheObject>) => {
      const burnProof = await getProof(client, currentProofId, ProofType.Burn);

      if (burnProof) {
        const srcChainid = burnProof.src! as Chains;
        const destChainId = burnProof.dest! as Chains;

        setFee(burnProof.fee);
        setNonce(burnProof.nonce!);
        // @ts-ignore
        setTransferAmount(burnProof.amount);

        const destClient = clientByChain[idToChain[destChainId]];

        const bridgeTransfer = await getBridgeTransfer(
          destClient,
          burnProof.id,
        );
        const mintProof = await getProof(
          destClient,
          burnProof.id,
          ProofType.Mint,
        );

        setProcessesStatus(old => ({
          transfer: "success",
          validation: bridgeTransfer ? "success" : "loading",
          receive: mintProof ? "success" : "none",
        }));
      }
    };

    fire(srcClient);
  }, []);

  // validator
  useEffect(() => {
    const validateTransfer = async (proofId: string) => {
      const bridgeTransfer = await getBridgeTransfer(destClient, proofId);

      if (bridgeTransfer) {
        setProcessesStatus(old => ({
          ...old,
          transfer: "success",
          validation: bridgeTransfer ? "success" : "loading",
        }));
      }
    };

    const validateMint = async (proofId: string) => {
      const mintProof = await getProof(destClient, proofId, ProofType.Mint);

      if (mintProof) {
        setProcessesStatus(old => ({
          validation: "success",
          transfer: "success",
          receive: "success",
        }));
      }
    };

    const timer = setInterval(() => {
      if (
        account &&
        currentProofId &&
        processesStatus.validation !== "success"
      ) {
        validateTransfer(currentProofId).catch(e => e);
      }
      if (
        account &&
        currentProofId &&
        processesStatus.validation === "success" &&
        processesStatus.receive !== "success"
      ) {
        validateMint(currentProofId).catch(e => e);
      }
    }, 3500);

    return () => clearInterval(timer);
  }, [account, currentProofId, processesStatus, destClient]);

  // return if not exists

  const history = useHistory();

  const src = chainIdToShort[path[0]] || "...";
  const dest = chainIdToShort[path[1]] || "...";

  const connected = account ? true : false;

  const connectedToRightChain = account && path[1] === chainId;
  const unsupportedNetwork = error?.message.includes("Unsupported chain id");

  // TODO: show actual error in ui
  const receive = async (
    tokenAddress: string,
    account: string,
    srcNonce: number,
    srcChainId: Chains,
    destChainId: Chains,
  ) => {
    try {
      setLoader(true);
      setProcessesStatus(old => ({
        ...old,
        receive: "loading",
      }));

      const result = await bridgeContract.mintWithBurnProof({
        amountToBridge: ethers.utils.parseEther(transferAmount!),
        amountAsFee: ethers.utils.parseEther(fee.toString()),
        sourceTokenAddr: tokenAddress,
        sourceChainId: srcChainId,
        sourceNonce: srcNonce,
        transactionHash: currentProofId,
      });

      const result2 = await result.wait();

      await refetchBalance(account);

      // TODO: update it locally ?
      let i = 99999;
      while (true) {
        const mintProof = await getProof(
          destClient,
          currentProofId,
          ProofType.Mint,
        );

        if (mintProof) {
          setProcessesStatus(old => ({
            validation: "success",
            transfer: "success",
            receive: "success",
          }));
          break;
        }

        i--;

        if (i === 0) {
          break;
        }

        await new Promise(r => setTimeout(r, 300));
      }

      setLoader(false);
      setProcessesStatus(old => ({
        ...old,
        receive: result2.status === 1 ? "success" : "none",
      }));

      if (result2.status === 1) {
        txnToast(
          destChainId,
          "success",
          "Transaction Successful",
          result2.transactionHash,
        );
      } else {
        txnToast(
          destChainId,
          "fail",
          "Transaction Canceled",
          result2.transactionHash,
        );
      }
    } catch (error) {
      setLoader(false);
      setProcessesStatus(old => ({
        ...old,
        receive: "none",
      }));

      const serializedError = serializeError(error);
      const originalErrorMessage =
        (serializedError.data as any)?.originalError?.error?.message ||
        (serializedError.data as any)?.message;

      if (originalErrorMessage && originalErrorMessage.includes("CCB: ")) {
        const message = originalErrorMessage.split("CCB: ")[1];

        txnToast(destChainId, "error", "Transaction Error", undefined, message);
      } else {
        txnToast(destChainId, "fail", "Transaction Canceled");
      }
    }
  };

  let actionButton = {} as {
    text: string;
    onClick: () => void;
    style?: CSSProperties;
  };

  const inactive = {
    opacity: 0.6,
    transform: undefined,
  };

  if (connected) {
    if (connectedToRightChain) {
      if (processesStatus.validation === "success") {
        if (processesStatus.receive === "success") {
          // TODO: when received
          // redirect to cross chain begin page
          actionButton = {
            text: "Return",
            onClick: () => {
              history.push("/");
            },
          };
        } else {
          actionButton = {
            text: "Receive",
            onClick: () =>
              receive(tokenAddress, account!, nonce, path[0], path[1]),
          };
        }
      } else {
        actionButton = {
          text: "Validating",
          onClick: () => {},
          style: inactive,
        };
      }
    } else {
      actionButton = {
        text: "Switch to " + dest,
        onClick: () => {},
        style: {
          background: "#F83245",
          boxShadow: "none",
        },
      };
    }
  } else if (unsupportedNetwork) {
    actionButton = {
      text: "Switch to " + dest,
      onClick: () => {},
      style: {
        background: "#F83245",
        boxShadow: "none",
      },
    };
  } else {
    actionButton = {
      text: "Connect",
      onClick: () => activate(injected),
    };
  }

  return (
    <Box
      style={{
        width: "405px",
        boxShadow:
          "0px 8px 16px 2px rgba(97, 97, 97, 0.1), 0px 16px 32px 2px rgba(97, 97, 97, 0.1)",
        position: "relative",
        alignSelf: "center",
      }}
      background="white"
      round="12px"
      pad="30px 22px 20px"
    >
      <Box justify="center">
        {processes.map((processId, i) => {
          const processTextStatuses = processesTextStatuses[processId];
          const processStatus = processesStatus[processId];
          const processText = processTextStatuses[processStatus];

          const dynamicText = dynamicTemplate(processText, {
            transferAmount: transferAmount
              ? Number(transferAmount).asCurrency(2)
              : "...",
            token,
            receiveAmount: receiveAmount ? receiveAmount.asCurrency(2) : "...",
            src,
            dest,
          });

          const dynamicParts = dynamicText.split(/(<b>.+?<\/b>)/gi) as (
            | string
            | JSX.Element
          )[];

          for (let j = 1; j < dynamicParts.length; j += 2) {
            dynamicParts[j] = (
              <strong key={j}>
                {(dynamicParts[j] as string).replace(/<[^>]*>/g, "")}
              </strong>
            );
          }

          return (
            <React.Fragment>
              <Box height="51px" direction="row" align="center">
                {processStatus === "none" && (
                  <Box
                    height="36px"
                    width="36px"
                    round="50%"
                    background="white"
                    margin={{
                      left: "10px",
                      right: "14px",
                    }}
                    align="center"
                    justify="center"
                    style={{
                      border: "2px solid #E0E0E0",
                      minWidth: "36px",
                    }}
                  >
                    <Text
                      size="16px"
                      weight={700}
                      style={{
                        lineHeight: "150%",
                      }}
                      color="#414141"
                    >
                      {i + 1}
                    </Text>
                  </Box>
                )}
                {processStatus === "success" && (
                  <Box
                    height="36px"
                    width="36px"
                    round="50%"
                    background="#D3F5D5"
                    margin={{
                      left: "10px",
                      right: "14px",
                    }}
                    align="center"
                    justify="center"
                    style={{
                      minWidth: "36px",
                    }}
                  >
                    <CheckLg></CheckLg>
                  </Box>
                )}
                {processStatus === "loading" && (
                  <Box
                    style={{
                      position: "relative",
                      minWidth: "36px",
                    }}
                    align="center"
                    justify="center"
                    margin={{
                      left: "10px",
                      right: "14px",
                    }}
                  >
                    <Box
                      height="36px"
                      width="36px"
                      round="50%"
                      background="#FBE5C9"
                      align="center"
                      justify="center"
                    >
                      <Text
                        size="16px"
                        weight={700}
                        style={{
                          lineHeight: "150%",
                        }}
                        color="#414141"
                      >
                        {i + 1}
                      </Text>
                    </Box>
                    <div
                      className="loader"
                      style={{
                        position: "absolute",
                        borderTopColor: "#FFBA63",
                        width: "36px",
                        height: "36px",
                        borderWidth: "4px",
                        left: "-4px",
                      }}
                    ></div>
                  </Box>
                )}

                <Box>
                  <Text
                    weight={700}
                    color="#414141"
                    style={{
                      lineHeight: "150%",
                      textTransform: "capitalize",
                    }}
                    size="16px"
                  >
                    {processId}
                  </Text>
                  <Text
                    size="14px"
                    color="#818181"
                    style={{
                      lineHeight: "150%",
                    }}
                  >
                    {dynamicParts}
                  </Text>
                </Box>
              </Box>
              {processId !== "receive" && (
                <Box height="32px" pad="4px 0px 0px 26px">
                  <Box
                    height="26px"
                    width="4px"
                    round="2px"
                    background="#E0E0E0"
                  ></Box>
                </Box>
              )}
            </React.Fragment>
          );
        })}
      </Box>
      <Box height="21px" />
      <HoveredElement
        render={binder => {
          return (
            <Box
              {...binder.bind}
              width="100%"
              height="48px"
              round="8px"
              background={binder.hovered ? "#2AB930" : "#E1F8E2"}
              align="center"
              justify="center"
              style={{
                ...(binder.hovered
                  ? {
                      transform: "scale(1.01)",
                    }
                  : {}),

                cursor: "pointer",
                boxShadow:
                  "0px 2px 4px rgba(31, 139, 36, 0.18), 0px 4px 8px rgba(31, 139, 36, 0.18)",
                ...actionButton.style,

                ...(loader
                  ? {
                      pointerEvents: "none",
                    }
                  : {}),
              }}
              onClick={() => actionButton.onClick()}
            >
              {loader && (
                <div
                  className="loader"
                  style={{
                    borderTopColor: "#2AB930",
                  }}
                ></div>
              )}
              {!loader && (
                <Text
                  size="16px"
                  color={binder.hovered ? "white" : "#2AB930"}
                  style={{
                    letterSpacing: "0.05em",
                    ...(actionButton.text.includes("Switch")
                      ? { color: "white" }
                      : {}),
                  }}
                  weight={600}
                >
                  {actionButton.text}
                </Text>
              )}
            </Box>
          );
        }}
      />
    </Box>
  );
};

// TODO: precompute once

// const chainToId = {
//   ["ethereum"]: 1,
//   ["binance"]: 56,

//   ropsten: 3,
//   kovan: 42,
//   ["binance-test"]: 97,
// } as {
//   [key: string]: Chains;
// };

const idToChain = {
  1: "ethereum",
  56: "binance",
  3: "ropsten",
  42: "kovan",
  97: "binance-test",
} as {
  [key in Chains]: string;
};

const chainIdToShort = {
  1: "ETH",
  56: "BSC",

  3: "ETH (ROP)",
  42: "ETH (KOV)",
  97: "BSC (TEST)",
} as {
  [key in Chains]: string;
};

const chainIdToIcon = {
  1: <EthereumLogo />,
  56: <BinanceLogo />,

  3: <EthereumLogo />,
  42: <EthereumLogo />,
  97: <BinanceLogo />,
} as {
  [key in Chains]: JSX.Element;
};

function _isFinite(value: any): boolean {
  return typeof value == "number" && isFinite(value);
}

const getGraphBlockNumber = async (
  client: ApolloClient<NormalizedCacheObject>,
) => {
  const result = await client.query<
    MetaBlockNumberQuery,
    MetaBlockNumberQueryVariables
  >({
    variables: {},
    query: MetaBlockNumberDocument,
    fetchPolicy: "network-only",
  });

  return result.data._meta?.block.number;
};

const HoverScale = styled(Box)`
  &:hover {
    transform: scale(1.048);
  }
`;

const HoveredColor = styled(Box)`
  &:hover {
    background: rgba(203, 226, 255, 0.35);
  }
`;

const tokens = [
  {
    name: "DEFT",
    address: "0xdef1fac7Bf08f173D286BbBDcBeeADe695129840",
  },
  // {
  //   name: "LAMBO",
  //   address: "0x44EB8f6C496eAA8e0321006d3c61d851f87685BD",
  // },
];

const BridgeWidget = () => {
  const { account, activate, chainId, library, connector, error } =
    useWeb3React();

  const [blockNumber, setBlockNumber] = useState<number>(0);
  useEffect(() => {
    console.log(library);
    if (library) {
      library.getBlockNumber().then((bn: any) => {
        setBlockNumber(bn);
      });
      library.on("block", setBlockNumber);
      return () => {
        library.removeListener("block", setBlockNumber);
        setBlockNumber(0);
      };
    }
  }, [library, chainId]);

  const bridgeContract = useBridgeContract();
  // const tokenContract = useTokenContract();

  const history = useHistory();

  const {
    balance,
    setToken,
    fee,
    setFee,
    token,
    tokenAddress,
    refetchBalance,
  } = useContext(GlobalContext);

  const [transferAmount, setTransferAmount] = useState("");
  const [isPopular, setPopular] = useState(true);

  const [loader, setLoader] = useState(false);
  // const [path, setPath] = useState([1, 56] as [Chains, Chains]);
  const [path, setPath] = useState([42, 97] as [Chains, Chains]);

  const setMax = () => {
    setTransferAmount(balance.toString());
  };

  const changeDirection = () => {
    // @ts-ignore
    setPath(path.slice().reverse());
  };

  const changeHandler = (evt: any) => {
    setTransferAmount(evt.target.value);
  };

  console.log({
    transferAmount,
  });

  const srcClient = clientByChain[idToChain[path[0]]] || noopApollo;
  const destClient = clientByChain[idToChain[path[1]]] || noopApollo;

  // const fee = data?.global?.currentFee || 0;

  // const computedFee = Number(transferAmount) * fee;

  const [graphBlockNumber, setGraphBlockNumber] = useState<number>(0);

  const [visible, onVisibleChange] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      getGraphBlockNumber(srcClient)
        .then(bn => bn && setGraphBlockNumber(bn))
        .catch(e => e);
    }, 5000);

    getGraphBlockNumber(srcClient)
      .then(bn => bn && setGraphBlockNumber(bn))
      .catch(e => e);

    return () => clearInterval(timer);
  }, [srcClient]);

  useEffect(() => {
    const fire = async () => {
      try {
        const fee = await bridgeContract.getFeeDependingOnDestinationChainId(
          tokenAddress,
          path[1],
        );
        setFee(Number(ethers.utils.formatEther(fee)));
      } catch (error) {
        console.log(error);
      }
    };

    if (bridgeContract) {
      fire();
    }
  }, [bridgeContract]);

  console.log({
    blockNumber,
    graphBlockNumber,
  });

  const connected = account ? true : false;

  const connectedToRightChain = account && path[0] === chainId;
  const unsupportedNetwork = error?.message.includes("Unsupported chain id");

  const amountEntered = Number(transferAmount) > 0;
  const sufficientBalance = Number(transferAmount) <= Number(balance);

  const areInSync = Math.abs(graphBlockNumber - blockNumber) <= 5;

  const src = chainIdToShort[path[0]] || "...";
  const dest = chainIdToShort[path[1]] || "...";

  const transfer = async (
    client: ApolloClient<NormalizedCacheObject>,
    tokenAddress: string,
    account: string,
    amount: string,
    srcChainId: Chains,
    destChainId: Chains,
  ) => {
    try {
      setLoader(true);
      const result = await bridgeContract.burnAndCreateProof(
        tokenAddress,
        ethers.utils.parseEther(amount),
        destChainId,
      );

      const result2 = await result.wait();

      await refetchBalance(account);

      let proof: Pick<Proof, "id" | "src" | "dest">;
      // TODO: update it locally ?
      let i = 99999;
      while (true) {
        const resultQuery = await client.query<
          ProofByTxHashQuery,
          ProofByTxHashQueryVariables
        >({
          query: ProofByTxHashDocument,
          variables: {
            txHash: result2.transactionHash,
          },
          fetchPolicy: "network-only",
        });

        if (resultQuery.data.proofs[0]) {
          proof = resultQuery.data.proofs[0];
          break;
        }

        i--;

        if (i === 0) {
          break;
        }

        await new Promise(r => setTimeout(r, 300));
      }
      // redirect to process

      // @ts-ignore
      if (proof) {
        history.push(`/p/${proof.src}/${proof.dest}/${proof.id}`);
      }

      setLoader(false);

      if (result2.status === 1) {
        txnToast(
          srcChainId,
          "success",
          "Transaction Successful",
          result2.transactionHash,
        );
      } else {
        txnToast(
          srcChainId,
          "fail",
          "Transaction Canceled",
          result2.transactionHash,
        );
      }
    } catch (error) {
      setLoader(false);

      const serializedError = serializeError(error);
      const originalErrorMessage =
        (serializedError.data as any)?.originalError?.error?.message ||
        (serializedError.data as any)?.message;

      if (originalErrorMessage && originalErrorMessage.includes("CCB: ")) {
        const message = originalErrorMessage.split("CCB: ")[1];

        // @ts-ignore
        txnToast(srcChainId, "error", "Transaction Error", undefined, message);
      } else {
        txnToast(srcChainId, "fail", "Transaction Canceled");
      }
    }
  };

  let actionButton = {} as {
    text: string;
    onClick: () => void;
    style?: CSSProperties;
  };

  const inactive = {
    opacity: 0.6,
    transform: undefined,
  };

  if (connected) {
    if (connectedToRightChain) {
      if (amountEntered) {
        if (sufficientBalance) {
          if (areInSync) {
            actionButton = {
              text: "Transfer",
              onClick: () => {
                transfer(
                  srcClient,
                  tokenAddress,
                  account!,
                  transferAmount,
                  path[0],
                  path[1],
                );
              },
            };
          } else {
            actionButton = {
              text: "Out of sync",
              onClick: () => {},
              style: inactive,
            };
          }
        } else {
          actionButton = {
            text: "Insufficient balance",
            onClick: () => {},
            style: inactive,
          };
        }
      } else {
        actionButton = {
          text: "Enter an amount",
          onClick: () => {},
          style: {
            opacity: 0.4,
            transform: undefined,
          },
        };
      }
    } else {
      actionButton = {
        text: "Switch to " + src,
        onClick: () => {},
        style: {
          background: "#F83245",
        },
      };
    }
  } else if (unsupportedNetwork) {
    actionButton = {
      text: "Switch to " + src,
      onClick: () => {},
      style: {
        background: "#F83245",
      },
    };
  } else {
    actionButton = {
      text: "Connect",
      onClick: () => activate(injected),
    };
  }

  return (
    <Box
      style={{
        width: "405px",
        boxShadow:
          "0px 8px 16px 2px rgba(97, 97, 97, 0.1), 0px 16px 32px 2px rgba(97, 97, 97, 0.1)",
        position: "relative",
        alignSelf: "center",

        // margin: "40px 20px 0px 0px",
      }}
      background="white"
      round="12px"
      pad="20px 22px 20px"
    >
      <Text
        textAlign="center"
        weight={800}
        size="20px"
        color="#414141"
        style={{
          lineHeight: "150%",
        }}
      >
        Cross-Chain Bridge
      </Text>
      <Box height="15px" />
      <Box
        width="360px"
        style={{
          border: "1px solid #C0C0C0",
        }}
        round="8px"
        height="73px"
        pad="10px 12px 0px"
      >
        {/* <Input onChange={changeHandler} /> */}
        <Box direction="row">
          {/* <Box direction="row"> */}
          <Text
            size="13px"
            weight={500}
            color="#818181"
            style={{
              lineHeight: "132%",
            }}
          >
            Transfer amount
          </Text>
          <Box
            margin={{
              left: "auto",
            }}
          />
          <Text
            size="13px"
            weight={500}
            color="#818181"
            style={{
              lineHeight: "132%",
              marginRight: "4px",
            }}
          >
            Balance:
          </Text>
          <Text
            size="13px"
            weight={500}
            color="#414141"
            style={{
              lineHeight: "132%",
            }}
          >
            {formatNum(Number(balance.toFixed(0)))} {token}
          </Text>
        </Box>
        <Box height="6px" />
        <Box direction="row" align="center">
          <Input
            // injectStyles={false}
            minWidth={30}
            placeholder="0.0"
            value={transferAmount}
            onChange={changeHandler}
            onKeyPress={e => {
              console.log(e.key);
              if (
                _isFinite(Number(e.key)) ||
                (e.key === "." && !transferAmount.includes("."))
              ) {
              } else {
                e.preventDefault();
              }
            }}
          />
          {/* <Box>
            <Text size="18px" weight={400} color="#414141">
              DEFT
            </Text>
          </Box> */}
          <Tooltip
            placement="bottomRight"
            align={{
              offset: [0, -35],
            }}
            trigger={["click"]}
            overlay={
              <Box
                background="white"
                style={{
                  width: "120px",
                  height: "44px",
                  boxShadow: "rgba(0,0,0, 0.12) 0px 3px 14px 3px",
                  border: "1px solid rgb(192, 192, 192)",

                  // border: "1px solid #f2f2f2",
                  // 1px solid rgb(192, 192, 192)
                }}
                round="6px"
              >
                <Box height="2px"></Box>
                {tokens.map((token2, i) => {
                  const isLast = tokens.length === i + 1;
                  const isActive = token2.name === token;

                  return (
                    <HoveredColor
                      height="40px"
                      pad="0px 10px"
                      align="center"
                      direction="row"
                      style={{
                        cursor: "pointer",
                        ...(isLast
                          ? {}
                          : {
                              borderBottom: "1px solid #cecece",
                            }),
                      }}
                      onClick={() => {
                        setToken(token2.name);
                        onVisibleChange(false);
                      }}
                    >
                      <Text
                        size="16px"
                        {...(isActive
                          ? {
                              weight: 600,
                              color: "#414141",
                            }
                          : {
                              weight: 500,
                              color: "#818181",
                            })}
                      >
                        {token2.name}
                      </Text>
                    </HoveredColor>
                  );
                })}

                <Box height="2px"></Box>
              </Box>
            }
            visible={visible}
            onVisibleChange={v => onVisibleChange(v)}
          >
            <HoverScale
              margin={{
                left: "auto",
              }}
              style={{
                // border: "1px solid #007eff",
                border: "1px solid rgb(192, 192, 192)",
                boxShadow: "rgba(97,97,97,0.10) 0px 2px 1px 0px",
                cursor: "pointer",
              }}
              round="8px"
              align="center"
              justify="center"
              pad={"3px 7px 3px 11px"}
              direction="row"
            >
              <Text weight={600} color="#414141" size="14px">
                {token}
              </Text>
              <Angle />
            </HoverScale>
          </Tooltip>
        </Box>
      </Box>
      <Box height="12px" />

      <Box direction="row" justify="between" align="center">
        <Box
          pad="8px 12px 7px"
          height="54px"
          width="149px"
          round="8px"
          style={{
            border: "1px solid #E3E3E3",
            cursor: "pointer",
          }}
          justify="between"
          direction="row"
        >
          <Box>
            <Text
              style={{
                lineHeight: "132%",
              }}
              size="13px"
              color="#818181"
            >
              From
            </Text>
            <Box height="2px"></Box>
            <Text weight={600} size="15px" color="#414141">
              {chainIdToShort[path[0]]}
            </Text>
          </Box>
          {chainIdToIcon[path[0]]}
        </Box>
        <Box
          height="40px"
          width="40px"
          align="center"
          justify="center"
          style={{
            cursor: "pointer",
            userSelect: "none",
          }}
          onClick={() => changeDirection()}
        >
          <Direction />
        </Box>
        <Box
          pad="8px 12px 7px"
          height="54px"
          width="149px"
          round="8px"
          style={{
            border: "1px solid #E3E3E3",
            cursor: "pointer",
          }}
          justify="between"
          direction="row"
        >
          <Box>
            <Text
              style={{
                lineHeight: "132%",
              }}
              size="13px"
              color="#818181"
            >
              To
            </Text>
            <Box height="2px"></Box>
            <Text weight={600} size="15px" color="#414141">
              {chainIdToShort[path[1]]}
            </Text>
          </Box>

          {chainIdToIcon[path[1]]}
        </Box>
      </Box>

      <Box height="15px" />
      <Divider />
      <Box
        margin={{
          vertical: "6px",
        }}
      >
        <Box direction="row" align="center" height="36px">
          <Text size="14px" color="#818181" weight={500}>
            Bridge Fee
          </Text>
          <Box margin={{ left: "6px" }}>
            <Hint
              description={
                <Text
                  size="13px"
                  style={{
                    lineHeight: "22px",
                  }}
                  textAlign="center"
                >
                  Fixed fee
                </Text>
              }
            >
              <Box>
                <QuestionIcon />
              </Box>
            </Hint>
          </Box>
          <Box
            margin={{
              left: "auto",
            }}
          ></Box>
          <Text size="14px" color="#414141" weight={700}>
            {formatNum(Number(fee.toFixed(0)))} {token}
          </Text>
        </Box>
        <Box direction="row" align="center" height="36px">
          <Text size="14px" color="#818181" weight={500}>
            You will get
          </Text>
          <Box margin={{ left: "6px" }}>
            <Hint
              description={
                <Text
                  size="13px"
                  style={{
                    lineHeight: "22px",
                  }}
                  textAlign="center"
                >
                  transferAmount - bridgeFee
                </Text>
              }
            >
              <Box>
                <QuestionIcon />
              </Box>
            </Hint>
          </Box>
          <Box
            margin={{
              left: "auto",
            }}
          ></Box>
          <Text size="14px" color="#414141" weight={700}>
            {formatNum(
              Number(
                (Number(transferAmount) > fee
                  ? Number(transferAmount) - fee
                  : 0
                ).toFixed(0),
              ),
            )}{" "}
            {token}
          </Text>
        </Box>
      </Box>
      <HoveredElement
        render={binder => {
          return (
            <Box
              {...binder.bind}
              width="100%"
              height="48px"
              round="8px"
              background={binder.hovered ? "#4d9aff" : "#2B86FF"}
              // background={
              //   binder.hovered ? actionButton.bgHover : actionButton.bg
              // }
              align="center"
              justify="center"
              style={{
                ...(binder.hovered
                  ? {
                      transform: "scale(1.01)",
                    }
                  : {}),
                ...actionButton.style,

                cursor: "pointer",
                boxShadow:
                  "0px 1px 2px rgba(97, 97, 97, 0.2), 0px 2px 4px rgba(97, 97, 97, 0.2)",
                ...(loader
                  ? {
                      pointerEvents: "none",
                    }
                  : {}),
              }}
              pad="0px 16px"
              onClick={() => actionButton.onClick()}
            >
              {loader && <div className="loader"></div>}

              {!loader && (
                <Text
                  size="16px"
                  color="white"
                  style={{
                    letterSpacing: "0.05em",
                  }}
                  weight={600}
                >
                  {actionButton.text}
                </Text>
              )}
            </Box>
          );
        }}
      />
    </Box>
  );
};

const Angle = ({
  rotate,
  color,
  size,
}: {
  rotate?: boolean;
  color?: string;
  size?: string;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      height={size ? size : "24px"}
      fill={color ? color : "#414141"}
      style={
        rotate
          ? {
              transform: "rotate(180deg)",
            }
          : {}
      }
    >
      <path d="M17,9.17a1,1,0,0,0-1.41,0L12,12.71,8.46,9.17a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.42l4.24,4.24a1,1,0,0,0,1.42,0L17,10.59A1,1,0,0,0,17,9.17Z" />
    </svg>
  );
};

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider, "any");
  //   const library = new ethers.providers.JsonRpcProvider('')

  library.pollingInterval = 5000;
  return library;
}

const BoxHoveredScale = styled(Box)`
  cursor: pointer;
  &:hover {
    transform: scale(1.1);
  }
`;

const GlobalContext = createContext({
  token: "DEFT",
  tokenAddress: "",
  balance: 0,
  fee: 0,
  // minAmount: 0,
  setToken: (token: string) => {},
  setFee: (fee: number) => {},
  setBalance: (balance: number) => {},
  refetchBalance: async (account: string) => {},
});

const GlobalState = ({ children }: { children: React.ReactNode }) => {
  const { account, chainId } = useWeb3React();

  const [balance, setBalance] = useState(0);
  const [fee, setFee] = useState(0);
  // const [minAmount, setMinAmount] = useState(0);

  const [token, setToken] = useState("DEFT");

  const tokenAddress = tokens.find(item => item.name === token)?.address!;

  const tokenContract = useTokenContract(tokenAddress);
  const bridgeContract = useBridgeContract();

  console.log({
    fee,
  });

  const refetchBalance = async (account: string) => {
    try {
      const balance = await tokenContract.balanceOf(account);

      setBalance(Math.floor(Number(ethers.utils.formatEther(balance))));
      console.log({
        balance: ethers.utils.formatEther(balance),
      });
    } catch (error) {
      setBalance(0);
      console.log(error);
    }
  };

  useEffect(() => {
    if (account) {
      refetchBalance(account);
    }
  }, [account, tokenAddress, chainId]);

  return (
    <GlobalContext.Provider
      value={{
        token,
        tokenAddress,
        setToken,
        balance,
        fee,
        setFee,
        setBalance,
        refetchBalance,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const AccountBalance = ({
  account,
  balance,
  token,
}: {
  account: string;
  balance: number;
  token: string;
}) => {
  return (
    <React.Fragment>
      <Box width="12px"></Box>
      <Box
        pad={"3px 3px 3px 10px"}
        background="#ebebeb"
        round="8px"
        direction="row"
        align="center"
      >
        <Text size="15px" color="#414141" weight={600}>
          {formatNum(Number(balance.toFixed(0)))} {token}
        </Text>
        <Box
          background="white"
          pad="3px 8px"
          round="6px"
          margin={{ left: "10px" }}
        >
          <Text size="14px" weight={600} color="#414141">
            {account
              ? account.slice(0, 6) +
                "..." +
                account.slice(account.length - 4, account.length)
              : "..."}
          </Text>
        </Box>
      </Box>
      <Box width="12px"></Box>
      <BoxHoveredScale
        height="24px"
        width="24px"
        style={{
          color: "#25a3e2",
        }}
        onClick={() => window.open("https://t.me/DefiFactory", "_blank")}
      >
        <TelegramIcon />
      </BoxHoveredScale>
    </React.Fragment>
  );
};

export const Top = () => {
  const { account, activate, chainId, library, connector, error } =
    useWeb3React();

  const chain = idToChain[chainId as Chains] || "";
  // const tokenContract = useTokenContract();

  const history = useHistory();

  const { balance, token } = useContext(GlobalContext);

  const isMobileOrTablet = useMedia({ maxWidth: "500px" });

  return (
    <Box
      direction="row"
      align="center"
      height="75px"
      pad="16px"
      margin={{
        bottom: "85px",
      }}
    >
      <Box
        style={{
          cursor: "pointer",
        }}
        onClick={() => history.push("/")}
      >
        <Logo />
      </Box>
      <Box
        margin={{
          left: "auto",
        }}
      ></Box>
      <Text size="15px" color="#414141" weight={600}>
        {chain}
      </Text>
      {!isMobileOrTablet && (
        <AccountBalance account={account!} balance={balance} token={token} />
      )}
    </Box>
  );
};

export const Bottom = () => {
  const { account } = useWeb3React();
  const { balance, token } = useContext(GlobalContext);

  const isMobileOrTablet = useMedia({ maxWidth: "500px" });

  if (!isMobileOrTablet) {
    return null;
  }

  return (
    <Box
      direction="row"
      align="center"
      height="75px"
      pad="16px"
      margin={{
        bottom: "85px",
      }}
    >
      <AccountBalance account={account!} balance={balance} token={token} />
    </Box>
  );
};

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ReactManager>
        <Grommet
          theme={{
            global: {
              focus: {
                outline: undefined,
                border: {
                  color: "all",
                },
                shadow: undefined,
              },
            },
          }}
        >
          <GlobalState>
            <Router>
              <ToastContainer position={"bottom-left"} />
              <Top />
              <Box
                direction="column"
                // justify="center"
                align="center"
                style={{
                  // margin: "0 auto",
                  width: "100%",
                  // TODO: for iphone pad-top 60px
                  padding: "0px 10px",
                }}
              >
                <Route exact path="/" component={BridgeWidget} />
                <Route
                  exact
                  path="/p/:src/:dest/:id"
                  component={BridgeWidgetProcess}
                />
              </Box>
              <Bottom />
            </Router>
          </GlobalState>
        </Grommet>
      </Web3ReactManager>
    </Web3ReactProvider>
  );
}

export default App;
