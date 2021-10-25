import * as dateFns from "date-fns";
import { Box, Text } from "grommet";
import React, { useContext, useState } from "react";
import styled from "styled-components";
import { ThemeContext } from "./shared/theme";

const Input = styled.input`
  border: none;
  height: 38px;
  border-radius: 6px;
  font-size: 16px;

  padding: 0px 8px 0px 8px;
  text-align: center;
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

const NextMonth = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 15C0 6.71573 6.71573 0 15 0C23.2843 0 30 6.71573 30 15C30 23.2843 23.2843 30 15 30C6.71573 30 0 23.2843 0 15Z"
      fill="#5294FF"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M16.1031 21L11 15L16.1031 9L17 9.9186L12.6782 15L17 20.0814L16.1031 21Z"
      fill="white"
    />
  </svg>
);

const Calendar = ({
  days,
  onChangeDays,
}: {
  days: number;
  onChangeDays: (days: number) => void;
}) => {
  const now = new Date();

  const { theme } = useContext(ThemeContext);

  const isDark = theme === "dark";

  const dateFrom = now;
  const dateTo = dateFns.addDays(dateFrom, days);

  const [{ currentMonth }, setState] = useState({
    currentMonth: now,
    // dateFrom: now,
  });

  const onDateClick = (day: Date) => {
    console.log(day);

    if (Number(day) < Number(now)) {
      return;
    }

    const days = dateFns.differenceInDays(day, dateFns.startOfDay(now));

    console.log({
      days,
    });

    onChangeDays(days);
  };

  const nextMonth = () => {
    setState(prev => ({
      ...prev,
      currentMonth: dateFns.addMonths(prev.currentMonth, 1),
    }));
  };

  const prevMonth = () => {
    setState(prev => ({
      ...prev,
      currentMonth: dateFns.subMonths(prev.currentMonth, 1),
    }));
  };

  const renderHeader = () => {
    const dateFormat = "d MMMM yyyy";

    const dateTo = dateFns.addDays(dateFrom, days);

    // console.log({
    //   dateTo,
    //   sas:
    // });

    const [day, month, year] = dateFns.format(dateTo, dateFormat).split(" ");

    function bindKey(up: (up: boolean) => void) {
      return function checkKey(e: any) {
        const keyCode = e.keyCode;
        // 37 - left
        // 39 - right

        if (keyCode === 38) {
          // up arrow
          console.log("up");
          up(true);
        } else if (keyCode === 40) {
          // down arrow
          console.log("down");
          up(false);
        }
      };
    }

    return (
      <Box
        align="center"
        margin={{
          bottom: "10px",
        }}
        justify="center"
        height="50px"
        direction="row"
      >
        <Input
          value={day}
          onKeyDown={bindKey(up => {
            const value = dateFns.getDate(dateTo) + (up ? 1 : -1);

            if (value < 0 || value > 32) {
              return;
            }

            const newDate = dateFns.setDate(dateTo, value);

            onDateClick(newDate);
          })}
          style={{
            border: isDark ? "2px solid #707070" : "2px solid #c4c4c4",
            color: isDark ? "white" : "#29343E",
            width: "60px",
          }}
        />
        <Box width="7px"></Box>
        <Input
          value={month}
          onKeyDown={bindKey(up => {
            const value = dateFns.getMonth(dateTo) + (up ? 1 : -1);

            if (value < 0 || value > 32) {
              return;
            }

            const newDate = dateFns.setMonth(dateTo, value);

            onDateClick(newDate);
          })}
          style={{
            border: isDark ? "2px solid #707070" : "2px solid #c4c4c4",
            color: isDark ? "white" : "#29343E",
            width: "130px",
          }}
        />
        <Box width="7px"></Box>
        <Input
          value={year}
          onKeyDown={bindKey(up => {
            const value = dateFns.getYear(dateTo) + (up ? 1 : -1);

            if (value < dateFns.getYear(now) || value > 2042) {
              return;
            }
            const newDate = dateFns.setYear(dateTo, value);
            onDateClick(newDate);
          })}
          style={{
            border: isDark ? "2px solid #707070" : "2px solid #c4c4c4",
            color: isDark ? "white" : "#29343E",
            width: "60px",
          }}
        />
        {/* <Text>{dateFns.format(currentMonth, dateFormat)}</Text> */}
      </Box>
    );
  };

  const renderDays = () => {
    const dateFormat = "iiiiii";

    const startDate = dateFns.startOfWeek(currentMonth, {
      weekStartsOn: 1,
    });

    return (
      <>
        <Box direction="row" pad="0px 12px">
          {Array.from({ length: 7 }).map((item, i) => {
            return (
              <Box
                align="center"
                key={i}
                style={{
                  width: "36px",
                  ...(i === 5 || i === 6
                    ? {
                        color: "#EB5757",
                      }
                    : {}),
                }}
              >
                <Text size="14px">
                  {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
                </Text>
              </Box>
            );
          })}
        </Box>
        <Box
          height="1px"
          background={"#E5E7EB"}
          width="100%"
          margin="8px 0px"
        ></Box>
      </>
    );
  };

  const renderCells = () => {
    // const { currentMonth, dateFrom, dateTo } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = dateFns.endOfWeek(monthEnd);

    // const dateFormat = "dd";
    const dateFormat = "d";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    const now = Date.now();

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const startDay = dateFns.isSameDay(day, dateFrom);
        const endDay = dateFns.isSameDay(day, dateTo);

        formattedDate = dateFns.format(day, dateFormat);
        const cloneDay = day;

        const selected = dateFns.isWithinInterval(day, {
          start: dateFrom,
          end: dateTo,
        });

        // const disabled = !dateFns.isSameMonth(day, monthStart)
        const disabled = Number(day) < Number(now) - 86400 * 1000;

        days.push(
          <Box
            // className={` ${selected ? "selected" : ""}`}
            align="center"
            justify="center"
            style={{
              position: "relative",
              width: "36px",
              height: "36px",
              ...(disabled
                ? {
                    opacity: 0.3,
                    pointerEvents: "none",
                  }
                : {}),
              ...(selected
                ? {
                    background: isDark ? "#101E33" : "#E5E7EB",
                  }
                : {}),
              ...(startDay || endDay
                ? {
                    background: isDark ? "#101E33" : "#E5E7EB",
                    zIndex: 1,
                  }
                : {}),
              ...(startDay
                ? {
                    borderTopLeftRadius: "50%",
                    borderBottomLeftRadius: "50%",
                  }
                : {}),
              ...(endDay
                ? {
                    borderTopRightRadius: "50%",
                    borderBottomRightRadius: "50%",
                  }
                : {}),
            }}
            onClick={() =>
              // @ts-ignore
              console.log({
                cloneDay,
              }) || onDateClick(cloneDay)
            }
          >
            {(startDay || endDay) && (
              <Box
                style={{
                  position: "absolute",
                  content: "",
                  border: isDark
                    ? "1px solid rgb(82, 148, 255)"
                    : "1px solid #29343E",
                  borderRadius: "50%",
                  width: "100%",
                  height: "100%",
                  zIndex: -1,
                }}
              ></Box>
            )}
            <Text size="14px">{formattedDate}</Text>
          </Box>,
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(<Box direction="row">{days}</Box>);
      days = [];
    }

    return <Box pad="0px 12px">{rows}</Box>;
  };

  return (
    <Box
      direction="row"
      style={{
        userSelect: "none",
      }}
    >
      <Box
        style={{
          cursor: "pointer",
        }}
        alignSelf="center"
        onClick={prevMonth}
      >
        <NextMonth />
      </Box>
      <Box width="15px"></Box>
      <Box>
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </Box>
      <Box width="15px"></Box>
      <Box
        style={{
          transform: "rotate(180deg)",
          cursor: "pointer",
        }}
        alignSelf="center"
        onClick={nextMonth}
      >
        <NextMonth />
      </Box>
    </Box>
  );
};

export { Calendar };
