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
import React, { useContext, useEffect, useState } from "react";
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
import { CheckBox } from "./CheckBox";
import {
  useMultiplierQuery,
  UserReferrals2lvlDocument,
  useUserReferrals2lvlQuery,
} from "./graphql/types";
import {
  BecomeReferralIcon,
  LinkIcon,
  ReferralsIcon,
  TelegramIcon,
  TwitterIcon,
  YoutubeIcon,
} from "./icons";
import { Logo } from "./logo";
import { ReferralsList } from "./ReferralsList";
import { nobotsClient } from "./shared/client";
import { injected } from "./shared/connectors";
import { HoveredElement } from "./shared/hooks";
import { ModalsContext, ModalsCreatedApp, ModalsState } from "./shared/modals";
import { useDeftContract } from "./shared/useContract";
import Web3ReactManager from "./shared/Web3Manager";
import { txnToast } from "./toaster";

dayjs.extend(relativeTime);
dayjs.extend(isYesterday);
dayjs.extend(isToday);

const oneE18 = BigNumber.from("1000000000000000000");
// const DEPLOYED_CHAIN = 97;
const DEPLOYED_CHAIN = 42;

const BoxHoveredScale = styled(Box)`
  cursor: pointer;
  &:hover {
    transform: scale(1.1);
  }
`;

function LeftMenu() {
  const isBecome = useRouteMatch({
    path: "/become-referral",
    exact: true,
  });
  const isReferrals = useRouteMatch({
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
          height="40px"
          width="40px"
          align="center"
          justify="center"
          margin={{ right: "16px" }}
          style={
            isReferrals
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
            ...(isReferrals
              ? {
                  color: "#1672EC",
                  fontWeight: 600,
                }
              : { color: "#414141" }),
          }}
        >
          Referrals
        </Text>
      </Box>
      <Box
        height="40px"
        direction="row"
        align="center"
        onClick={() => history.push("/become-referral/")}
      >
        <Box
          height="40px"
          width="40px"
          align="center"
          justify="center"
          margin={{ right: "16px" }}
          style={
            isBecome
              ? {
                  color: "#1672EC",
                }
              : {}
          }
        >
          <BecomeReferralIcon />
        </Box>
        <Text
          weight={500}
          size="15px"
          color="#414141"
          style={{
            lineHeight: "150%",
            ...(isBecome
              ? {
                  color: "#1672EC",
                  fontWeight: 600,
                }
              : { color: "#414141" }),
          }}
        >
          Become referral
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

function ReferrerRewards() {
  const { account, activate, chainId, connector, error } = useWeb3React();

  console.log({
    account,
    chainId,
  });
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
          id: ref2.referrer?.id,
          referralsCount: ref2.referrer?.referralsCount,
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

  const [myBalance, setMyBalance] = useState<number | undefined>();
  const [mult, setMult] = useState<BigNumber | undefined>();
  const [withReward, setWithReward] = useState<boolean>(false);

  const handleSetWithReward = () => {
    setWithReward(!withReward);
  };

  const { showRefAddressModal } = useContext(ModalsContext);

  const {
    data: data2,
    loading: loading2,
    error: error2,
  } = useMultiplierQuery();

  useEffect(() => {
    if (data2 && data2.multiplier?.value) {
      setMult(BigNumber.from(data2.multiplier?.value));
    }
  }, [data2]);

  const refetchBalance = async (account: string) => {
    try {
      const balance = await deftContract.balanceOf(account!);

      setMyBalance(Number(ethers.utils.formatEther(balance)));
      console.log({
        balance: ethers.utils.formatEther(balance),
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (account) {
      refetchBalance(account);
    }
  }, [account]);

  const [mapRealAmounts, setMapRealAmounts] = useState<{
    [account: string]: {
      [wallet: string]: number;
    };
  }>({});

  const zeroAmounts = async (walletsToZero: string[], account: string) => {
    await refetchBalance(account);

    setMapRealAmounts(prev => ({
      ...prev,
      [account]: {
        ...prev[account],
        ...Object.fromEntries(walletsToZero.map(wallet => [wallet, 0])),
      },
    }));
  };

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

        const realAmounts = Object.fromEntries(
          lvls.map((lvl, i) => {
            const item = result[i];
            const referralId = referralsIds[i];
            const lvlDiv = BigNumber.from(
              lvl === 1 ? 100 : lvl === 2 ? 400 : 1,
            );

            return [
              referralId,
              Number(
                ethers.utils.formatEther(
                  item.realBalance.mul(mult).div(oneE18).div(lvlDiv),
                ),
              ),
            ];
          }),
        );

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

  const referralsWithAmounts = referrals.flatMap((referral, i) => {
    const reward = realAmounts[referral.id];

    const ok = (reward && withReward && reward > 0) || !withReward;

    return ok
      ? {
          ...referral,
          reward,
        }
      : [];
  });

  // isActive ?

  return (
    <Box
      direction="row"
      justify="center"
      // align="center"
      style={{
        // margin: "0 auto",
        width: "100%",
        padding: "50px 0px",
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
          minWidth: "976px",
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
                      onClick={() =>
                        showRefAddressModal({
                          address: account!,
                        })
                      }
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
              align="center"
              direction="row"
            >
              <>
                {account ? (
                  DEPLOYED_CHAIN === chainId ? (
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
          {loading1 ? (
            <Box>
              <Text size="16px" color="#818181">
                Loading...
              </Text>
            </Box>
          ) : (
            <Box direction="row">
              <Box>
                {referralsWithAmounts.length === 0 && (
                  <Box>
                    <Text size="16px" color="#818181">
                      You don't have referrals
                    </Text>
                  </Box>
                )}
                {referralsWithAmounts.length > 0 && (
                  <ReferralsList
                    items={referralsWithAmounts}
                    zeroAmounts={zeroAmounts}
                  />
                )}
              </Box>
              <Box
                margin={{
                  left: "auto",
                }}
                alignSelf="start"
              >
                <Box
                  round="4px"
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
                {/*  */}
                <Box height="16px" />
                <Box
                  direction="row"
                  align="center"
                  // justify="center"
                  pad={{
                    left: "16px",
                  }}
                  style={{
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                  onClick={() => handleSetWithReward()}
                >
                  <CheckBox active={withReward} onClick={() => {}} />
                  <Box width="10px" />
                  <Text size="13px" color="#3E3E3E">
                    {`referrals with reward`}
                  </Text>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

function useURLQuery() {
  return new URLSearchParams(useLocation().search);
}

const TEAM_REF_ADDRESS = "0x539FaA851D86781009EC30dF437D794bCd090c8F";

const findFirstRef = () => {
  const cookie = document.cookie
    .split(";")
    .map(item => item.trim().split("="))
    .filter(item => item.length > 0)
    .find(item => item[0] === "ref");
  return cookie && cookie.length === 2 ? cookie[1] : undefined;
};

function BecomeReferral() {
  const { account, activate, chainId, connector, error } = useWeb3React();
  const deftContract = useDeftContract();

  const query = useURLQuery();

  const _referrer = query.get("ref") || findFirstRef() || "";
  const isValidAddress = ethers.utils.isAddress(_referrer);

  useEffect(() => {
    if (isValidAddress) {
      document.cookie = `ref=${_referrer}`;
    }
  }, [_referrer]);

  const referrer = isValidAddress ? _referrer : TEAM_REF_ADDRESS;

  const [loader, setLoader] = useState(false);

  const {
    data: data1,
    loading: loading1,
    error: error1,
  } = useUserReferrals2lvlQuery({
    variables: {
      address: account?.toLowerCase() || "",
    },
    skip: !account,
  });

  const isMe = ethers.utils.isAddress(account || "");

  const hasReferrer = ethers.utils.isAddress(data1?.user?.referrer?.id || "");
  const hasReferrerAddress = data1?.user?.referrer?.id || "";

  console.log({
    hasReferrer,
    isMe,
    loading1,
  });

  const becomeReferral = async (referrer: string, account: string) => {
    try {
      setLoader(true);
      const result = await deftContract.registerReferral(referrer);

      txnToast(1, "pending", "Transaction Sent", result.hash);

      const result2 = await result.wait();

      // todo: maybe just update it locally ?
      await nobotsClient.query({
        query: UserReferrals2lvlDocument,
        variables: {
          address: account.toLowerCase(),
        },
        fetchPolicy: "network-only",
      });

      setLoader(false);

      if (result2.status === 1) {
        txnToast(
          1,
          "success",
          "Transaction Successful",
          result2.transactionHash,
        );
      } else {
        txnToast(1, "fail", "Transaction Failed", result2.transactionHash);
      }

      console.log(result2.status); // 1 = 0k, 0 = failure
    } catch (error) {
      setLoader(false);

      // transaction failed

      txnToast(1, "fail", "Transaction Failed");

      // if 4001 === user denied
      // TODO: show thorough error
      // console.log(error);
    }
  };

  return (
    <Box
      direction="row"
      justify="center"
      // align="center"
      style={{
        // margin: "0 auto",
        width: "100%",
        padding: "50px 0px",
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
          minWidth: "976px",
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
                Become Referral
              </Text>

              {hasReferrer ? (
                <Text size="16px" weight={400} color="#818181">
                  You were referred by{" "}
                  <Text size="14px" weight={600} color="#414141">
                    {hasReferrerAddress.slice(0, 8) +
                      "..." +
                      hasReferrerAddress.slice(
                        hasReferrerAddress.length - 6,
                        hasReferrerAddress.length,
                      )}
                  </Text>
                </Text>
              ) : !hasReferrer && isMe && !loading1 ? (
                <Text size="16px" weight={400} color="#818181">
                  You'll become referral for{" "}
                  <Text size="14px" weight={600} color="#414141">
                    {referrer.slice(0, 8) +
                      "..." +
                      referrer.slice(referrer.length - 6, referrer.length)}
                  </Text>
                </Text>
              ) : (
                <Text size="16px" weight={400} color="#818181">
                  ...
                </Text>
              )}
            </Box>

            <Box
              margin={{
                left: "auto",
              }}
            >
              {account ? (
                DEPLOYED_CHAIN === chainId ? (
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
            </Box>
          </Box>
          <Box align="center">
            <Text
              size="16px"
              color="#818181"
              style={{
                width: "700px",
                // textIndent: "40px",
              }}
              textAlign="center"
            >
              {hasReferrer ? (
                <>
                  You were referred by
                  <br />
                  <b>{hasReferrerAddress}</b> address.
                  <br />
                  Your current tax: 5%
                  <br />
                  Enjoy referral tax discount!
                </>
              ) : !hasReferrer && isMe && !loading1 ? (
                <>
                  Your current tax: 10%
                  <br />
                  Becoming a referral gives you 50% reduced tax (5% instead of
                  10% tax).
                  <br />
                  <br />
                  To become a referral of
                  <br />
                  <b>{referrer}</b> <br />
                  you will have to submit transaction on-chain using the button
                  below.
                </>
              ) : (
                <>...</>
              )}
            </Text>
            <Box height={"26px"} />
            {!hasReferrer && isMe && !loading1 && (
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
                        ...(loader
                          ? {
                              pointerEvents: "none",
                            }
                          : {}),
                      }}
                      pad="0px 16px"
                      onClick={() => becomeReferral(referrer, account || "")}
                    >
                      {loader && (
                        <div
                          className="loader"
                          style={{
                            borderTop: "4px solid #26436a",
                          }}
                        ></div>
                      )}

                      {!loader && (
                        <Text
                          size="14px"
                          color={binder.hovered ? "#1672EC" : "#1672EC"}
                          style={{
                            letterSpacing: "0.05em",
                          }}
                          weight={600}
                        >
                          Become referral
                        </Text>
                      )}
                    </Box>
                  );
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
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
                <Route
                  exact
                  path="/become-referral"
                  component={BecomeReferral}
                />
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
