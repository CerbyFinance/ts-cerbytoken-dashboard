import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import { Box, Grommet, Text } from "grommet";
import React, { CSSProperties, useState } from "react";
import AutosizeInput from "react-input-autosize";
import styled from "styled-components";
import { Chains } from "./chains";
import { Hint } from "./components/Hint";
import { injected } from "./connectors";
import { QuestionIcon } from "./Icons";
import { HoveredElement } from "./shared/hooks";
import { dynamicTemplate } from "./shared/utils";
import Web3ReactManager from "./shared/Web3Manager";

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

const Direction = () => (
  <svg
    width="18"
    height="16"
    viewBox="0 0 18 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M0 7.875C0 8.49632 0.50368 9 1.125 9H14.159L9.3295 13.8295C8.89016 14.2688 8.89016 14.9812 9.3295 15.4205C9.76884 15.8598 10.4812 15.8598 10.9205 15.4205L17.6705 8.6705C18.1098 8.23116 18.1098 7.51884 17.6705 7.0795L10.9205 0.329505C10.4812 -0.109835 9.76884 -0.109835 9.3295 0.329505C8.89016 0.768845 8.89016 1.48116 9.3295 1.9205L14.159 6.75L1.125 6.75C0.50368 6.75 0 7.25368 0 7.875Z"
      fill="#2B86FF"
    />
  </svg>
);

const EthereumLogo = () => (
  <svg
    width="24"
    height="36"
    viewBox="0 0 24 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.623 26.5565V35.9999L23.2194 19.5352L11.623 26.5565Z"
      fill="#62688F"
    />
    <path
      d="M22.7744 18.7333L11.623 0V13.6214L22.7744 18.7333Z"
      fill="#62688F"
    />
    <path
      d="M11.623 13.6172V25.2415L22.6836 18.6932L11.623 13.6172Z"
      fill="#454A75"
    />
    <path
      d="M0.475586 18.7333L11.6251 0V13.6214L0.475586 18.7333Z"
      fill="#8A92B2"
    />
    <path
      d="M11.6247 13.6172V25.2415L0.53418 18.6932L11.6247 13.6172Z"
      fill="#62688F"
    />
    <path
      d="M11.5955 26.5565V35.9999L0 19.5352L11.5955 26.5565Z"
      fill="#8A92B2"
    />
  </svg>
);

const BinanceLogo = () => (
  <svg
    width="35"
    height="36"
    viewBox="0 0 35 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M3.82318 21.9425L7.64636 17.9531L3.82318 13.9637L0 17.9531L3.82318 21.9425Z"
      fill="#F3BA2F"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M30.5849 21.9425L34.4081 17.9531L30.5849 13.9637L26.7617 17.9531L30.5849 21.9425Z"
      fill="#F3BA2F"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M17.204 21.9425L21.0272 17.9531L17.204 13.9637L13.3809 17.9531L17.204 21.9425Z"
      fill="#F3BA2F"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M19.1168 1.99454L17.2052 -0.000164234L6.69141 10.9707L10.5146 14.9601L17.2052 7.97865L23.8957 14.9601L27.7189 10.9707L19.1168 1.99454Z"
      fill="#F3BA2F"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M15.2924 33.9098L17.204 35.9045L27.7178 24.9336L23.8946 20.9442L17.204 27.9256L10.5135 20.9442L6.69027 24.9336L15.2924 33.9098Z"
      fill="#F3BA2F"
    />
  </svg>
);

const CheckLg = () => (
  <svg
    width="16"
    height="14"
    viewBox="0 0 16 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M13.5683 1.31813C14.1175 0.768956 15.0079 0.768956 15.557 1.31813C16.0995 1.86057 16.1061 2.73591 15.577 3.28651L8.09162 12.6432C8.08082 12.6567 8.06927 12.6696 8.05704 12.6819C7.50787 13.231 6.61748 13.231 6.06831 12.6819L1.10622 7.71978C0.557042 7.17061 0.557042 6.28022 1.10622 5.73104C1.65539 5.18187 2.54578 5.18187 3.09495 5.73104L7.0203 9.65639L13.531 1.3602C13.5426 1.34544 13.555 1.33139 13.5683 1.31813Z"
      fill="#1F8B24"
    />
  </svg>
);

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
    none: "transfer ${amount} DEFT from <b>${src}</b> to <b>${dest}</b>",
    loading: "transfering ${amount} DEFT from <b>${src}</b> to <b>${dest}</b>",
    error: "",
    success: "transfered ${amount} DEFT from <b>${src}</b> to <b>${dest}</b>",
  },
  validation: {
    none: "ensure correctness of transfer",
    loading: "ensuring correctness of transfer",
    error: "",
    success: "transfer is correct",
  },
  receive: {
    none: "receive ${amount} DEFT on <b>${dest}</b>",
    loading: "receiving ${amount} DEFT on <b>${dest}</b>",
    error: "",
    success: "you received ${amount} DEFT on <b>${dest}</b>",
  },
} as {
  [key in Process]: {
    [key in ProcessStatus]: string;
  };
};

const BridgeWidgetProcess = () => {
  const { account, activate, chainId, connector, error } = useWeb3React();

  const [step, setStep] = useState(1);
  const [processesStatus, setProcessesStatus] = useState({
    transfer: "success",
    validation: "loading",
    receive: "none",
  } as {
    [key in Process]: ProcessStatus;
  });

  const amount = Number(10551765646).toFixed(2);
  const src = "ETH";
  const dest = "BSC";

  // TODO: compute fee

  return (
    <Box
      style={{
        width: "405px",
        boxShadow:
          "0px 8px 16px 2px rgba(97, 97, 97, 0.1), 0px 16px 32px 2px rgba(97, 97, 97, 0.1)",
        position: "relative",
        alignSelf: "center",
      }}
      round="12px"
      pad="30px 22px 20px"
    >
      <Box justify="center">
        {[1, 2, 3].map(step => {
          const processId = stepToProcess[step];
          const processTextStatuses = processesTextStatuses[processId];
          const processStatus = processesStatus[processId];
          const processText = processTextStatuses[processStatus];

          const dynamicText = dynamicTemplate(processText, {
            amount,
            src,
            dest,
          });

          const dynamicParts = dynamicText.split(/(<b>.+?<\/b>)/gi) as (
            | string
            | JSX.Element
          )[];

          for (var i = 1; i < dynamicParts.length; i += 2) {
            dynamicParts[i] = (
              <strong key={i}>
                {(dynamicParts[i] as string).replace(/<[^>]*>/g, "")}
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
                      {step}
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
                  >
                    <CheckLg></CheckLg>
                  </Box>
                )}
                {processStatus === "loading" && (
                  <Box
                    style={{
                      position: "relative",
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
                        {step}
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
              {/*  */}
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

        {/*  */}
        {/* <Box height="51px" direction="row" align="center">
          <Box
            height="36px"
            width="36px"
            round="50%"
            // background="#D3F5D5"
            background="white"
            margin={{
              left: "10px",
              right: "14px",
            }}
            align="center"
            justify="center"
            style={{
              border: "2px solid #E0E0E0",
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
              2
            </Text>
          </Box>
          <Box>
            <Text
              weight={700}
              color="#414141"
              style={{
                lineHeight: "150%",
              }}
              size="16px"
            >
              Transfer
            </Text>
            <Text
              size="14px"
              color="#818181"
              style={{
                lineHeight: "150%",
              }}
            >
              transfered 10 DEFT from <strong>ETH</strong> to{" "}
              <strong>BSC</strong>
            </Text>
          </Box>
        </Box> */}
        {/*  */}
        {/* <Box height="32px" pad="4px 0px 0px 26px">
          <Box height="26px" width="4px" round="2px" background="#E0E0E0"></Box>
        </Box> */}
        {/*  */}
        {/* <Box height="51px" direction="row" align="center">
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
          >
            <CheckLg></CheckLg>
          </Box>
          <Box>
            <Text
              weight={700}
              color="#414141"
              style={{
                lineHeight: "150%",
              }}
              size="16px"
            >
              Transfer
            </Text>
            <Text
              size="14px"
              color="#818181"
              style={{
                lineHeight: "150%",
              }}
            >
              transfered 10 DEFT from <strong>ETH</strong> to{" "}
              <strong>BSC</strong>
            </Text>
          </Box>
        </Box> */}
      </Box>
      <Box height="21px" />
      <Box
        width="100%"
        height="48px"
        round="8px"
        background="#E0E0E0"
        align="center"
        justify="center"
        style={{
          cursor: "pointer",
        }}
      >
        <Text
          size="16px"
          color="#414141"
          style={{
            letterSpacing: "0.05em",
          }}
          weight={600}
        >
          Receive
        </Text>
      </Box>
    </Box>
  );
};

// TODO: precompute once

const chainToId = {
  ethereumMain: 1,
  binanceMain: 56,

  ropsten: 3,
  kovan: 42,
  binanceTest: 97,
} as {
  [key: string]: Chains;
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

const pathToFee = [
  {
    path: [42, 3],
    fee: 0.05,
  },
  {
    path: [3, 42],
    fee: 0.01,
  },
];

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

const BridgeWidget = () => {
  const { account, activate, chainId, connector, error } = useWeb3React();

  const [transferAmount, setTransferAmount] = useState("");
  const [isPopular, setPopular] = useState(true);

  const [balance, setBalance] = useState(0.123);

  const [loader, setLoader] = useState(false);
  const [path, setPath] = useState([3, 42] as [Chains, Chains]);

  const feePath = pathToFee.find(
    item => item.path[0] == path[0] && item.path[1] == path[1],
  );

  const fee = feePath?.fee || 0.01;
  const computedFee = Number(transferAmount) * fee;

  const setMax = () => {
    setTransferAmount(balance.toString());
  };

  const transfer = () => {
    setLoader(true);
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

  const connected = account ? true : false;

  const connectedToRightChain = account && path[0] === chainId;
  const unsupportedNetwork = error?.message.includes("Unsupported chain id");

  const amountEntered = Number(transferAmount) > 0;
  const sufficientBalance = Number(transferAmount) <= Number(balance);

  let actionButton = {} as {
    text: string;
    onClick: () => void;
    style?: CSSProperties;
  };

  if (connected) {
    if (connectedToRightChain) {
      if (amountEntered) {
        if (sufficientBalance) {
          actionButton = {
            text: "Transfer",
            onClick: () => {
              transfer();
            },
          };
        } else {
          actionButton = {
            text: "Insufficient balance",
            onClick: () => {},
            style: {
              opacity: 0.4,
              transform: undefined,
            },
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
        text: "Switch to " + chainIdToShort[path[0]],
        onClick: () => {},
      };
    }
  } else if (unsupportedNetwork) {
    actionButton = {
      text: "Switch to " + chainIdToShort[path[0]],
      onClick: () => {},
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
            {balance.toFixed(3)} DEFT
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
          <Box>
            <Text size="18px" weight={400} color="#414141">
              DEFT
            </Text>
          </Box>
          <Box
            margin={{
              left: "auto",
            }}
            style={{
              background: "rgba(252, 208, 207, 0.5)",
              cursor: "pointer",
            }}
            round="8px"
            align="center"
            justify="center"
            pad={"3px 11px"}
            onClick={() => setMax()}
          >
            <Text weight={500} color="#E1125E" size="14px">
              MAX
            </Text>
          </Box>
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
                  {fee}% fee
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
            {computedFee.toFixed(2)} DEFT
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
              onClick={() => actionButton.onClick}
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

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  //   const library = new ethers.providers.JsonRpcProvider('')

  library.pollingInterval = 12000;
  return library;
}

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
          <Box
            direction="row"
            justify="center"
            align="center"
            style={{
              // margin: "0 auto",
              width: "100%",
              // TODO: for iphone pad-top 60px
              padding: "160px 10px",
            }}
          >
            <BridgeWidget />
            <Box width="30px" />
            <BridgeWidgetProcess />
          </Box>
        </Grommet>
      </Web3ReactManager>
    </Web3ReactProvider>
  );
}

export default App;
