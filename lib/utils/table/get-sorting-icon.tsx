import {
  RiArrowDownSFill,
  RiArrowUpSFill,
  RiExpandUpDownFill,
} from "@remixicon/react";

export function getSortingIcon(state: "asc" | "desc" | false) {
  if (state === "asc") {
    return <RiArrowUpSFill className="size-5 text-text-sub-600" />;
  }

  if (state === "desc") {
    return <RiArrowDownSFill className="size-5 text-text-sub-600" />;
  }

  return <RiExpandUpDownFill className="size-5 text-text-sub-600" />;
}
