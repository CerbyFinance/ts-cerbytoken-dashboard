import { ApolloProvider } from "@apollo/react-hooks";
import { BigNumber } from "@ethersproject/bignumber";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import relativeTime from "dayjs/plugin/relativeTime";
import { ethers } from "ethers";
import { Box, Grommet, Text } from "grommet";
import "rc-dialog/assets/index.css";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  useHistory,
  useLocation,
  useRouteMatch,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import styled from "styled-components";
import useMedia from "use-media";
import {
  CheckIcon,
  ExchangeIcon,
  LinkIcon,
  ReferralsIcon,
  TelegramIcon,
  TwitterIcon,
  UniswapBuyIcon,
  YoutubeIcon,
} from "./icons";
import { Logo } from "./logo";
import { nobotsClient } from "./shared/client";
import { injected, supportedChainIds } from "./shared/connectors";
import { HoveredElement } from "./shared/hooks";
import { ModalsCreatedApp, ModalsState } from "./shared/modals";
import { useNobotsContract, useTokenContract } from "./shared/useContract";
import Web3ReactManager from "./shared/Web3Manager";

dayjs.extend(relativeTime);
dayjs.extend(isYesterday);
dayjs.extend(isToday);

const oneE18 = BigNumber.from("1000000000000000000");
// const DEPLOYED_CHAINS = 97;
// const DEPLOYED_CHAIN = 42;
// const DEPLOYED_CHAIN = 1;
// const DEPLOYED_CHAIN = 42;

const BoxHoveredScale = styled(Box)`
  cursor: pointer;
  &:hover {
    transform: scale(1.1);
  }
`;

function LeftMenu() {
  const isStats = useRouteMatch({
    path: "/",
    exact: true,
  });

  const history = useHistory();

  // console.log({
  //   match1,
  //   match2,
  // });

  return (
    <Box
      style={{
        width: "217px",
        minWidth: "217px",
      }}
      margin={{
        right: "14px",
      }}
    >
      <Box
        direction="row"
        align="center"
        style={{
          cursor: "pointer",
        }}
        width="140px"
        onClick={() => history.push("/")}
      >
        <Box
          style={{
            width: "36px",
            height: "36px",
          }}
          margin={{
            right: "16px",
          }}
        >
          <Logo />
        </Box>
        <Text weight={600} size="32px" color="#44D6AD">
          deft
        </Text>
      </Box>
      <Box height="38px" />
      <Box
        height="40px"
        direction="row"
        align="center"
        onClick={() => history.push("/")}
      >
        <Box
          // height="40px"
          // width="40px"
          align="center"
          justify="center"
          margin={{
            left: "8px",
            right: "16px",
          }}
          style={
            isStats
              ? {
                  color: "#1672EC",
                }
              : {}
          }
        >
          <ReferralsIcon />
        </Box>
        <Text
          weight={500}
          size="15px"
          style={{
            lineHeight: "150%",
            ...(isStats
              ? {
                  color: "#1672EC",
                  fontWeight: 600,
                }
              : { color: "#414141" }),
          }}
        >
          Tax Cycle
        </Text>
      </Box>
      <Box
        height="40px"
        direction="row"
        align="center"
        onClick={() => window.open("https://bridge.defifactory.fi/", "_blank")}
      >
        <Box
          height="20px"
          width="20px"
          align="center"
          justify="center"
          margin={{ left: "10px", right: "16px" }}
        >
          <ExchangeIcon />
        </Box>
        <Text
          weight={500}
          size="15px"
          style={{
            lineHeight: "150%",
            color: "#414141",
          }}
        >
          Cross-Chain Bridge
        </Text>
      </Box>
      <Box
        height="40px"
        direction="row"
        align="center"
        onClick={() =>
          window.open(
            "https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xdef1fac7Bf08f173D286BbBDcBeeADe695129840&use=V2",
            "_blank",
          )
        }
      >
        <Box
          height="20px"
          width="20px"
          align="center"
          justify="center"
          margin={{ left: "10px", right: "16px" }}
          style={{
            position: "relative",
          }}
        >
          <Box
            style={{
              position: "absolute",
              left: "-6px",
              top: "-6px",
            }}
            width="30px"
            height="30px"
          >
            <UniswapBuyIcon />
          </Box>
        </Box>
        <Text
          weight={500}
          size="15px"
          style={{
            lineHeight: "150%",
            color: "#414141",
          }}
        >
          Uniswap Buy
        </Text>
      </Box>
      <Box height="28px" justify="center">
        <Box height="1px" background="#E0E0E0"></Box>
      </Box>
      <Box direction="row" justify="evenly" align="center">
        <BoxHoveredScale
          height="20px"
          width="20px"
          style={{
            color: "#44D6AD",
          }}
          onClick={() => window.open("https://defifactory.finance", "_blank")}
        >
          <LinkIcon />
        </BoxHoveredScale>
        <BoxHoveredScale
          height="24px"
          width="24px"
          style={{
            color: "#25a3e2",
          }}
          onClick={() =>
            window.open("https://t.me/DefiFactoryBot?start=info-join", "_blank")
          }
        >
          <TelegramIcon />
        </BoxHoveredScale>

        <BoxHoveredScale
          height="26px"
          width="26px"
          style={{
            color: "#cd201f",
          }}
          onClick={() =>
            window.open(
              "https://www.youtube.com/channel/UCWt80BebLmUWkWBPx4d_Q3A",
              "_blank",
            )
          }
        >
          <YoutubeIcon />
        </BoxHoveredScale>
        <BoxHoveredScale
          height="26px"
          width="26px"
          style={{
            color: "#1da1f2",
          }}
          onClick={() =>
            window.open("https://twitter.com/defifactory", "_blank")
          }
        >
          <TwitterIcon />
        </BoxHoveredScale>
      </Box>
    </Box>
  );
}

function useURLQuery() {
  return new URLSearchParams(useLocation().search);
}

const procMap = [15, 8, 3, 0];

function TaxCycle() {
  const { account, activate, chainId, connector, error } = useWeb3React();
  const tokenContract = useTokenContract();
  const nobotContract = useNobotsContract();

  const [myBalance, setMyBalance] = useState<number | undefined>();

  const refetchBalance = async (account: string) => {
    try {
      const balance = await tokenContract.balanceOf(account!);
      setMyBalance(Number(ethers.utils.formatEther(balance)));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (account) {
      refetchBalance(account);
    }
  }, [account]);

  const [progress, setProgress] = useState(0);
  const [cycleTax, setCycleTax] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const fire = async (account: string) => {
      const res = await nobotContract.getWalletCurrentCycle(account);

      console.log({
        cycleTax: res.currentCycleTax.toString(),
        howMuch: res.howMuchTimeLeftTillEndOfCycleThree.toString(),
      });

      const howMuch = Number(res.howMuchTimeLeftTillEndOfCycleThree);
      const cycleTax = Number(res.currentCycleTax);

      const progress = (360 * 86400 - howMuch) / (360 * 86400);
      setCycleTax((cycleTax / 1e6) * 100);
      setProgress(progress * 100);
      setDaysLeft(Math.floor(howMuch / 86400));

      console.log({
        progress,
      });
    };

    if (account) {
      fire(account);
    }
  }, [account, chainId]);

  const query = useURLQuery();

  let cycleN = 0;

  // 4705b5f55e92a0c32d225cc912afd3678af26568a18c4d89be1f5966b33de6b5

  if (progress >= 0) {
    cycleN = 1;
  }
  if (progress >= 33.33) {
    cycleN = 2;
  }
  if (progress >= 66.66) {
    cycleN = 3;
    if (progress === 100) {
      cycleN = 4;
    }
  }

  console.log({
    chainId,
    progress,
    daysLeft,
  });

  return (
    <Box
      direction="row"
      justify="center"
      // align="center"
      style={{
        // margin: "0 auto",
        width: "100%",
        padding: "50px 10px",
      }}
    >
      <LeftMenu />
      <Box
        // justify="center"
        // align="center"
        style={{
          // padding: "50px 0px",
          // width: "1238px",

          width: "976px",
          minWidth: "776px",
        }}
      >
        <Box width="100%">
          <Box margin={{ bottom: "30px" }} direction="row" align="center">
            <Box>
              <Text
                size="22px"
                weight={800}
                color="#414141"
                style={{
                  lineHeight: "130%",
                }}
              >
                Tax Cycle
              </Text>
              <Text size="16px" weight={400} color="#818181">
                How many days left until third cycle
              </Text>
            </Box>

            <Box
              margin={{
                left: "auto",
              }}
              align="center"
              direction="row"
            >
              <>
                {account ? (
                  supportedChainIds.includes(chainId!) ? (
                    <Text size="14px" weight={600} color="#414141">
                      {account.slice(0, 8) +
                        "..." +
                        account.slice(account.length - 6, account.length)}
                    </Text>
                  ) : (
                    <Box pad="4px 8px" round="6px" background="#F83245">
                      <Text size="16px" weight={600}>
                        Wrong Network
                      </Text>
                    </Box>
                  )
                ) : error?.message.includes("Unsupported chain id") ? (
                  <Box pad="4px 8px" round="6px" background="#F83245">
                    <Text size="16px" weight={600}>
                      Wrong Network
                    </Text>
                  </Box>
                ) : (
                  <HoveredElement
                    render={binder => {
                      return (
                        <Box
                          {...binder.bind}
                          height="40px"
                          round="8px"
                          background={binder.hovered ? "#bcdaf7" : "#CDE6FE"}
                          align="center"
                          justify="center"
                          style={{
                            minWidth: "132px",
                            cursor: "pointer",
                            boxShadow:
                              "0px 1px 2px rgba(97, 97, 97, 0.2), 0px 2px 4px rgba(97, 97, 97, 0.2)",
                          }}
                          pad="0px 16px"
                          onClick={() => {
                            activate(injected);
                          }}
                        >
                          <Text
                            size="16px"
                            color={binder.hovered ? "#070F31" : "#070F31"}
                            style={{
                              letterSpacing: "0.05em",
                            }}
                            weight={600}
                          >
                            Connect
                          </Text>
                        </Box>
                      );
                    }}
                  />
                )}
                <Box width="20px" />
                <Box pad="2px 6px" background="#f0f0f0" round="4px">
                  <Text size="16px" color="#3E3E3E" weight={600}>
                    {typeof myBalance === "number"
                      ? `${myBalance.toFixed(2)} DEFT`
                      : "..."}{" "}
                  </Text>
                </Box>
              </>
            </Box>
          </Box>

          <Box align="center">
            <Text size="24px" color="#414141" textAlign="center" weight={700}>
              {/* {progress.toFixed(0)}% */}
              {daysLeft}
            </Text>
            <Text
              size="16px"
              style={{
                lineHeight: "100%",
              }}
              color="#414141"
            >
              days left
            </Text>
            <Box height="16px"></Box>
            <Box direction="row">
              <Text size="16px" color="#818181" textAlign="center">
                Cycle: <strong>{cycleN === 4 ? "finish" : cycleN}</strong>
              </Text>
              <Box width="22px" align="center" justify="center">
                <Box
                  round="50%"
                  width="4px"
                  height="4px"
                  background="#dbdbdb"
                ></Box>
              </Box>
              <Text size="16px" color="#818181" textAlign="center">
                Tax: <strong>{cycleTax.toFixed(2)}%</strong>
              </Text>
            </Box>
            <Box height="22px" />
            <Box
              height="16px"
              width="600px"
              round="6px"
              background="#dddddd"
              style={{
                position: "relative",
              }}
            >
              <Box
                height="16px"
                width={progress + "%"}
                round="6px"
                background="#44d6ad"
              ></Box>
              {[0, 33.33, 66.66, 100].map((proc, i) => {
                if (progress >= proc) {
                  return (
                    <React.Fragment>
                      <Box
                        height="30px"
                        width="30px"
                        background="#44d6ad"
                        align="center"
                        justify="center"
                        style={{
                          position: "absolute",
                          content: "",
                          left: `calc(${proc}% - 12px)`,
                          bottom: "-6px",
                          boxShadow: "1px 2px 5px #c2d1cd",
                        }}
                        round="50%"
                      >
                        <Box height="14px">
                          <CheckIcon fill="white" />
                        </Box>
                      </Box>
                      <Box
                        style={{
                          position: "absolute",
                          content: "",
                          left: `calc(${proc}% - 5px)`,
                          bottom: "-35px",
                        }}
                      >
                        <Text size="15px" weight={700} color="#414141">
                          {procMap[i]}%
                        </Text>
                      </Box>
                    </React.Fragment>
                  );
                }
                return (
                  <React.Fragment>
                    <Box
                      height="30px"
                      width="30px"
                      background="#dddddd"
                      style={{
                        position: "absolute",
                        content: "",
                        left: `calc(${proc}% - 12px)`,
                        bottom: "-6px",
                        border: "6px solid white",
                        boxShadow: "1px 2px 5px #c2d1cd",
                      }}
                      round="50%"
                    ></Box>
                    <Box
                      style={{
                        position: "absolute",
                        content: "",
                        left: `calc(${proc}% - 5px)`,
                        bottom: "-35px",
                      }}
                    >
                      <Text size="15px" weight={700} color="#414141">
                        {procMap[i]}%
                      </Text>
                    </Box>
                  </React.Fragment>
                );
              })}
            </Box>
            <Box height={"48px"} />
            <Text
              size="15px"
              style={{
                width: "600px",
              }}
              color="#414141"
            >
              <span
                style={{
                  textIndent: "30px",
                  marginBottom: "10px",
                  display: "inline-block",
                }}
              >
                There are 3 cycles of taxes starting from the time you buy:{" "}
              </span>
              <Box direction="row" margin={{ bottom: "4px" }}>
                <Box
                  style={{
                    display: "inline-flex",
                  }}
                  margin={{ left: "10px", right: "16px" }}
                  alignSelf="center"
                  // align="center"
                  // justify="center"
                >
                  <Box
                    background="#44d6ad"
                    width="6px"
                    height="6px"
                    round={"50%"}
                  ></Box>
                </Box>
                Cycle 1 (4 months)
              </Box>
              <span
                style={{
                  textIndent: "30px",
                  marginBottom: "10px",
                  display: "inline-block",
                }}
              >
                This starts when you buy with a tax of 15% reducing linearly to
                8%
              </span>
              <br />
              <Box direction="row" margin={{ bottom: "4px" }}>
                <Box
                  style={{
                    display: "inline-flex",
                  }}
                  margin={{ left: "10px", right: "16px" }}
                  alignSelf="center"
                  // align="center"
                  // justify="center"
                >
                  <Box
                    background="#44d6ad"
                    width="6px"
                    height="6px"
                    round={"50%"}
                  ></Box>
                </Box>
                Cycle 2 (4 months)
              </Box>
              <span
                style={{
                  textIndent: "30px",
                  marginBottom: "10px",
                  display: "inline-block",
                }}
              >
                Tax reduces linearly from 8 % to 3%
              </span>
              <br></br>
              <Box direction="row" margin={{ bottom: "4px" }}>
                <Box
                  style={{
                    display: "inline-flex",
                  }}
                  margin={{ left: "10px", right: "16px" }}
                  alignSelf="center"
                  // align="center"
                  // justify="center"
                >
                  <Box
                    background="#44d6ad"
                    width="6px"
                    height="6px"
                    round={"50%"}
                  ></Box>
                </Box>
                Cycle 3 (4 months)
              </Box>
              <span
                style={{
                  textIndent: "30px",
                  marginBottom: "10px",
                  display: "inline-block",
                }}
              >
                Tax reduces linearly from 3% to 0%
              </span>
              <br></br>
            </Text>
            <Box height="8px"></Box>
            <Box pad="8px 14px" background="#fff2da" round="12px" width="600px">
              <Text size="14px" textAlign="center">
                This tax system is designed to protect the community/investors
                from pump and dump schemes and also to eliminate taxes for long
                term investors
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  //   const library = new ethers.providers.JsonRpcProvider('')

  library.pollingInterval = 12000;
  return library;
}

function App() {
  const isMobileOrTablet = useMedia({ maxWidth: "1066px" });

  if (isMobileOrTablet) {
    return (
      <Box align="center" justify="center" height="100vh" pad="50px">
        <Text>
          Please use desktop PC or laptop chrome to access referral dashboard.
          Currently it does not support mobile devices. Mobile version is in
          progress now.
        </Text>
      </Box>
    );
  }

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
          <Router>
            <ApolloProvider client={nobotsClient}>
              <ModalsState>
                <ModalsCreatedApp />
                <ToastContainer position={"bottom-left"} />
                <Route exact path="/" component={TaxCycle} />
              </ModalsState>
            </ApolloProvider>
          </Router>
        </Grommet>
      </Web3ReactManager>
    </Web3ReactProvider>
  );
  // return <ModalsApp />;
}

export default App;
