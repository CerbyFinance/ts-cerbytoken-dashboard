import { useWeb3React } from "@web3-react/core";
import { serializeError } from "eth-rpc-errors";
import { ethers } from "ethers";
import { Box, Text } from "grommet";
import Tooltip from "rc-tooltip";
import React, { CSSProperties, useContext, useEffect, useState } from "react";
import AutosizeInput from "react-input-autosize";
import { useHistory } from "react-router-dom";
import "react-toastify/dist/ReactToastify.min.css";
import styled from "styled-components";
import { Chains, switchToNetwork } from "./chains";
import { BinanceLogo, Direction, EthereumLogo, PolygonLogo } from "./Icons";
import { WrapContext } from "./Shared";
import { noopApollo } from "./shared/client";
import { injected } from "./shared/connectors";
import { HoveredElement } from "./shared/hooks";
import {
  CERBY_WRAPPING_CONTRACT,
  useCerbyToken,
  useCerbyWrappingContract,
} from "./shared/useContract";
import { formatNum } from "./shared/utils";
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

const chainIdToShort = {
  1: "ETH",
  56: "BSC",
  137: "Polygon",

  3: "ETH (ROP)",
  42: "ETH (KOV)",
  97: "BSC (TEST)",
} as {
  [key in Chains]: string;
};

const chainIdToIcon = {
  1: <EthereumLogo />,
  56: <BinanceLogo />,
  137: <PolygonLogo />,

  3: <EthereumLogo />,
  42: <EthereumLogo />,
  97: <BinanceLogo />,
} as {
  [key in Chains]: JSX.Element;
};

function _isFinite(value: any): boolean {
  return typeof value == "number" && isFinite(value);
}

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
    name: "Token1",
    address: "0xF89217f234434105b7f7a8912750D7CC612D7F9e",
    approvalNeeded: true,
  },
  {
    name: "Token2",
    address: "0x371934cea4f68e78455866325d5b0A7e31cB7387",
    approvalNeeded: false,
  },
];

const ChooseChain = ({
  chain,
  name,
  filter,
  directon,
  onChange,
}: {
  chain: Chains;
  name?: string;
  filter: Chains;
  directon: "from" | "to";

  onChange: (chainId: Chains) => void;
}) => {
  const [visible, onVisibleChange] = useState(false);

  return (
    <HoverScale
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
          {directon}
        </Text>
        <Box height="2px"></Box>
        <Text weight={600} size="15px" color="#414141">
          {/* TODO: */}
          {name}
        </Text>
      </Box>
      {chainIdToIcon[chain]}
    </HoverScale>
  );
};

export const WrapWidget = () => {
  const { account, activate, chainId, library, connector, error } =
    useWeb3React();

  const cerbyWrappingContract = useCerbyWrappingContract();

  const history = useHistory();

  const {
    balance,
    setToken,
    fee,
    setFee,
    token,
    tokenAddress,
    refetchBalance,
  } = useContext(WrapContext);

  const tokenMeta = tokens.find(item => item.name === token)!;
  const [fromAddr, toAddr] = [tokens[0].address, tokens[1].address];

  const cerbyTokenContract = useCerbyToken(tokenAddress);

  const isToken1Active = token === "Token1";

  console.log({
    isToken1Active,
  });

  const [transferAmount, setTransferAmount] = useState("");
  const [isPopular, setPopular] = useState(true);
  const [allowance, setAllowance] = useState(0);

  const [loader, setLoader] = useState(false);

  const setMax = () => {
    setTransferAmount(balance.toString());
  };

  const changeDirection = () => {
    if (token === "Token1") {
      setToken("Token2");
    } else {
      setToken("Token1");
    }
    // @ts-ignore
    // setPath(path.slice().reverse());
  };

  const changeHandler = (evt: any) => {
    setTransferAmount(evt.target.value);
  };

  console.log({
    transferAmount,
  });

  const path = [42, 42] as [Chains, Chains];

  const srcClient = noopApollo;
  const destClient = noopApollo;

  const [visibleToken, onVisibleTokenChange] = useState(false);

  const getAllowance = async () => {
    try {
      console.log({
        tokenAddress,
        account,
        CERBY_WRAPPING_CONTRACT,
      });

      const res = await cerbyTokenContract.allowance(
        account!,
        CERBY_WRAPPING_CONTRACT,
      );

      const bal = ethers.utils.formatEther(res);

      setAllowance(Number(bal));

      console.log({
        res,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fire = async () => {
      await getAllowance();
    };
    const timer = setInterval(() => {
      if (account) {
        fire();
      }
    }, 3500);

    if (account) {
      fire();
    }
    return () => clearInterval(timer);
  }, [account]);

  const connected = account ? true : false;

  const connectedToRightChain = account && path[0] === chainId;
  const unsupportedNetwork = error?.message.includes("Unsupported chain id");

  const amountEntered = Number(transferAmount) > 0;
  const sufficientBalance = Number(transferAmount) <= Number(balance);

  const src = chainIdToShort[path[0]] || "...";
  const dest = chainIdToShort[path[1]] || "...";

  const unwrap = async () => {
    try {
      setLoader(true);

      const result =
        await cerbyWrappingContract.burnCerbyWrappedTokenAndUnlockToken(
          toAddr,
          fromAddr,
          ethers.utils.parseEther(transferAmount),
        );

      const result2 = await result.wait();

      await refetchBalance(account!);

      console.log({
        result2,
      });
      setLoader(false);
    } catch (error) {
      setLoader(false);
      const serializedError = serializeError(error);
      const originalErrorMessage =
        (serializedError.data as any)?.originalError?.error?.message ||
        (serializedError.data as any)?.message;

      if (originalErrorMessage && originalErrorMessage.includes("CWS: ")) {
        const message = originalErrorMessage.split("CWS: ")[1];

        // @ts-ignore
        txnToast(chainId, "error", "Transaction Error", undefined, message);
      } else {
        txnToast(chainId as Chains, "fail", "Transaction Canceled");
      }
    }
  };

  const wrap = async () => {
    try {
      setLoader(true);

      const result =
        await cerbyWrappingContract.lockTokenAndMintCerbyWrappedToken(
          fromAddr,
          toAddr,
          ethers.utils.parseEther(transferAmount),
        );

      const result2 = await result.wait();

      await refetchBalance(account!);

      console.log({
        result2,
      });
      setLoader(false);
    } catch (error) {
      setLoader(false);
      const serializedError = serializeError(error);
      const originalErrorMessage =
        (serializedError.data as any)?.originalError?.error?.message ||
        (serializedError.data as any)?.message;

      if (originalErrorMessage && originalErrorMessage.includes("CWS: ")) {
        const message = originalErrorMessage.split("CWS: ")[1];

        // @ts-ignore
        txnToast(chainId, "error", "Transaction Error", undefined, message);
      } else {
        txnToast(chainId as Chains, "fail", "Transaction Canceled");
      }
    }
  };

  const approve = async () => {
    try {
      setLoader(true);
      // straight way to get max value of uint256
      const maxInt =
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
      const result = await cerbyTokenContract.approve(
        CERBY_WRAPPING_CONTRACT,
        // -1,
        maxInt,
      );

      const result2 = await result.wait();

      console.log({
        result2,
      });
      setLoader(false);
    } catch (error) {
      setLoader(false);
      const serializedError = serializeError(error);
      const originalErrorMessage =
        (serializedError.data as any)?.originalError?.error?.message ||
        (serializedError.data as any)?.message;

      if (originalErrorMessage && originalErrorMessage.includes("CWS: ")) {
        const message = originalErrorMessage.split("CWS: ")[1];

        // @ts-ignore
        txnToast(chainId, "error", "Transaction Error", undefined, message);
      } else {
        txnToast(chainId as Chains, "fail", "Transaction Canceled");
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
          if (!tokenMeta.approvalNeeded) {
            actionButton = {
              text: "Unwrap",
              onClick: () => {
                unwrap();
              },
            };
          } else {
            if (allowance >= Number(transferAmount)) {
              actionButton = {
                text: "Wrap",
                onClick: () => {
                  wrap();
                },
              };
            } else {
              actionButton = {
                text: "Approve",
                onClick: () => {
                  approve();
                },
              };
            }
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
        onClick: () => {
          switchToNetwork({
            library,
            chainId: 42,
          });
        },
        style: {
          background: "#F83245",
        },
      };
    }
  } else if (unsupportedNetwork) {
    actionButton = {
      text: "Switch to " + src,
      onClick: () => {
        switchToNetwork({
          library,
          chainId: 42,
        });
      },
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
        Cerby Wrapping Service
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
            Amount
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
                  // height: "44px",
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
                        onVisibleTokenChange(false);
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
            visible={visibleToken}
            onVisibleChange={v => onVisibleTokenChange(v)}
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
        <ChooseChain
          name={isToken1Active ? "Token1" : "Token2"}
          chain={42}
          filter={path[1]}
          directon="from"
          onChange={() => {}}
          // onChange={chainId => {
          //   setPath(oldPath => [chainId, oldPath[1]]);
          // }}
        />

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
        <ChooseChain
          // name="cerUSD"
          name={isToken1Active ? "Token2" : "Token1"}
          chain={42}
          filter={path[0]}
          directon="to"
          onChange={() => {}}

          // onChange={chainId => {
          //   setPath(oldPath => [oldPath[0], chainId]);
          // }}
        />
      </Box>

      <Box height="15px" />

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
