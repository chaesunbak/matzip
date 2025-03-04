import { Container as MapDiv, NaverMap, useNavermaps } from "react-naver-maps";
import { useState } from "react";
import clsx from "clsx";
import { debounce } from "lodash";

import { usePlaces } from "@/hooks/use-places";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import type { Coordinates } from "@/types";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/types";
import { MyLocationControl } from "@/components/my-location-control";
import { MarkerClusterer } from "@/components/marker-clusterer";

function App() {
  const navermaps = useNavermaps();
  const [init, setInit] = useState(false);
  const { data = [], isPending, error } = usePlaces();
  const [myLocation, setMyLocation] = useState<Coordinates | null>(null);
  const [map, setMap] = useState<naver.maps.Map | null>(null);
  const [filters, setFilters] = useState<string[]>([]); // 카테고리 필터
  const [search, setSearch] = useState<string>(""); // 검색 필터
  const [zoom, setZoom] = useState<number>(15);
  const [bounds, setBounds] = useState<naver.maps.PointBounds | null>(null);

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
          search={search}
          setSearch={setSearch}
          setFilters={setFilters}
        />
        <MapDiv
          className="h-full w-full lg:w-[calc(100%-19.5rem)]" // 19.5rem = SIDEBAR_WIDTH
        >
          <NaverMap
            defaultCenter={
              new navermaps.LatLng(defaultCenter.lat, defaultCenter.lng)
            }
            defaultZoom={15}
            // @ts-expect-error: onInit 속성 실제로는 있으나 타입 누락됨 https://github.com/zeakd/react-naver-maps/issues/119
            onInit={() => {
              setInit(true);
            }}
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
            {/* 필터 버튼 */}
            <div className="scrollbar-none fixed top-[7px] right-[5px] z-20 flex max-w-[200px] gap-1 overflow-x-auto lg:max-w-[600px] lg:flex-wrap">
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
                      setFilters(
                        filters.filter((filter) => filter !== category),
                      );
                    } else {
                      setFilters([...filters, category]);
                    }
                  }}
                >
                  {category}
                </Button>
              ))}
            </div>
            {/* 데이터를 마커로 표시합니다. */}
            <MarkerClusterer
              places={filteredData}
              zoom={zoom}
              setSearch={setSearch}
              bounds={bounds}
            />
            {init && <MyLocationControl setMyLocation={setMyLocation} />}
          </NaverMap>
        </MapDiv>
      </main>
    </SidebarProvider>
  );
}

export default App;
