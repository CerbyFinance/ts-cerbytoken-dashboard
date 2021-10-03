import { Box, Text } from "grommet";
import React, { useContext } from "react";
import styled from "styled-components";
import { HoveredElement } from "./shared/hooks";
import { ThemeContext } from "./shared/theme";

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

export const TransferStakesModal = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  return (
    <Box
      pad="30px 30px 33px"
      width="510px"
      round="10px"
      className="bg-white dark:bg-black"
      style={
        isDark
          ? {
              border: "1px solid #707070",
            }
          : {}
      }
    >
      <Text size="30px" color="text">
        Transfer 2 stakes
      </Text>
      <Box height="36px"></Box>
      <Box
        width="100%"
        pad="20px"
        background={isDark ? "#101E33" : "#E5E7EB"}
        round="5px"
      >
        <Box direction="row" align="center">
          <Box
            round="50%"
            height="12px"
            width="12px"
            background="#219653"
          ></Box>
          <Box width="10px"></Box>
          <Text size="14px">Completed: 1 Stake</Text>
        </Box>
        <Box height="10px"></Box>
        <Box direction="row" align="center">
          <Box
            round="50%"
            height="12px"
            width="12px"
            background="#F2994A"
          ></Box>
          <Box width="10px"></Box>
          <Text size="14px">In Progress: 1 Stake</Text>
        </Box>
        <Box height="15px"></Box>
        <Text size="16px" weight={500}>
          Total staked: 24,700.00 DEFT
        </Text>
      </Box>
      <Box height="23px"></Box>
      <Text size="14px" color="text">
        Address of the recipient
      </Text>
      <Box height="13px"></Box>
      <Input
        style={{
          border: isDark ? "2px solid #707070" : "2px solid #c4c4c4",
          color: isDark ? "white" : "#29343E",
        }}
      />
      <Box height="20px"></Box>
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
              {...binder.bind}
            >
              <Text size="14px" weight={500} color="white">
                Transfer
              </Text>
            </Box>
          )}
        ></HoveredElement>
      </Box>
    </Box>
  );
};
