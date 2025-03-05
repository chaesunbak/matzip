import { useState, useRef, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { toast } from "sonner";

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
import YTLogo from "@/assets/yt_favicon_ringo2.png";
import NaverMapLogo from "@/assets/naver_map_favicon.png";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import { useWindowSize } from "@/hooks/use-window-size";
import { AppLogo } from "@/components/app-logo";

type SortOption = "none" | "name" | "distance";

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
const snapPoints = ["180px", "340px", "510px", "680px", 1];

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
  const { width } = useWindowSize();

  // 정렬된 데이터
  const sortedData = [...data].sort((a, b) => {
    if (sortOption === "none") return 0;
    if (sortOption === "name") {
      return a.이름.localeCompare(b.이름);
    } else {
      if (!myLocation) return 0;
      const distA = Math.sqrt(
        Math.pow(myLocation.lat - a.위도, 2) +
          Math.pow(myLocation.lng - a.경도, 2),
      );
      const distB = Math.sqrt(
        Math.pow(myLocation.lat - b.위도, 2) +
          Math.pow(myLocation.lng - b.경도, 2),
      );
      return distA - distB;
    }
  });

  // The scrollable element for your list
  const parentRef = useRef(null);

  // The virtualizer
  const virtualizer = useVirtualizer({
    count: sortedData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 84,
  });

  const items = virtualizer.getVirtualItems();

  // 레이아웃(너비)변경시 가상 목록 재측정
  useEffect(() => {
    virtualizer.measure();
  }, [virtualizer, width, parentRef]);

  const renderContent = () => {
    if (error) {
      return (
        <div className="flex h-40 flex-col items-center justify-center gap-2 p-4 text-center">
          <p className="text-destructive font-semibold">오류가 발생했습니다</p>
          <p className="text-muted-foreground text-sm">{error.message}</p>
        </div>
      );
    }

    if (isPending) {
      return (
        <div className="flex flex-col gap-3 divide-y p-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex w-full flex-col gap-2 p-2">
              <div className="flex items-center gap-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-5" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-44" />
              </div>
              <div className="flex items-center gap-1">
                <Skeleton className="h-4 w-12 rounded-full" />
                <Skeleton className="h-4 w-5 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (sortedData.length === 0) {
      return (
        <div className="text-muted-foreground flex h-40 flex-col items-center justify-center gap-2 text-sm">
          검색결과가 없습니다.
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch("");
              setFilters([]);
            }}
          >
            검색, 필터 초기화
          </Button>
        </div>
      );
    }

    return (
      <div
        ref={parentRef}
        className="h-full w-full overflow-y-auto"
        style={{
          contain: "strict",
        }}
      >
        <div
          className="relative"
          style={{
            height: virtualizer.getTotalSize(),
          }}
        >
          <ul
            className="absolute top-0 left-0 w-full divide-y p-1"
            style={{
              transform: `translateY(${items[0]?.start ?? 0}px)`,
            }}
          >
            {items.map((virtualRow) => {
              const place = sortedData[virtualRow.index];
              return (
                <li
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  className="flex w-full flex-col p-2"
                >
                  <div>
                    <h3
                      className="inline cursor-pointer font-bold hover:underline"
                      title="클릭하여 지도에서 보기"
                      onClick={() => {
                        if (map) {
                          map.morph(
                            new naver.maps.LatLng(place.위도, place.경도),
                            16,
                          );
                        }
                      }}
                    >
                      {place.이름}{" "}
                    </h3>
                    <div className="inline text-sm">{place.분류} </div>
                    {place.태그 && (
                      <span className="inline rounded-full bg-gray-200 px-1 py-0.5 text-xs">
                        {place.태그}
                      </span>
                    )}
                  </div>
                  <div>
                    {myLocation && (
                      <div className="inline text-sm text-slate-500">
                        {Math.ceil(
                          Math.sqrt(
                            Math.pow(myLocation.lat - place.위도, 2) +
                              Math.pow(myLocation.lng - place.경도, 2),
                          ) * 100,
                        )}
                        km{"  "}
                      </div>
                    )}
                    <div className="inline text-sm">
                      {place.주소}{" "}
                      <span
                        className="cursor-pointer text-blue-500"
                        onClick={() => {
                          try {
                            navigator.clipboard.writeText(place.주소);
                            toast.success("주소가 복사되었습니다.");
                          } catch (error) {
                            console.error(error);
                            toast.error("주소 복사에 실패했습니다.");
                          }
                        }}
                      >
                        복사
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {place.매체 && (
                      <span className="rounded-full bg-gray-200 px-1 py-0.5 text-xs">
                        {place.매체}
                      </span>
                    )}
                    {place["매체 URL"] && (
                      <span className="rounded-full bg-gray-200 px-[5px] py-[5px]">
                        <a
                          href={place["매체 URL"]}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="유튜브에서 보기"
                        >
                          <img
                            src={YTLogo}
                            alt="유튜브"
                            className="h-[10px] w-[14px]"
                          />
                        </a>
                      </span>
                    )}
                    {place["지도 URL"] && (
                      <span className="rounded-full bg-gray-200 px-[4px] py-[2px]">
                        <a
                          href={place["지도 URL"]}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="네이버 지도에서 보기"
                        >
                          <img
                            src={NaverMapLogo}
                            alt="네이버 지도"
                            className="h-[15px] w-[15px]"
                          />
                        </a>
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  };

  const renderSortButton = () => (
    <select
      value={sortOption}
      onChange={(e) => setSortOption(e.target.value as SortOption)}
      className="border-input text-muted-foreground bg-background focus:ring-primary h-9 w-20 rounded-md border px-3 py-1 text-sm transition-colors focus:ring-1 focus:outline-none"
    >
      <option value="none">기본</option>
      <option value="name">이름순</option>
      {myLocation && <option value="distance">가까운순</option>}
    </select>
  );

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
            <AppLogo />
            <DrawerTitle className="flex gap-2 p-2">
              <SearchInput search={search} setSearch={setSearch} />
              {renderSortButton()}
            </DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
          <div
            ref={parentRef}
            className="h-full w-full overflow-y-auto"
            style={{
              contain: "strict",
            }}
          >
            {renderContent()}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sidebar>
      <SidebarHeader className="flex gap-2">
        <AppLogo />
        <SearchInput search={search} setSearch={setSearch} />

        {renderSortButton()}
      </SidebarHeader>
      <SidebarContent>{renderContent()}</SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
