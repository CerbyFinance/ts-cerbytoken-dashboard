import { useWeb3React } from "@web3-react/core";
import { Web3ReactManagerFunctions } from "@web3-react/core/dist/types";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { Box, Text } from "grommet";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import {
  Chains,
  PossibleChains,
  supportedChainIds,
  switchToNetwork,
} from "./chains";
import {
  AngleLeft,
  AvaxLogo,
  BinanceLogo,
  CoinbaseLogo,
  CrossIcon,
  EthereumLogo,
  FantomLogo,
  KeyIcon,
  MetamaskLogo,
  PolygonLogo,
  WalletConnectLogo,
} from "./icons";
import { injected, walletconnect, walletlink } from "./shared/connectors";
import { ModalsContext } from "./shared/modals";
import { ThemeContext } from "./shared/theme";

function capitalize(s: string) {
  return s[0].toUpperCase() + s.slice(1);
}

const wallets = ["metamask", "walletConnect", "coinbase"] as const;
type Wallets = typeof wallets[number];

const walletToIcon = {
  metamask: <MetamaskLogo />,
  walletConnect: <WalletConnectLogo />,
  // venly: <Box></Box>,
  coinbase: <CoinbaseLogo />,
} as {
  [key in Wallets]: JSX.Element;
};

const chainIdToShort = {
  1: "ETH",
  56: "BSC",
  137: "Polygon",
  250: "Fantom",
  43114: "Avalanche",

  3: "ETH (ROP)",
  42: "ETH (KOV)",
  97: "BSC (TEST)",
} as {
  [key in PossibleChains]: string;
};

const chainIdToIcon = {
  1: <EthereumLogo />,
  56: <BinanceLogo />,
  137: <PolygonLogo />,

  250: <FantomLogo />,
  43114: <AvaxLogo />,

  3: <EthereumLogo />,
  42: <EthereumLogo />,
  97: <BinanceLogo />,
} as {
  [key in PossibleChains]: JSX.Element;
};

const HoverScale = styled(Box)`
  &:hover {
    transform: scale(1.048);
  }
`;

const NoNetwork = () => {
  return <Box height="54px" width="149px"></Box>;
};

const Network = ({
  chain,
  onClick,
  isDark,
}: {
  chain: PossibleChains;
  onClick: () => void;
  isDark?: boolean;
}) => (
  <HoverScale
    pad="8px 12px 7px"
    height="60px"
    // width="110px"
    // width="149px"
    width="174px"
    round="8px"
    style={{
      border: "1px solid #E3E3E3",
      cursor: "pointer",
    }}
    justify="between"
    direction="row"
    align="center"
    margin={{
      bottom: "16px",
    }}
    onClick={onClick}
  >
    <Box>
      <Text
        style={{
          lineHeight: "132%",
        }}
        size="13px"
        color="#818181"
      >
        chain
      </Text>
      <Box height="5px"></Box>
      <Text weight={600} size="17px" color={isDark ? "white" : "#414141"}>
        {chainIdToShort[chain]}
      </Text>
    </Box>
    {chainIdToIcon[chain]}
  </HoverScale>
);

const Address = ({
  address,
  isDark,
}: {
  address: string;
  isDark?: boolean;
}) => (
  <HoverScale
    pad="8px 12px 7px"
    height="60px"
    // width="110px"
    // width="149px"
    // width="170px"
    round="8px"
    style={{
      border: "1px solid #E3E3E3",
      cursor: "pointer",
    }}
    justify="between"
    direction="row"
    align="center"
    margin={{
      bottom: "16px",
    }}
  >
    <Box>
      <Text
        style={{
          lineHeight: "132%",
        }}
        size="13px"
        color="#818181"
      >
        address
      </Text>
      <Box height="5px"></Box>
      <Text weight={600} size={"15px"} color={isDark ? "white" : "#414141"}>
        {address}
      </Text>
    </Box>
    <KeyIcon />
    {/* {walletToIcon[name]} */}
  </HoverScale>
);

const Wallet = ({
  name,
  sm,
  onClick,
  isDark,
}: {
  sm?: boolean;
  name: Wallets;
  onClick: () => void;
  isDark?: boolean;
}) => (
  <HoverScale
    pad="8px 12px 7px"
    height="60px"
    // width="110px"
    // width="149px"
    width="170px"
    round="8px"
    style={{
      border: "1px solid #E3E3E3",
      cursor: "pointer",
    }}
    justify="between"
    direction="row"
    align="center"
    margin={{
      bottom: "16px",
    }}
    onClick={onClick}
  >
    <Box>
      <Text
        style={{
          lineHeight: "132%",
        }}
        size="13px"
        color="#818181"
      >
        wallet
      </Text>
      <Box height="5px"></Box>
      <Text
        weight={600}
        size={sm ? "15px" : "17px"}
        color={isDark ? "white" : "#414141"}
      >
        {capitalize(name)}
      </Text>
    </Box>
    {walletToIcon[name]}
  </HoverScale>
);

const BlueLoader = () => (
  <div
    className="loader"
    style={{
      borderTopColor: "rgb(43, 134, 255)",
      width: "30px",
      height: "30px",
    }}
  ></div>
);

const connectWalletlink = (
  walletlink: WalletLinkConnector,
  activate: Web3ReactManagerFunctions["activate"],
) => {
  activate(walletlink, async error => {
    console.log(error);
    console.log("ERROR ");
  })
    .then(result => {
      console.log(result);
      console.log("CONNECTED ");
    })
    .catch(error => {
      console.log(error);
    });
};

const connectTrustWallet = (
  walletconnect: WalletConnectConnector,
  activate: Web3ReactManagerFunctions["activate"],
) => {
  walletconnect.close();
  walletconnect.walletConnectProvider = null;
  walletconnect.deactivate();
  window.localStorage.removeItem("walletconnect");
  activate(walletconnect, async error => {
    console.log(error);
    console.log("ERROR ");
  })
    .then(result => {
      console.log(result);
      console.log("CONNECTED ");
    })
    .catch(error => {
      console.log(error);
    });
};

const Overlay = ({
  isDark,
  children,
}: {
  isDark: boolean;
  children: JSX.Element;
}) => {
  return (
    <Box
      pad="22px 22px 10px"
      width="412px"
      round="10px"
      className="bg-white dark:bg-black"
      style={{
        ...(isDark
          ? {
              border: "1px solid #707070",
            }
          : {}),
      }}
    >
      {children}
    </Box>
  );
};

export const ConnectWallet = () => {
  const { active: active0 } = useWeb3React();
  const {
    active,
    account,
    library,
    activate,
    chainId,
    connector,
    deactivate,
    error,
  } = useWeb3React();

  const { theme } = useContext(ThemeContext);
  const { closeModal } = useContext(ModalsContext);
  const isDark = theme === "dark";

  const [activateInjected, setActivateInjected] = useState(false);

  // metamask passive error handling
  useEffect(() => {
    const timer = setInterval(() => {
      if (!error) {
        return;
      }

      // metamask only
      if (connector !== injected) {
        return;
      }
      console.log(error);
      if (error.message.includes("wallet_requestPermissions")) {
        // fix when canceled
        activate(injected);
      } else if (error.message.includes("The user rejected the request")) {
        // @ts-ignore
        activate(null);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [error]);

  const [networkId, setNetworkId] = useState<Chains | undefined>();

  // exclusively for metamask
  useEffect(() => {
    // metamask only
    if (connector !== injected) {
      return;
    }
    if (activateInjected && networkId && library) {
      setActivateInjected(false);
      switchToNetwork({
        chainId: networkId,
        library,
      });
    }
  }, [activateInjected, library]);

  const clickConnect = (wallet: Wallets) => {
    if (library) {
      return;
    }

    console.log({
      wallet,
      activate,
      injected,
      library,
    });

    // deactivate();

    if (wallet === "metamask") {
      activate(injected, err => {}, true)
        .then(() => {
          // @ts-ignore
          setActivateInjected(true);
        })
        .catch(error => {
          if (error.message.includes("The user rejected the request")) {
            // ignore
          } else {
            // fix when eager connect
            activate(injected);
            setActivateInjected(true);
          }
          console.log(error);
        });
    } else if (wallet === "walletConnect") {
      const instance = walletconnect[networkId as Chains];
      connectTrustWallet(instance, activate);
    } else if (wallet === "coinbase") {
      toast.warn("Select network in coinbase wallet");
      // const instance = walletlink[networkId as Chains];
      const instance = walletlink;

      connectWalletlink(instance, activate);
    }
  };

  let connectedTo: Wallets | "unknown" = "unknown";
  if (!connector) {
    // can be undefined
  } else if (connector === injected) {
    connectedTo = "metamask";
  } else if (connector === walletconnect[chainId as Chains]) {
    connectedTo = "walletConnect";
    // } else if (connector === walletlink[chainId as Chains]) {
    // } else if (connector.constructor.name === "WalletLinkConnector") {
  } else if (connector === walletlink) {
    connectedTo = "coinbase";
  }

  // console.log({
  //   connector,
  //   // @ts-ignore
  //   csName: connector?.constructor.name,
  // });

  if (connector && library) {
    return (
      <Overlay isDark={isDark}>
        <>
          <Box direction="row" align="center">
            <Box
              style={{
                cursor: "pointer",
                width: "34px",
                height: "21px",
              }}
              margin={{
                left: "-10px",
              }}
              onClick={() => {
                deactivate();
                // @ts-ignore
                activate(null);
                // setWallet(undefined);
                setActivateInjected(false);
                // window.location.reload();
              }}
            >
              <AngleLeft />
            </Box>
            <Text size="18px" color="text">
              Connected with {capitalize(connectedTo)}
            </Text>
            <Box
              margin={{
                left: "auto",
              }}
            ></Box>
            <Box
              style={{
                cursor: "pointer",
              }}
              margin={"-8px"}
              height="20px"
              width="30px"
              onClick={() => closeModal()}
            >
              <CrossIcon />
            </Box>
          </Box>

          <Box height="20px"></Box>
          <Box direction="row" wrap justify="between">
            <Wallet
              sm={connectedTo === "walletConnect"}
              // @ts-ignore
              name={connectedTo}
              onClick={() => {}}
              isDark={isDark}
            />
            <Network
              chain={chainId as PossibleChains}
              onClick={() => {}}
              isDark={isDark}
            />
          </Box>
          <Address
            address={`${account?.slice(0, 16)} . . . ${account?.slice(-10)}`}
            // address={account!}
            isDark={isDark}
          />
        </>
      </Overlay>
    );
  }

  if (networkId) {
    return (
      <Overlay isDark={isDark}>
        <>
          <Box direction="row" align="center">
            <Box
              style={{
                cursor: "pointer",
                width: "34px",
                height: "21px",
              }}
              margin={{
                left: "-10px",
              }}
              onClick={() => setNetworkId(undefined)}
            >
              <AngleLeft />
            </Box>
            <Text size="18px" color="text">
              Connect to a wallet
            </Text>
            <Box
              margin={{
                left: "auto",
              }}
            ></Box>
            <Box
              style={{
                cursor: "pointer",
              }}
              margin={"-8px"}
              height="20px"
              width="30px"
              onClick={() => closeModal()}
            >
              <CrossIcon />
            </Box>
          </Box>

          <Box height="20px"></Box>
          <Box direction="row" wrap justify="between">
            {wallets.map(item => (
              <Wallet
                sm={item === "walletConnect"}
                name={item}
                onClick={() => {
                  // setWallet(item);
                  clickConnect(item);
                }}
                isDark={isDark}
              />
            ))}
          </Box>
        </>
      </Overlay>
    );
  }

  return (
    <Overlay isDark={isDark}>
      <>
        <Box direction="row" align="center">
          <Text size="18px" color="text">
            Choose network
          </Text>
          <Box
            margin={{
              left: "auto",
            }}
          ></Box>
          <Box
            style={{
              cursor: "pointer",
            }}
            margin={"-8px"}
            height="20px"
            width="30px"
            onClick={() => closeModal()}
          >
            <CrossIcon />
          </Box>
        </Box>
        <Box height="20px"></Box>
        <Box direction="row" wrap justify="between">
          {supportedChainIds.map(item => (
            <Network
              chain={item}
              onClick={() => {
                setNetworkId(item);
              }}
              isDark={isDark}
            />
          ))}
        </Box>
      </>
    </Overlay>
  );
};
