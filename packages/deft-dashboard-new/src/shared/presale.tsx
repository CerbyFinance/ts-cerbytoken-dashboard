import { useWeb3React } from "@web3-react/core";
import { createContext, useEffect, useState } from "react";
import { fetchPresaleList } from "./api";
import { PresaleItem } from "./api.d";

interface Filters {
  active: true | undefined;
  currentChain: number;
}

export const PresaleContext = createContext({
  isLoading: true,
  // items: [] as PresaleItem[],
  getItems: (isPresale: boolean) => [] as PresaleItem[],
  refetch: () => Promise.resolve(),
  filters: {} as Filters,
  setFilters: (input: Partial<Filters>) => {},
});

export const ALL_CHAINS_MAIN = 10101010;
export const ALL_CHAINS_TEST = 10101011;

// key consits of: address
interface ItemsMap {
  [key: string]: {
    isLoading: boolean;
    items: PresaleItem[];
  };
}

// TODO: differentiate between main + test items
export const PresaleProvider = ({ children }: { children: JSX.Element }) => {
  const { account, chainId } = useWeb3React();

  // const [isLoading, setIsLodaing] = useState(true);
  // const [items, setItems] = useState([] as PresaleItem[]);

  const [itemsMap, setItemsMap] = useState({} as ItemsMap);

  const key = account || "";

  const { isLoading, items = [] } = itemsMap[key] || {
    isLoading: true,
    items: [],
  };

  const [filters, setFilters] = useState({
    currentChain: ALL_CHAINS_TEST,
  } as Filters);

  const fire = async () => {
    setItemsMap(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        isLoading: true,
      },
    }));
    const results = await fetchPresaleList({
      walletAddress: account ? account : "",
      chains: [],
      page: 1,
      limit: 30,
    });
    if (results instanceof Error) {
      console.log(results);
    } else {
      setItemsMap(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          items: results,
        },
      }));
    }
    setItemsMap(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        isLoading: false,
      },
    }));
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      fire();
    }, 10000);

    fire();
    return () => clearInterval(interval);
  }, [account, chainId]);

  const filteredItems = (isPresale: boolean) =>
    items.filter(item => {
      const cond1 = filters.active
        ? (isPresale ? true : false) === item.presaleList.isActive
        : true;

      const cond2 =
        filters.currentChain === ALL_CHAINS_TEST ||
        filters.currentChain === ALL_CHAINS_MAIN
          ? true
          : filters.currentChain === item.chainId;

      return cond1 && cond2;
    });

  return (
    <PresaleContext.Provider
      value={{
        isLoading,
        // items: filteredItems,
        getItems: filteredItems,
        refetch: fire,
        setFilters: (next: Partial<Filters>) =>
          setFilters(prev => ({ ...prev, ...next })),
        filters,
      }}
    >
      {children}
    </PresaleContext.Provider>
  );
};
