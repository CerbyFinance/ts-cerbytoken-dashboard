import { useApolloClient } from "@apollo/client";
import { useWeb3React } from "@web3-react/core";
import { serializeError } from "eth-rpc-errors";
import { ContractTransaction } from "ethers";
import { Box, Text } from "grommet";
import React, { useContext, useState } from "react";
import Loader from "react-loader-spinner";
import { toast } from "react-toastify";
import {
  StakesDocument,
  StakesQuery,
  StakesQueryVariables,
} from "./graphql/types";
import { HoveredElement } from "./shared/hooks";
import { ActiveTemplate, ScrapeOrEndStakesModalPayload } from "./shared/modals";
import { ThemeContext } from "./shared/theme";
import { useStakingContract } from "./shared/useContract";
import { deftShortCurrency } from "./staking-system";

const ChevronDown = ({ color }: { color: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 9L12 15L18 9"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const Item = ({
  status,
  isDark,
  open,
  template,
  setOpen,
  loader,
  loader2,
  action,
  action2,
}: {
  status: string;
  isDark: boolean;
  open: boolean;
  template: ActiveTemplate;
  loader: boolean;
  loader2?: boolean;
  action: () => {};
  action2?: () => {};
  setOpen: () => void;
}) => {
  const isCompleted = status === "completed";
  const color = isCompleted ? "#219653" : "#F2994A";
  return (
    <Box
      round="10px"
      style={
        isDark
          ? {
              background: "#101E33",
            }
          : {
              boxShadow: "0px 4px 5px rgba(0, 0, 0, 0.15)",
              border: "1px solid rgba(196, 196, 196, 0.3)",
            }
      }
      width="100%"
      direction="row"
      onClick={setOpen}
    >
      <Box
        background={color}
        width="10px"
        height="auto"
        round={{
          corner: "left",
          size: "10px",
        }}
      ></Box>
      <Box width="20px"></Box>
      <Box pad="20px 20px 22px 0px" width="100%">
        <Box direction="row" width="100%" justify="between" align="center">
          <Box>
            <Text color={color} weight={600} size="16px">
              {isCompleted ? "Completed" : "In progress"}
            </Text>
            <Box height="8px"></Box>
            <Text size="14px" color="#C4C4C4">
              {template.count} stakes
            </Text>
          </Box>

          <Box
            style={
              open
                ? {
                    transform: "rotate(180deg)",
                  }
                : {}
            }
          >
            <ChevronDown color={isDark ? "white" : "#29343E"} />
          </Box>
        </Box>
        {open && (
          <Box>
            <Box
              direction="row"
              align="center"
              margin={{
                top: "17px",
              }}
            >
              <Box
                width="100%"
                style={{
                  maxWidth: "283px",
                }}
              >
                <Box direction="row" justify="between">
                  <Text
                    size="12px"
                    style={{
                      lineHeight: "130%",
                    }}
                  >
                    Total Staked Amount:
                  </Text>

                  <Text
                    size="12px"
                    style={{
                      lineHeight: "130%",
                    }}
                  >
                    {deftShortCurrency(template.staked)}
                  </Text>
                </Box>
                <Box direction="row" justify="between">
                  <Text
                    size="12px"
                    style={{
                      lineHeight: "130%",
                    }}
                  >
                    Total Interest:
                  </Text>

                  <Text
                    size="12px"
                    style={{
                      lineHeight: "130%",
                    }}
                  >
                    {deftShortCurrency(template.interest)}
                  </Text>
                </Box>
                {isCompleted && (
                  <Box direction="row" justify="between">
                    <Text
                      size="12px"
                      style={{
                        lineHeight: "130%",
                      }}
                    >
                      Total Penalties:
                    </Text>

                    <Text
                      size="12px"
                      style={{
                        lineHeight: "130%",
                      }}
                    >
                      {deftShortCurrency(-template.penalty)}
                    </Text>
                  </Box>
                )}
                {!isCompleted && (
                  <Box direction="row" justify="between">
                    <Text
                      size="12px"
                      style={{
                        lineHeight: "130%",
                      }}
                    >
                      Total Shares decrease:
                    </Text>

                    <Text
                      size="12px"
                      style={{
                        lineHeight: "130%",
                      }}
                    >
                      {deftShortCurrency(template.tShares, "Shares")}
                    </Text>
                  </Box>
                )}
                <Box direction="row" justify="between">
                  <Text
                    size="12px"
                    style={{
                      lineHeight: "130%",
                    }}
                  >
                    Total Payout & APR:
                  </Text>

                  <Text
                    size="12px"
                    style={{
                      lineHeight: "130%",
                    }}
                  >
                    {isCompleted
                      ? deftShortCurrency(template.payout)
                      : deftShortCurrency(template.interest)}{" "}
                    (APR: {Math.floor(template.apy2)}%)
                  </Text>
                </Box>
              </Box>
              {/*  */}
              <Box width="9px"></Box>
              <HoveredElement
                render={binder => (
                  <Box
                    pad="9px 0px 8px"
                    width={"108px"}
                    background={
                      binder.hovered
                        ? "linear-gradient(96.34deg, #219653 0%, #08D660 100%)"
                        : "#219653"
                    }
                    round="5px"
                    style={{
                      cursor: "pointer",
                    }}
                    align="center"
                    onClick={e => {
                      e.stopPropagation();
                      action();
                    }}
                    {...binder.bind}
                  >
                    {loader && (
                      <Loader type="ThreeDots" color="#fff" height={12} />
                    )}

                    {!loader && (
                      <Text
                        size="14px"
                        weight={500}
                        color={binder.hovered ? "white" : "white"}
                      >
                        {isCompleted ? "End Stakes" : "Scrape Stakes"}
                      </Text>
                    )}
                  </Box>
                )}
              ></HoveredElement>
            </Box>
            {/* --- */}
            {!isCompleted && (
              <>
                <Box height="40px" align="center" direction="row">
                  <Box
                    height="1px"
                    width="100%"
                    background={isDark ? "rgba(255, 255, 255, 0.3)" : "#C4C4C4"}
                  ></Box>
                </Box>
                <Box direction="row" align="center">
                  <Box
                    width="100%"
                    style={{
                      maxWidth: "283px",
                    }}
                  >
                    <Box direction="row" justify="between">
                      <Text
                        size="12px"
                        style={{
                          lineHeight: "130%",
                        }}
                      >
                        Total Staked Amount:
                      </Text>

                      <Text
                        size="12px"
                        style={{
                          lineHeight: "130%",
                        }}
                      >
                        {deftShortCurrency(template.staked)}
                      </Text>
                    </Box>
                    <Box direction="row" justify="between">
                      <Text
                        size="12px"
                        style={{
                          lineHeight: "130%",
                        }}
                      >
                        Total Interest:
                      </Text>

                      <Text
                        size="12px"
                        style={{
                          lineHeight: "130%",
                        }}
                      >
                        {deftShortCurrency(template.interest)}
                      </Text>
                    </Box>
                    <Box direction="row" justify="between">
                      <Text
                        size="12px"
                        style={{
                          lineHeight: "130%",
                        }}
                      >
                        Total Penalties:
                      </Text>

                      <Text
                        size="12px"
                        style={{
                          lineHeight: "130%",
                        }}
                      >
                        {deftShortCurrency(-template.penalty)}
                      </Text>
                    </Box>
                    <Box direction="row" justify="between">
                      <Text
                        size="12px"
                        style={{
                          lineHeight: "130%",
                        }}
                      >
                        Total Payout & APR:
                      </Text>

                      <Text
                        size="12px"
                        style={{
                          lineHeight: "130%",
                        }}
                      >
                        {deftShortCurrency(template.payout)} (APR:{" "}
                        {Math.floor(template.apy)}%)
                      </Text>
                    </Box>
                  </Box>

                  {/*  */}
                  <Box width="9px"></Box>
                  <HoveredElement
                    render={binder => (
                      <Box
                        pad="9px 0px 8px"
                        width={"108px"}
                        background={
                          binder.hovered
                            ? "linear-gradient(96.34deg, #EB5757 0%, #BA2C2C 100%)"
                            : "#EB5757"
                        }
                        round="5px"
                        style={{
                          cursor: "pointer",
                        }}
                        align="center"
                        onClick={e => {
                          e.stopPropagation();
                          action2!();
                        }}
                        {...binder.bind}
                      >
                        {loader2 && (
                          <Loader type="ThreeDots" color="#fff" height={12} />
                        )}

                        {!loader2 && (
                          <Text
                            size="14px"
                            weight={500}
                            color={binder.hovered ? "white" : "white"}
                          >
                            {"End Stakes"}
                          </Text>
                        )}
                      </Box>
                    )}
                  ></HoveredElement>
                </Box>
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

type Action = "endCompleted" | "scrapeInProgress" | "endInProgress" | null;

export const ScrapeOrEndModal = ({
  completed,
  inProgress,
  successCb,
}: ScrapeOrEndStakesModalPayload) => {
  const { account, chainId } = useWeb3React();

  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

  const [loader, setLoader] = useState(null as Action);
  const [errorMessage, setErrorMessage] = useState("");

  const stakingContract = useStakingContract();

  const stakingClient = useApolloClient();

  const fireWith = async (
    action: Action,
    actionFn: () => Promise<ContractTransaction>,
  ) => {
    setErrorMessage("");

    try {
      setLoader(action);

      const result = await actionFn();
      const result2 = await result.wait();

      setLoader(null);

      if (result2.status === 1) {
        toast.success("Transaction successful");
        successCb();
      } else {
        toast.error("Transaction Canceled");
      }

      // TODO: update it locally ?client
      // TODO: may not fetch in time if subgraph outdated
      const resultQuery = await stakingClient.query<
        StakesQuery,
        StakesQueryVariables
      >({
        query: StakesDocument,
        variables: {
          address: account?.toLowerCase() || "",
        },
        fetchPolicy: "network-only",
      });

      console.log(result2.status);
    } catch (error) {
      setLoader(null);
      const serializedError = serializeError(error);
      const originalErrorMessage = (serializedError.data as any)?.originalError
        ?.error?.message;

      if (originalErrorMessage && originalErrorMessage.includes("SS: ")) {
        const message = originalErrorMessage.split("SS: ")[1];

        // @ts-ignore
        const readableError = message || "Unknown error";
        toast.error("Transaction failed");
        setErrorMessage(readableError);
      } else {
        setErrorMessage("Transaction Canceled");
      }
    }
  };

  return (
    <Box
      pad="30px 30px 33px"
      width="510px"
      round="10px"
      className="bg-white dark:bg-black"
      style={{
        ...(isDark
          ? {
              border: "1px solid #707070",
            }
          : {}),
        ...(loader
          ? {
              pointerEvents: "none",
            }
          : {}),
      }}
    >
      <Text size="30px" color="text">
        Selected {completed.count + inProgress.count} stakes
      </Text>
      <Box height="26px"></Box>
      {completed.count > 0 && (
        <Item
          isDark={isDark}
          template={completed}
          open={open1}
          setOpen={() => setOpen1(!open1)}
          status="completed"
          loader={loader === "endCompleted"}
          action={() =>
            fireWith("endCompleted", () => {
              return stakingContract.bulkEndStake(completed.ids);
            })
          }
        />
      )}
      {completed.count > 0 && inProgress.count > 0 && <Box height="15px"></Box>}
      {inProgress.count > 0 && (
        <Item
          template={inProgress}
          isDark={isDark}
          open={open2}
          setOpen={() => setOpen2(!open2)}
          status="in-progress"
          loader={loader === "scrapeInProgress"}
          loader2={loader === "endInProgress"}
          action={() =>
            fireWith("scrapeInProgress", () => {
              return stakingContract.bulkScrapeStake(inProgress.ids);
            })
          }
          action2={() =>
            fireWith("endInProgress", () => {
              return stakingContract.bulkEndStake(inProgress.ids);
            })
          }
        />
      )}
      {errorMessage && (
        <Box
          align="center"
          margin={{
            top: "15px",
          }}
          justify="center"
          style={{
            lineHeight: "100%",
          }}
        >
          <Text size="14px" color={"#FF5252"}>
            {errorMessage}
          </Text>
        </Box>
      )}
    </Box>
  );
};
