import type { SortOption } from "@/types";

interface SelectSortProps {
  sortOption: SortOption;
  setSortOption: (sortOption: SortOption) => void;
  myLocation: boolean;
}

export function SlectSort({
  sortOption,
  setSortOption,
  myLocation,
}: SelectSortProps) {
  return (
    <select
      value={sortOption}
      onChange={(e) => setSortOption(e.target.value as SortOption)}
      className="border-input text-muted-foreground bg-background focus-visible:ring-primary focus-within::outline-none h-9 w-20 rounded-md border px-3 py-1 text-sm transition-colors focus-visible:ring-1"
    >
      <option value="none">기본</option>
      <option value="name">이름순</option>
      {myLocation && <option value="distance">가까운순</option>}
    </select>
  );
}
