import { Container as MapDiv, NaverMap, useNavermaps } from "react-naver-maps";
import { useState, memo } from "react";
import { useDebounceCallback } from "usehooks-ts";

import type { Coordinates, Place } from "@/types";
import { MyLocationControl } from "@/components/my-location-control";
import { MarkerClusterer } from "@/components/marker-clusterer";
import { CategoryFilters } from "@/components/category-filters";
import { DEFAULT_LOCATION } from "@/lib/constants";

function PureMapContainer({
  places,
  filters,
  setFilters,
  setSearchInput,
  setMyLocation,
  setMap,
  moveTo,
}: {
  places: Place[];
  filters: string[];
  setFilters: (filters: string[]) => void;
  setSearchInput: (searchInput: string) => void;
  setMyLocation: (location: Coordinates | null) => void;
  setMap: (map: naver.maps.Map | null) => void;
  moveTo: (coords: Coordinates, zoom?: number) => void;
}) {
  const navermaps = useNavermaps();
  const [zoom, setZoom] = useState<number>(15);
  const [bounds, setBounds] = useState<naver.maps.PointBounds | null>(null);

  const debouncedSetBounds = useDebounceCallback(
    (bounds: naver.maps.PointBounds) => {
      setBounds(bounds);
    },
    200,
  );

  return (
    // 19.5rem = SIDEBAR_WIDTH
    <MapDiv className="h-full w-full overflow-hidden lg:w-[calc(100%-19.5rem)]">
      <div className="absolute top-0 left-0 z-20 mt-2 flex w-full justify-between gap-2 px-0 md:px-2">
        <MyLocationControl setMyLocation={setMyLocation} moveTo={moveTo} />
        {/* 필터 버튼 */}
        <CategoryFilters filters={filters} setFilters={setFilters} />
      </div>
      <NaverMap
        defaultCenter={
          new navermaps.LatLng(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng)
        }
        defaultZoom={15}
        ref={setMap}
        onZoomChanged={(zoom) => {
          setZoom(zoom);
        }}
        logoControl={false} // NAVER 로고 컨트롤의 표시 여부
        mapDataControl={false} // 지도 데이터 컨트롤의 표시 여부
        onBoundsChanged={debouncedSetBounds}
      >
        {/* 데이터를 마커로 표시합니다. */}
        <MarkerClusterer
          places={places}
          zoom={zoom}
          bounds={bounds}
          setSearchInput={setSearchInput}
          moveTo={moveTo}
        />
      </NaverMap>
    </MapDiv>
  );
}

export const MapContainer = memo(PureMapContainer);
