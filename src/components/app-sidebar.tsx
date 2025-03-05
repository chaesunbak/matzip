import { useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Drawer,
  DrawerHeader,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Place, Coordinates } from "@/types";
import { SearchInput } from "@/components/search-input";
import { AppLogo } from "@/components/app-logo";
import { SelectSort } from "@/components/select-sort";
import type { SortOption } from "@/types";
import { PlaceList } from "@/components/place-list";

interface AppSidebarProps {
  data: Place[];
  isPending: boolean;
  error: Error | null;
  myLocation: Coordinates | null;
  map: naver.maps.Map | null;
  search: string;
  setSearch: (search: string) => void;
  setFilters: (filters: string[]) => void;
}

// 모바일에서 사이드바 크기 조절 가능한 포인트
const snapPoints = ["180px", "340px", "510px", "670px", 1];

// 사이드바 컴포넌트
// 데스크탑에서는 사이드바 형태로 보여주고, 모바일에서는 드로어 형태로 보여줌
export function AppSidebar({
  data,
  isPending,
  error,
  myLocation,
  map,
  search,
  setSearch,
  setFilters,
}: AppSidebarProps) {
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);
  const [sortOption, setSortOption] = useState<SortOption>("none");
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer
        open={true}
        snapPoints={snapPoints}
        activeSnapPoint={snap}
        setActiveSnapPoint={setSnap}
        modal={false} // 모달 모드 비활성화
      >
        <DrawerContent className="h-full min-h-[180px] p-2">
          {" "}
          {/* min-height 설정 */}
          <DrawerHeader className="p-0">
            <AppLogo className="md:hidden" />
            <DrawerTitle className="flex gap-1 p-2">
              <SearchInput search={search} setSearch={setSearch} />
              <SelectSort
                sortOption={sortOption}
                setSortOption={setSortOption}
                myLocation={!!myLocation}
              />
            </DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
          <PlaceList
            data={data}
            isPending={isPending}
            error={error}
            myLocation={myLocation}
            map={map}
            setSearch={setSearch}
            setFilters={setFilters}
            sortOption={sortOption}
          />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sidebar>
      <SidebarHeader className="flex gap-2">
        <AppLogo />
        <SearchInput search={search} setSearch={setSearch} />
        <SelectSort
          sortOption={sortOption}
          setSortOption={setSortOption}
          myLocation={!!myLocation}
        />
      </SidebarHeader>
      <SidebarContent>
        <PlaceList
          data={data}
          isPending={isPending}
          error={error}
          myLocation={myLocation}
          map={map}
          setSearch={setSearch}
          setFilters={setFilters}
          sortOption={sortOption}
        />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
