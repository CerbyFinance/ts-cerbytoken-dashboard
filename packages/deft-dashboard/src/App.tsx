import { ApolloProvider } from "@apollo/react-hooks";
import { BigNumber } from "@ethersproject/bignumber";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import { Box, Grommet, Text } from "grommet";
import "rc-dialog/assets/index.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { useMultiplierQuery, useUserReferrals2lvlQuery } from "./graphql/types";
import { ReferralsList } from "./ReferralsList";
import { nobotsClient } from "./shared/client";
import { HoveredElement } from "./shared/hooks";
import { ModalsCreatedApp, ModalsState } from "./shared/modals";
import { useDeftContract } from "./shared/useContract";
import Web3ReactManager from "./shared/Web3Manager";

const oneE18 = BigNumber.from("1000000000000000000");

function ReferrerRewards() {
  const { account, connector, error } = useWeb3React();

  const {
    data: data1,
    loading: loading1,
    error: error1,
  } = useUserReferrals2lvlQuery({
    variables: {
      address: account?.toLowerCase() || "",
    },
  });

  console.log({
    data1,
    loading1,
    error1,
  });

  const userReferrals = data1?.user?.referrals || [];

  const flattenRef1 = userReferrals.map(ref1 => {
    return {
      id: ref1.id,
      lvl: 1 as 1 | 2,
      createdAt: ref1.createdAt,
      referralsCount: ref1.referralsCount,
      reward: undefined,
      referrer: {
        id: ref1.referrer?.id,
        referralsCount: ref1.referrer?.referralsCount,
      },
    };
  });

  const flattenRef2 = userReferrals.flatMap(ref1 => {
    return ref1.referrals.map(ref2 => {
      return {
        id: ref2.id,
        lvl: 2 as 1 | 2,
        createdAt: ref2.createdAt,
        referralsCount: ref2.referralsCount,
        reward: undefined,
        referrer: {
          id: ref1.referrer?.id,
          referralsCount: ref1.referrer?.referralsCount,
        },
      };
    });
  });

  const referrals = [...flattenRef1, ...flattenRef2];
  const lvl1ReferralsCount = flattenRef1.length;
  const lvl2ReferralsCount = flattenRef2.length;
  const youReferredBy = data1?.user?.referrer?.id;

  console.log({
    referrals,
  });

  console.log({
    youReferredBy,
  });

  const deftContract = useDeftContract();

  const [mult, setMult] = useState<BigNumber | undefined>();

  const {
    data: data2,
    loading: loading2,
    error: error2,
  } = useMultiplierQuery();

  useEffect(() => {
    if (data2) {
      setMult(BigNumber.from(data2.multiplier?.value));
    }
  }, [data2]);

  const [mapRealAmounts, setMapRealAmounts] = useState<{
    [account: string]: number[];
  }>({});

  console.log({
    mapRealAmounts,
  });

  useEffect(() => {
    const fire = async (mult: BigNumber) => {
      const referralsIds = referrals.map(item => item.id);
      const lvls = referrals.map(item => item.lvl);

      console.log({
        referralsIds,
        account,
      });
      try {
        const result = await deftContract.getTemporaryReferralRealAmountsBulk(
          referralsIds,
        );

        const realAmounts = lvls.map((lvl, i) => {
          const item = result[i];
          const lvlDiv = BigNumber.from(lvl === 1 ? 100 : lvl === 2 ? 400 : 1);

          return Number(
            ethers.utils.formatEther(
              item.realBalance.mul(mult).div(oneE18).div(lvlDiv),
            ),
          );
        });

        setMapRealAmounts(prev => ({
          ...prev,
          [account!]: realAmounts,
        }));
      } catch (error) {
        console.log(error);
      }
    };

    if (referrals.length > 0 && mult) {
      fire(mult);
    }
  }, [userReferrals, mult]);

  const realAmounts = mapRealAmounts[account!] || [];

  const referralsWithAmounts = referrals.map((referral, i) => {
    const reward = realAmounts[i];
    return {
      ...referral,
      reward,
    };
  });

  return (
    <>
      <Box
        justify="center"
        align="center"
        style={{
          padding: "50px 0px",
          margin: "0 auto",
          width: "1008px",
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
                Referrals Network
              </Text>
              <Text size="16px" weight={400} color="#818181">
                Build your 2-level empire
              </Text>
            </Box>

            <Box
              margin={{
                left: "45px",
              }}
            >
              <HoveredElement
                render={binder => {
                  return (
                    <Box
                      {...binder.bind}
                      height="36px"
                      round="8px"
                      background={binder.hovered ? "#d1e0f5" : "#E8F1FE"}
                      align="center"
                      justify="center"
                      style={{
                        minWidth: "132px",
                        cursor: "pointer",
                        boxShadow:
                          "0px 1px 2px rgba(97, 97, 97, 0.2), 0px 2px 4px rgba(97, 97, 97, 0.2)",
                      }}
                      pad="0px 16px"
                      onClick={async () => {
                        try {
                        } catch (error) {
                          console.log(error);
                        }
                      }}
                    >
                      <Text
                        size="14px"
                        color={binder.hovered ? "#1672EC" : "#1672EC"}
                        style={{
                          letterSpacing: "0.05em",
                        }}
                        weight={600}
                      >
                        Get your ref link
                      </Text>
                    </Box>
                  );
                }}
              />
            </Box>
            <Box
              margin={{
                left: "auto",
              }}
            >
              {account ? (
                <Text size="14px" weight={600} color="#414141">
                  {account.slice(0, 8) +
                    "..." +
                    account.slice(account.length - 6, account.length)}
                </Text>
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
            </Box>
          </Box>
          {loading1 ? (
            <Box>
              <Text size="16px" color="#818181">
                Loading...
              </Text>
            </Box>
          ) : (
            <Box direction="row">
              <Box>
                {referrals.length === 0 && (
                  <Box>
                    <Text size="16px" color="#818181">
                      You don't have referrals
                    </Text>
                  </Box>
                )}
                {referrals.length > 0 && (
                  <ReferralsList items={referralsWithAmounts} />
                )}
              </Box>
              <Box
                margin={{
                  left: "auto",
                }}
                round="4px"
                alignSelf="start"
                width="234px"
                style={{
                  boxShadow: "0px 4px 8px rgba(97, 97, 97, 0.14)",
                  background: "white",
                }}
                pad="16px 20px"
              >
                <Box>
                  <Text size="14px" color="#616161" weight={600}>
                    1 lvl referrals count
                  </Text>
                  <Box height="4px" />
                  <Text color="#2AB930" size="24px" weight={500}>
                    {lvl1ReferralsCount}
                  </Text>
                  <Box height="4px" />
                </Box>
                <Box background="#E0E0E0" height="1px" />
                <Box>
                  <Box height="8px" />
                  <Text size="14px" color="#616161" weight={600}>
                    2 lvl referrals count
                  </Text>
                  <Box height="4px" />
                  <Text color="#1672EC" size="24px" weight={500}>
                    {lvl2ReferralsCount}
                  </Text>
                  <Box height="4px" />
                </Box>
                <Box background="#E0E0E0" height="1px" />
                <Box>
                  <Box height="8px" />
                  <Text size="14px" color="#616161" weight={600}>
                    You were reffered by
                  </Text>
                  <Box height="4px" />
                  <Text color="#414141" size="24px" weight={500}>
                    {youReferredBy ? youReferredBy.slice(0, 11) + "..." : "-"}
                  </Text>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
        {/* <Box width="100%" direction="row" wrap={true} justify="center">
      
      </Box> */}
      </Box>
    </>
  );
}

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
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
          <Router>
            <ApolloProvider client={nobotsClient}>
              <ModalsState>
                <ModalsCreatedApp />
                <ToastContainer position={"bottom-left"} />

                <Route exact path="/" component={ReferrerRewards} />
                {/* <Route exact path="/hello" ={HelloApp} />
                <Route exact path="/modals" component={ModalsAppDemo} /> */}
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
