import { useWeb3React } from "@web3-react/core";
import dayjs from "dayjs";
import { serializeError } from "eth-rpc-errors";
import { ethers } from "ethers";
import { Box, Text } from "grommet";
import Tooltip from "rc-tooltip";
import React, { useContext, useEffect, useState } from "react";
import Loader from "react-loader-spinner";
import { toast } from "react-toastify";
import styled from "styled-components";
import {
  StakesDocument,
  StakesQuery,
  StakesQueryVariables,
} from "./graphql/types";
import { stakingClient } from "./shared/client";
import { HoveredElement } from "./shared/hooks";
import { ModalsContext } from "./shared/modals";
import { SnapshotsInterest } from "./shared/snaphots-interest";
import { ThemeContext } from "./shared/theme";
import { useStakingContract, useTokenContract } from "./shared/useContract";
import { _isFinite } from "./shared/utils";
import {
  APY_DENORM,
  CONTROLLED_APY,
  DAYS_IN_ONE_YEAR,
  deftShortCurrency,
  getCurrentDay,
  getSharesCountByStake,
  MAXIMUM_SMALLER_PAYS_BETTER,
  MINIMUM_SMALLER_PAYS_BETTER,
  SMALLER_PAYS_BETTER_BONUS,
} from "./staking-system";

const Input = styled.input`
  border: none;
  height: 50px;
  border-radius: 6px;
  font-size: 16px;

  padding: 0px 15px 0px 15px;
  outline: none;

  background: transparent;

  /* background: #f6f2e9; */

  &::placeholder {
    color: #c1c1c1;
  }

  &:active,
  &:focus {
    border: 2px solid #5294ff !important;
  }

  transition: none;
`;
//
const Input2 = styled.input`
  background: transparent;
  & {
    height: 36px;
    -webkit-appearance: none;
    margin: 10px 0;
    width: 100%;
  }
  &:focus {
    outline: none;
  }
  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 10px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 0px 0px 0px #000000;
    background: #e5e7eb;
    border-radius: 5px;
    border: 0px solid #000000;
  }
  &::-webkit-slider-thumb {
    box-shadow: 0px 0px 0px #000000;
    border: 0px solid #000000;
    height: 30px;
    width: 30px;
    border-radius: 48px;
    background: #5294ff;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -10px;
  }

  &::-ms-thumb {
    margin-top: 1px;
    box-shadow: 0px 0px 0px #000000;
    border: 0px solid #000000;
    height: 30px;
    width: 30px;
    border-radius: 48px;
    background: #5294ff;
    cursor: pointer;
  }
`;

const ArrowUp = ({ color }: { color: string }) => (
  <svg
    width="33"
    height="21"
    viewBox="0 0 33 21"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M16.5 0L32.5215 20.25H0.478531L16.5 0Z" />
  </svg>
);

{
  /* <Box>
<Grommet
  theme={{
    global: {
      size: {
        medium: "220px",
      },
    },
    calendar: {
      heading: {
        level: "14px",
      },
      medium: {
        daySize: "30px",
      },
    },
  }}
>
  <Calendar
    size="medium"
    date={undefined}
    dates={["2019-11-12", "2019-11-17"]}
  />
</Grommet>
</Box> */
}

const TooltipCalendar = ({
  isDark,
  onClick: _onClick,
}: {
  isDark: boolean;
  onClick: (days: number) => void;
}) => {
  const [visible, onVisibleChange] = useState(false);

  const onClick = (days: number) => {
    _onClick(days);
    onVisibleChange(false);
  };

  return (
    <Tooltip
      visible={visible}
      onVisibleChange={v => onVisibleChange(v)}
      placement="bottom"
      trigger={["click"]}
      align={{
        offset: [0, 20],
      }}
      overlay={
        <Box
          style={{
            position: "relative",
            boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.07)",
          }}
          align="center"
        >
          <Box
            style={{
              position: "absolute",
              top: "-13px",
            }}
          >
            <ArrowUp color={isDark ? "black" : "white"} />
          </Box>
          <Box
            background={isDark ? "black" : "white"}
            style={
              isDark
                ? {
                    border: "1px solid #707070",
                  }
                : {}
            }
            width="190px"
            pad="20px 20px 23px"
            round="5px"
            // alignSelf="start"
            align="start"
          >
            <Text
              size="16px"
              style={{
                cursor: "pointer",
              }}
              onClick={() => onClick(30)}
            >
              1 month
            </Text>
            <Box height="20px"></Box>
            <Text
              size="16px"
              // weight={600}
              style={{
                cursor: "pointer",
              }}
              onClick={() => onClick(180)}
            >
              6 months
            </Text>
            <Box height="20px"></Box>
            <Text
              size="16px"
              style={{
                cursor: "pointer",
              }}
              onClick={() => onClick(365)}
            >
              1 years
            </Text>
            <Box height="20px"></Box>
            <Text
              size="16px"
              style={{
                cursor: "pointer",
              }}
              onClick={() => onClick(365 * 2)}
            >
              2 years
            </Text>
            <Box height="20px"></Box>
            <Text
              size="16px"
              style={{
                cursor: "pointer",
              }}
              onClick={() => onClick(365 * 5)}
            >
              5 years
            </Text>
            <Box height="20px"></Box>
            <Text
              size="16px"
              style={{
                cursor: "pointer",
              }}
              onClick={() => onClick(365 * 10)}
            >
              10 years
            </Text>
            <Box height="20px"></Box>
            <Text
              size="16px"
              style={{
                cursor: "pointer",
              }}
            >
              Choose period
            </Text>
            <Box height="20px"></Box>

            <HoveredElement
              render={binder => (
                <Box
                  height="36px"
                  align="center"
                  pad="0px 18px"
                  justify="center"
                  round="5px"
                  style={{
                    cursor: "pointer",
                  }}
                  background={
                    binder.hovered
                      ? "linear-gradient(91.86deg, #71A7FF 0%, #1F67DB 100%)"
                      : "#5294FF"
                  }
                  onClick={() => {}}
                  {...binder.bind}
                >
                  <Text size="14px" weight={500} color="white">
                    Continue
                  </Text>
                </Box>
              )}
            ></HoveredElement>
          </Box>
        </Box>
      }
      // overlay={<Overlay>{overlayContent} </Overlay>}
    >
      <div>
        <CalendarIcon stroke={isDark ? "white" : "#29343E"} />
      </div>
    </Tooltip>
  );
};

const CalendarIcon = ({ stroke }: { stroke: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M16 2V6"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M8 2V6"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M3 10H21"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

function dateEndOfStake(a: number) {
  const nowDate = new Date(Date.now());
  const newDate = nowDate.setDate(nowDate.getDate() + Number(a));

  return dayjs(newDate).format("DD-MM-YYYY HH:mm A");
}

export const CreateStakeModal = () => {
  const { theme } = useContext(ThemeContext);

  const { dailySnapshots } = useContext(SnapshotsInterest);

  const sharePrice =
    dailySnapshots.length > 0
      ? dailySnapshots[dailySnapshots.length - 1].sharePrice
      : 0;

  const stakingContract = useStakingContract();

  const { closeModal } = useContext(ModalsContext);
  const isDark = theme === "dark";

  const { account, chainId } = useWeb3React();

  const [balance, setBalance] = useState(0);
  const [stakeDays, setStakeDays] = useState(100);
  const changeStakeDays = (evt: any) => {
    if (Number(evt.target.value) < 0) {
      return;
    }
    setStakeDays(Number(evt.target.value));
  };

  const tokenContract = useTokenContract();

  const [stakeAmount, setStakeAmount] = useState("");
  const changeStakeAmountHandler = (evt: any) => {
    if (Number(evt.target.value) > balance) {
      return;
    }
    setStakeAmount(evt.target.value);
  };

  const diff = Math.floor(
    (1 - Math.abs(balance - Number(stakeAmount)) / balance) * 100,
  );

  const [loader, setLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const refetchBalance = async () => {
    try {
      const balance = await tokenContract.balanceOf(account!);

      setBalance(Math.floor(Number(ethers.utils.formatEther(balance))));
      console.log({
        balance: ethers.utils.formatEther(balance),
      });
    } catch (error) {
      setBalance(0);
      console.log(error);
    }
  };

  const createStake = async () => {
    setErrorMessage("");

    try {
      setLoader(true);

      const result = await stakingContract.startStake({
        lockedForXDays: stakeDays,
        stakedAmount: ethers.utils.parseEther(stakeAmount),
      });
      const result2 = await result.wait();

      setLoader(false);

      if (result2.status === 1) {
        toast.success("Transaction successful");
        closeModal();
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

      // if (resultQuery.data.proofs[0]) {
      //   proof = resultQuery.data.proofs[0];
      //   break;
      // }

      console.log(result2.status);
    } catch (error) {
      setLoader(false);
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
    } finally {
      refetchBalance();
    }
  };

  useEffect(() => {
    refetchBalance();
  }, [account, chainId]);

  let longerMult = 0.0006849;

  if (stakeDays >= 365 * 10) {
    longerMult = 2.5;
  } else if (stakeDays >= 365) {
    longerMult = 0.5;
  }

  const longerPaysBetter =
    (Number(stakeAmount) * longerMult * stakeDays) / (DAYS_IN_ONE_YEAR * 10);

  const stakeSharesCount = getSharesCountByStake(
    dailySnapshots,
    {
      lockedForXDays: stakeDays,
      stakedAmount: Number(stakeAmount),
      startDay: getCurrentDay(),
    },
    0,
  );

  const stakeSharesCountMax = getSharesCountByStake(
    dailySnapshots,
    {
      lockedForXDays: DAYS_IN_ONE_YEAR * 10,
      stakedAmount: Number(MAXIMUM_SMALLER_PAYS_BETTER),
      startDay: getCurrentDay(),
    },
    0,
  );

  const minApy =
    ((CONTROLLED_APY / APY_DENORM) *
      100 *
      stakeSharesCount *
      MAXIMUM_SMALLER_PAYS_BETTER) /
    (stakeSharesCountMax * Number(stakeAmount));

  let multiplier = 0;
  if (Number(stakeAmount) <= MINIMUM_SMALLER_PAYS_BETTER) {
    multiplier = SMALLER_PAYS_BETTER_BONUS / APY_DENORM; /* 25% */
  } else if (Number(stakeAmount) >= MAXIMUM_SMALLER_PAYS_BETTER) {
    multiplier = 0;
  } else if (
    MINIMUM_SMALLER_PAYS_BETTER < Number(stakeAmount) &&
    Number(stakeAmount) < MAXIMUM_SMALLER_PAYS_BETTER
  ) {
    multiplier =
      (SMALLER_PAYS_BETTER_BONUS *
        (MAXIMUM_SMALLER_PAYS_BETTER - Number(stakeAmount))) /
      (APY_DENORM *
        (MAXIMUM_SMALLER_PAYS_BETTER - MINIMUM_SMALLER_PAYS_BETTER));
    /* 25% - 0% */
  }

  const smallerPaysBetter =
    (Number(stakeAmount) + longerPaysBetter) * multiplier;

  const effectiveDeft =
    Number(stakeAmount) + longerPaysBetter + smallerPaysBetter;

  const stakeShare = effectiveDeft / sharePrice;

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
        Create Stake
      </Text>
      <Box height="36px"></Box>
      <Box direction="row" justify="between">
        <Text size="14px" color="text">
          Stake Amount in DEFT
        </Text>

        <Text size="14px" color="#C4C4C4">
          {balance.asCurrency(2)} DEFT available
        </Text>
      </Box>
      <Box height="13px"></Box>
      <Input
        style={{
          border: isDark ? "2px solid #707070" : "2px solid #c4c4c4",
          color: isDark ? "white" : "#29343E",
        }}
        onChange={changeStakeAmountHandler}
        value={stakeAmount}
        onKeyPress={e => {
          if (
            _isFinite(Number(e.key)) ||
            (e.key === "." && !stakeAmount.includes("."))
          ) {
          } else {
            e.preventDefault();
          }
        }}
      />

      <Box
        direction="row"
        align="center"
        style={{
          position: "relative",
        }}
      >
        <Input2
          type="range"
          min={0}
          max={100}
          value={diff}
          onChange={e =>
            setStakeAmount(
              (balance * (Number(e.target.value) / 100)).toFixed(2),
            )
          }
        />

        <Box width="8px"></Box>
        <Text
          size="16px"
          weight={500}
          color="#5294FF"
          style={{
            width: "35px",
          }}
        >
          {diff}%
        </Text>
      </Box>
      <Box height="23px"></Box>

      <Box direction="row" align="center" justify="between">
        <Text size="14px" color="text">
          Stake length in days
        </Text>

        <Box
          style={{
            position: "relative",
          }}
          align="center"
          direction="row"
        >
          <Input
            style={{
              border: isDark ? "2px solid #707070" : "2px solid #c4c4c4",
              color: isDark ? "white" : "#29343E",
              width: "200px",
            }}
            value={stakeDays}
            onChange={changeStakeDays}
            onKeyPress={e => {
              if (_isFinite(Number(e.key))) {
              } else {
                e.preventDefault();
              }
            }}
          />
          <Box
            style={{
              position: "absolute",
              right: "12px",
              cursor: "pointer",
            }}
          >
            <TooltipCalendar
              isDark={isDark}
              onClick={days => setStakeDays(days)}
            />
          </Box>
        </Box>
      </Box>
      <Box height="15px"></Box>
      <Box background={isDark ? "#101E33" : "#E5E7EB"} round="10px" pad="20px">
        <Text size="16px">Stake Bonuses</Text>
        <Box height="23px"></Box>
        <Box
          direction="row"
          justify="between"
          margin={{
            bottom: "13px",
          }}
        >
          <Text size="14px">Longer pays better</Text>
          <Text size="14px" weight={500}>
            +{longerPaysBetter.asCurrency(2)} DEFT
          </Text>
        </Box>
        <Box
          direction="row"
          justify="between"
          margin={{
            bottom: "13px",
          }}
        >
          <Text size="14px">Smaller pays better</Text>
          <Text size="14px" weight={500}>
            +{smallerPaysBetter.asCurrency(2)} DEFT
          </Text>
        </Box>
        <Box
          direction="row"
          justify="between"
          margin={{
            bottom: "13px",
          }}
        >
          <Text size="14px">Effective DEFT:</Text>
          <Text size="14px" weight={500}>
            {effectiveDeft.asCurrency(2)} DEFT
          </Text>
        </Box>
        <Box
          direction="row"
          justify="between"
          margin={{
            bottom: "13px",
          }}
        >
          <Text size="14px">Share Price:</Text>
          <Text size="14px" weight={500}>
            {sharePrice.asCurrency(2)} DEFT / Share
          </Text>
        </Box>
        <Box
          direction="row"
          justify="between"
          margin={{
            bottom: "13px",
          }}
        >
          <Text size="14px">Stake Shares:</Text>
          <Text size="14px" weight={500}>
            {deftShortCurrency(stakeShare, "Shares")}
          </Text>
        </Box>
        <Box
          direction="row"
          justify="between"
          margin={{
            bottom: "13px",
          }}
        >
          <Text size="14px">Min APY:</Text>
          <Text size="14px" weight={500}>
            {(minApy || 0).toFixed(2)} %
          </Text>
        </Box>
        <Box direction="row" justify="between">
          <Text size="14px">Date end of stake</Text>
          <Text size="14px" weight={500}>
            {dateEndOfStake(stakeDays)}
          </Text>
        </Box>
      </Box>

      <Box height={"10px"}></Box>
      {errorMessage && (
        <Box align="center" height="30px" justify="center">
          <Text size="14px" color={"#FF5252"}>
            {errorMessage}
          </Text>
        </Box>
      )}
      <Box height={"10px"}></Box>
      {/* <Box height="20px"></Box> */}
      <Box direction="row" justify="between">
        <HoveredElement
          render={binder => (
            <Box
              pad="9px 18px 8px"
              background={
                binder.hovered
                  ? "linear-gradient(133.2deg, #FF5252 0%, #E83838 54.74%, #D62424 97.05%)"
                  : "transparent"
              }
              round="5px"
              style={{
                cursor: "pointer",
                border: "1px solid #FF5252",
              }}
              onClick={closeModal}
              {...binder.bind}
            >
              <Text
                size="14px"
                weight={500}
                color={binder.hovered ? "white" : "#FF5252"}
              >
                Cancel
              </Text>
            </Box>
          )}
        ></HoveredElement>
        <HoveredElement
          render={binder => (
            <Box
              height="36px"
              align="center"
              justify="center"
              round="5px"
              style={{
                cursor: "pointer",
              }}
              pad={"0px 18px"}
              background={
                binder.hovered
                  ? "linear-gradient(91.86deg, #71A7FF 0%, #1F67DB 100%)"
                  : "#5294FF"
              }
              onClick={() => {
                createStake();
              }}
              {...binder.bind}
            >
              {loader && <Loader type="ThreeDots" color="#fff" height={12} />}
              {!loader && (
                <Text size="14px" weight={500} color="white">
                  Create Stake
                </Text>
              )}
            </Box>
          )}
        ></HoveredElement>
      </Box>
    </Box>
  );
};
