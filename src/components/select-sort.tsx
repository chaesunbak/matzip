import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { SortOption } from "@/types";

interface SelectSortProps {
  sortOption: SortOption;
  setSortOption: (sortOption: SortOption) => void;
  myLocation: boolean;
}

export function SelectSort({
  sortOption,
  setSortOption,
  myLocation,
}: SelectSortProps) {
  return (
    <Select value={sortOption} onValueChange={setSortOption}>
      <SelectTrigger className="w-25">
        <SelectValue placeholder="정렬" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="none">기본</SelectItem>
          <SelectItem value="name">이름순</SelectItem>
          {myLocation && <SelectItem value="distance">가까운순</SelectItem>}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
