import { useContext } from "react";
import { NavContext } from "../shared/nav";
import { PresaleContext } from "../shared/presale";
import { classNames } from "../shared/utils";
import PresaleCard from "./PresaleCard";
import { VestingCard } from "./VestingCard";

function Results({ isPresale }: { isPresale: boolean }) {
  const { isLoading, getItems } = useContext(PresaleContext);

  const { sidebar } = useContext(NavContext);

  const items = getItems(isPresale);

  const sortedItems = isPresale
    ? items
    : items
        .slice()
        .sort(
          (a, b) =>
            Number(a.presaleList.isActive) - Number(b.presaleList.isActive) ||
            b.createdAt - a.createdAt,
        );

  return (
    <div
      className={classNames(
        sidebar ? "lg:gap-2" : "lg:gap-3",
        "grid w-full grid-cols-1 xl:gap-5 gap-5 mx-auto mt-6 sm:px-5 lg:px-0 sm:grid-cols-2 sm:max-w-2xl lg:max-w-screen-lg mb-10",
      )}
    >
      {sortedItems.length > 0 ? (
        sortedItems.map(item => {
          if (isPresale) {
            return <PresaleCard {...item} />;
          }
          return <VestingCard {...item} />;
        })
      ) : isLoading ? (
        <div>Loading..</div>
      ) : (
        <div>No record Found</div>
      )}
    </div>
  );
}

export { Results };
