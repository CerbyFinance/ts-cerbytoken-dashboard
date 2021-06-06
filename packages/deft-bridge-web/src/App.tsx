import { Box, Grommet, Text } from "grommet";
import React from "react";
import AutosizeInput from "react-input-autosize";
import styled from "styled-components";
import { QuestionIcon } from "./Icons";

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

const BridgeWidgetProcess = () => {
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
        <Box height="51px" direction="row" align="center">
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
        </Box>
        {/*  */}
        <Box height="32px" pad="4px 0px 0px 26px">
          <Box height="26px" width="4px" round="2px" background="#E0E0E0"></Box>
        </Box>
        {/*  */}
        <Box height="51px" direction="row" align="center">
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
        </Box>
        {/*  */}
        <Box height="32px" pad="4px 0px 0px 26px">
          <Box height="26px" width="4px" round="2px" background="#E0E0E0"></Box>
        </Box>
        {/*  */}
        <Box height="51px" direction="row" align="center">
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
        </Box>
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

const BridgeWidget = () => {
  const [inputValue, setValue] = React.useState("");
  const [isPopular, setPopular] = React.useState(true);

  const changeHandler = (evt: any) => {
    setValue(evt.target.value);
  };

  console.log({
    inputValue,
  });

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
            12,312.00 DEFT
          </Text>
        </Box>
        <Box height="6px" />
        <Box direction="row" align="center">
          <Input
            // injectStyles={false}
            minWidth={30}
            placeholder="0.0"
            value={inputValue}
            onChange={changeHandler}
            // style={{
            //   width: `${inputWidth}px`,
            // }}
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
              ETH
            </Text>
          </Box>

          <EthereumLogo />
        </Box>
        <Box
          height="40px"
          width="40px"
          align="center"
          justify="center"
          style={{
            cursor: "pointer",
          }}
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
              BSC
            </Text>
          </Box>

          <BinanceLogo />
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
            <QuestionIcon />
          </Box>
          <Box
            margin={{
              left: "auto",
            }}
          ></Box>
          <Text size="14px" color="#414141" weight={700}>
            77 DEFT
          </Text>
        </Box>
      </Box>
      <Box
        width="100%"
        height="48px"
        round="8px"
        background="#2B86FF"
        align="center"
        justify="center"
        style={{
          cursor: "pointer",
          boxShadow:
            "0px 2px 4px rgba(15, 86, 179, 0.18), 0px 4px 8px rgba(15, 86, 179, 0.18)",
        }}
      >
        <Text
          size="16px"
          color="white"
          style={{
            letterSpacing: "0.05em",
          }}
          weight={600}
        >
          Transfer
        </Text>
      </Box>
    </Box>
  );
};

function App() {
  return (
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
      {" "}
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
  );
}

export default App;
