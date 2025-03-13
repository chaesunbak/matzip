import { Container as MapDiv, NaverMap, useNavermaps } from "react-naver-maps";
import { useState } from "react";
import { debounce } from "lodash";
import { useSearchParams } from "react-router";

import { usePlaces } from "@/hooks/use-places";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import type { Coordinates } from "@/types";
import { MyLocationControl } from "@/components/my-location-control";
import { MarkerClusterer } from "@/components/marker-clusterer";
import { CategoryFilters } from "@/components/category-filters";

function App() {
  const navermaps = useNavermaps();
  const [searchParams] = useSearchParams();
  const { data = [], isPending, error } = usePlaces();
  const [myLocation, setMyLocation] = useState<Coordinates | null>(null);
  const [map, setMap] = useState<naver.maps.Map | null>(null);
  const [filters, setFilters] = useState<string[]>([]); // 카테고리 필터
  const [zoom, setZoom] = useState<number>(15);
  const [bounds, setBounds] = useState<naver.maps.PointBounds | null>(null);
  const [searchInput, setSearchInput] = useState<string>(""); // 검색 필터

  const search = searchParams.get("search") || ""; // 검색 필터

  const filteredData = data.filter((place) => {
    // 카테고리 필터링
    if (
      filters.length > 0 &&
      !filters.some((filter) => place.분류.includes(filter))
    ) {
      return false;
    }

    // 검색어 필터링
    if (search) {
      const searchLower = search.toLowerCase();
      const searchableFields = [
        place.이름,
        place.주소,
        place.분류,
        place.태그,
        place.매체,
      ];
      return searchableFields.some((field) =>
        field.toLowerCase().includes(searchLower),
      );
    }

    return true;
  });

  const defaultCenter: Coordinates = {
    lat: 37.3595704,
    lng: 127.105399,
  }; // 네이버 그린팩토리

  return (
    <SidebarProvider className="h-screen w-screen">
      <main className="flex h-full w-full">
        {/* 앱 사이드바에서 장소를 목록으로 표시합니다. */}
        <AppSidebar
          data={filteredData}
          isPending={isPending}
          error={error}
          myLocation={myLocation}
          map={map}
          setFilters={setFilters}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
        />
        {/* 19.5rem = SIDEBAR_WIDTH */}
        <MapDiv className="lg:w-[calc(100%-19.5rem) h-full w-full overflow-hidden">
          <div className="absolute top-0 left-0 z-20 mt-2 flex w-full justify-between gap-2 px-0 md:px-2">
            <MyLocationControl setMyLocation={setMyLocation} map={map} />
            {/* 필터 버튼 */}
            <CategoryFilters filters={filters} setFilters={setFilters} />
          </div>
          <NaverMap
            defaultCenter={
              new navermaps.LatLng(defaultCenter.lat, defaultCenter.lng)
            }
            defaultZoom={15}
            ref={setMap}
            onZoomChanged={(zoom) => {
              setZoom(zoom);
            }}
            logoControl={false} // NAVER 로고 컨트롤의 표시 여부
            mapDataControl={false} // 지도 데이터 컨트롤의 표시 여부
            onBoundsChanged={(bounds) => {
              debounce(() => {
                setBounds(bounds);
              }, 200)();
            }}
          >
            {/* 데이터를 마커로 표시합니다. */}
            <MarkerClusterer
              places={filteredData}
              zoom={zoom}
              bounds={bounds}
              setSearchInput={setSearchInput}
            />
          </NaverMap>
        </MapDiv>
      </main>
    </SidebarProvider>
  );
}

export default App;
