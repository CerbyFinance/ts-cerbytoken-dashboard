import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

function useURLQuery() {
  return new URLSearchParams(useLocation().search);
}

export const TEAM_REF_ADDRESS = "0x0000000000000000000000000000000000000000";

const findFirstRef = () => {
  const cookie = document.cookie
    .split(";")
    .map(item => item.trim().split("="))
    .filter(item => item.length > 0)
    .find(item => item[0] === "ref");
  return cookie && cookie.length === 2 ? cookie[1] : undefined;
};

const isAddress = (s: string) => {
  return s.startsWith("0x") && s.length === 42;
};

export const useReferrer = () => {
  const query = useURLQuery();
  const history = useHistory();

  const _referrer = query.get("ref") || findFirstRef() || "";
  const isValidAddress = isAddress(_referrer);

  useEffect(() => {
    if (isValidAddress) {
      document.cookie = `ref=${_referrer}`;
    }
  }, [_referrer, isValidAddress]);

  useEffect(() => {
    if (query.has("ref")) {
      query.delete("ref");
      history.replace({
        search: query.toString(),
      });
    }
  }, []);

  const referrer = isValidAddress ? _referrer : TEAM_REF_ADDRESS;

  return referrer;
};
