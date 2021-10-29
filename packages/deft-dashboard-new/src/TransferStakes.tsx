import { useApolloClient } from "@apollo/client";
import { useWeb3React } from "@web3-react/core";
import { serializeError } from "eth-rpc-errors";
import { Box, Text } from "grommet";
import React, { useContext, useState } from "react";
import Loader from "react-loader-spinner";
import { toast } from "react-toastify";
import styled from "styled-components";
import {
  StakesDocument,
  StakesQuery,
  StakesQueryVariables,
} from "./graphql/types";
import { HoveredElement } from "./shared/hooks";
import { ModalsContext, TransferStakesModalPayload } from "./shared/modals";
import { ThemeContext } from "./shared/theme";
import { useStakingContract } from "./shared/useContract";

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

export const TransferStakesModal = ({
  completedCount,
  inProgressCount,
  stakeIds,
  totalStaked,
  successCb,
}: TransferStakesModalPayload) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const { account, chainId } = useWeb3React();

  const [newOwner, setNewOwner] = useState("");
  const changeNewOwnerHandler = (evt: any) => {
    setNewOwner(evt.target.value);
  };

  const { closeModal } = useContext(ModalsContext);

  const stakingContract = useStakingContract();
  const stakingClient = useApolloClient();

  const [loader, setLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const transferStakes = async () => {
    setErrorMessage("");

    try {
      setLoader(true);

      const result = await stakingContract.bulkTransferOwnership(
        stakeIds,
        newOwner,
      );
      const result2 = await result.wait();

      setLoader(false);

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
        Transfer {completedCount + inProgressCount} stakes
      </Text>
      <Box height="36px"></Box>
      <Box
        width="100%"
        pad="20px"
        background={isDark ? "#101E33" : "#E5E7EB"}
        round="5px"
      >
        {completedCount > 0 && (
          <Box direction="row" align="center">
            <Box
              round="50%"
              height="12px"
              width="12px"
              background="#219653"
            ></Box>
            <Box width="10px"></Box>
            <Text size="14px">Completed: {completedCount} Stakes</Text>
          </Box>
        )}
        {completedCount > 0 && inProgressCount > 0 && <Box height="10px"></Box>}
        {inProgressCount > 0 && (
          <Box direction="row" align="center">
            <Box
              round="50%"
              height="12px"
              width="12px"
              background="#F2994A"
            ></Box>
            <Box width="10px"></Box>
            <Text size="14px">In Progress: {inProgressCount} Stake</Text>
          </Box>
        )}
        <Box height="15px"></Box>
        <Text size="16px" weight={500}>
          Total staked: {totalStaked.asCurrency(2)} DEFT
        </Text>
      </Box>
      <Box height="23px"></Box>
      <Text size="14px" color="text">
        Address of the recipient
      </Text>
      <Box height="13px"></Box>
      <Input
        onChange={changeNewOwnerHandler}
        style={{
          border: isDark ? "2px solid #707070" : "2px solid #c4c4c4",
          color: isDark ? "white" : "#29343E",
        }}
      />
      <Box height={"10px"}></Box>
      {errorMessage && (
        <Box align="center" height="30px" justify="center">
          <Text size="14px" color={"#FF5252"}>
            {errorMessage}
          </Text>
        </Box>
      )}
      <Box height={"10px"}></Box>{" "}
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
              pad="9px 18px 8px"
              background={
                binder.hovered
                  ? "linear-gradient(133.2deg, #BD29E9 0%, #782AFF 97.05%)"
                  : "linear-gradient(133.2deg, #782AFF 0%, #BD29E9 97.05%)"
              }
              round="5px"
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                transferStakes();
              }}
              {...binder.bind}
            >
              {loader && <Loader type="ThreeDots" color="#fff" height={12} />}
              {!loader && (
                <Text size="14px" weight={500} color="white">
                  Transfer
                </Text>
              )}
            </Box>
          )}
        ></HoveredElement>
      </Box>
    </Box>
  );
};
