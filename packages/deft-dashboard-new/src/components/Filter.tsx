import { useContext } from "react";
import BSCIcon from "../icons/BSCIcon";
import ETHIcon from "../icons/ETHIcon";
import PolygonIcon from "../icons/PolygonIcon";
import {
  ALL_CHAINS_MAIN,
  ALL_CHAINS_TEST,
  PresaleContext,
} from "../shared/presale";

const testChains = [
  { id: ALL_CHAINS_TEST, name: "All Chains", icon: () => <></> },
  {
    id: 42,
    icon: (active: boolean) => <ETHIcon className="h-4" active={active} />,
    name: "kETH",
  },
  {
    id: 3,
    icon: (active: boolean) => <ETHIcon className="h-4" active={active} />,
    name: "rETH",
  },
  {
    id: 97,
    icon: (active: boolean) => <BSCIcon className="h-4" active={active} />,
    name: "tBSC",
  },
  // {
  //   id: 80001,
  //   icon: (active: boolean) => <PolygonIcon className="h-4" active={active} />,
  //   name: "mPolygon",
  // },
];

const mainChains = [
  { id: ALL_CHAINS_MAIN, name: "All Chains", icon: () => <></> },
  {
    id: 1,
    icon: (active: boolean) => <ETHIcon className="h-4" active={active} />,
    name: "ETH",
  },
  {
    id: 56,
    icon: (active: boolean) => <BSCIcon className="h-4" active={active} />,
    name: "BSC",
  },
  {
    id: 137,
    icon: (active: boolean) => <PolygonIcon className="h-4" active={active} />,
    name: "Polygon",
  },
];

function Filter({ title }: { title: string }) {
  const {
    filters: { active, currentChain },
    setFilters,
  } = useContext(PresaleContext);

  return (
    <div className="mx-auto mt-5 text-xs text-gray-500 lg:px-0 sm:px-0 lg:max-w-screen-lg">
      <div className="hidden text-2xl font-semibold sm:block dark:text-white">
        {title}
      </div>
      <div className="flex flex-col-reverse sm:flex-row">
        <div className="flex justify-center p-1 m-auto space-x-0 bg-white border-2 rounded-md dark:border-gray-500 dark:bg-black sm:mr-5 w-min">
          <button
            type="button"
            key="active"
            className={`${
              active
                ? "bg-activetextbg  dark:bg-darksecondary text-activetext"
                : ""
            } w-20 px-3 h-9 py-2 font-medium transition-all duration-200 rounded-md md:text-sm dark:hover:bg-blue-900 dark:hover:text-blue-300 hover:bg-activetextbg hover:text-activetext `}
            onClick={() =>
              setFilters({
                active: true,
              })
            }
          >
            Active
          </button>
          <button
            type="button"
            key="all"
            className={`${
              !active
                ? "bg-activetextbg  dark:bg-darksecondary text-activetext"
                : ""
            } w-20 px-3 h-9 py-2 font-medium transition-all duration-200 rounded-md md:text-sm dark:hover:bg-blue-900 dark:hover:text-blue-300 hover:bg-activetextbg hover:text-activetext`}
            onClick={() =>
              setFilters({
                active: undefined,
              })
            }
          >
            All
          </button>
        </div>

        <div className="flex items-center justify-center flex-grow p-1 mx-auto mb-2 space-x-4 bg-white border-2 rounded-md dark:border-gray-500 dark:bg-black sm:justify-start sm:m-0">
          {testChains.map(({ icon, name, id }) => (
            <button
              type="button"
              key={name}
              className={`${
                currentChain === id
                  ? "border-b-4 border-activetext text-activetext rounded-b-none"
                  : ""
              } flex items-center justify-center px-3 py-2 space-x-2 h-9 font-medium transition-all duration-200 rounded-md md:text-sm dark:hover:bg-blue-900 dark:hover:text-blue-300 hover:bg-activetextbg hover:text-activetext `}
              onClick={() =>
                setFilters({
                  currentChain: id,
                })
              }
            >
              {icon(currentChain === id)}
              <span>{name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export { Filter };
