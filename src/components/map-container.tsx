import { Container as MapDiv, NaverMap, useNavermaps } from "react-naver-maps";
import { useState, useMemo, memo } from "react";
import debounce from "lodash/debounce";

import type { Coordinates, Place } from "@/types";
import { MyLocationControl } from "@/components/my-location-control";
import { MarkerClusterer } from "@/components/marker-clusterer";
import { CategoryFilters } from "@/components/category-filters";
import { useMapContext } from "@/hooks/use-map-context";

export const MapContainer = memo(function MapContainer({
  places,
  filters,
  setFilters,
  setSearchInput,
  setMyLocation,
}: {
  places: Place[];
  filters: string[];
  setFilters: (filters: string[]) => void;
  setSearchInput: (searchInput: string) => void;
  setMyLocation: (location: Coordinates | null) => void;
}) {
  const navermaps = useNavermaps();
  const { setMap } = useMapContext();
  const [zoom, setZoom] = useState<number>(15);
  const [bounds, setBounds] = useState<naver.maps.PointBounds | null>(null);

  const debouncedSetBounds = useMemo(
    () =>
      debounce((bounds: naver.maps.PointBounds) => {
        setBounds(bounds);
      }, 200),
    [],
  );

  const defaultCenter: Coordinates = {
    lat: 37.3595704,
    lng: 127.105399,
  }; // 네이버 그린팩토리

  return (
    // 19.5rem = SIDEBAR_WIDTH
    <MapDiv className="h-full w-full overflow-hidden lg:w-[calc(100%-19.5rem)]">
      <div className="absolute top-0 left-0 z-20 mt-2 flex w-full justify-between gap-2 px-0 md:px-2">
        <MyLocationControl setMyLocation={setMyLocation} />
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
        onBoundsChanged={debouncedSetBounds}
      >
        {/* 데이터를 마커로 표시합니다. */}
        <MarkerClusterer
          places={places}
          zoom={zoom}
          bounds={bounds}
          setSearchInput={setSearchInput}
        />
      </NaverMap>
    </MapDiv>
  );
});
