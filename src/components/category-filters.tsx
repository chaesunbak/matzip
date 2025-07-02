import clsx from "clsx";

import { CATEGORIES } from "@/types";
import { Button } from "@/components/ui/button";

export function CategoryFilters({
  filters,
  setFilters,
}: {
  filters: string[];
  setFilters: (filters: string[]) => void;
}) {
  return (
    <div className="scrollbar-none flex max-w-[200px] gap-1 overflow-x-auto md:max-w-[600px] md:flex-wrap">
      {CATEGORIES.map((category) => (
        <Button
          key={category}
          variant="outline"
          className={clsx("", {
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground":
              filters.includes(category),
          })}
          onClick={() => {
            if (filters.includes(category)) {
              setFilters(filters.filter((filter) => filter !== category));
            } else {
              setFilters([...filters, category]);
            }
          }}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
