import { useState, useCallback, useMemo } from "react";
import { useDebounceValue } from "usehooks-ts";

import { usePlaces } from "@/hooks/use-places";
import { AppLayout } from "@/components/app-layout";
import type { Coordinates, SortOption, Place } from "@/types";
import { PlaceList } from "@/components/place-list";
import { MapContainer } from "@/components/map-container";
import { SearchInput } from "@/components/search-input";
import { SelectSort } from "@/components/select-sort";

export default function App() {
  const [map, setMap] = useState<naver.maps.Map | null>(null);
  const [myLocation, setMyLocation] = useState<Coordinates | null>(null);
  const [filters, setFilters] = useState<string[]>([]); // 카테고리 필터
  const [searchInput, setSearchInput] = useState<string>(""); // 검색 필터

  const [sortOption, setSortOption] = useState<SortOption>("none");

  const [debouncedSearchInput] = useDebounceValue(searchInput, 500);
  const { data = [], isPending: isPlacesPending, error } = usePlaces();

  const moveTo = useCallback(
    (coords: Coordinates, zoom = 16) => {
      if (map) {
        const navermaps = window.naver.maps;
        map.morph(new navermaps.LatLng(coords.lat, coords.lng), zoom);
      }
    },
    [map],
  );

  const filteredData = useMemo(() => {
    return data.filter((place: Place) => {
      // 카테고리 필터링
      if (
        filters.length > 0 &&
        !filters.some((filter) => place.분류.includes(filter))
      ) {
        return false;
      }

      // 검색어 필터링
      if (debouncedSearchInput) {
        const searchTerm = debouncedSearchInput.trim();

        const searchableFields = [
          place.이름,
          place.주소,
          place.분류,
          place.태그,
          place.매체,
        ];
        return searchableFields.some((field) => field.includes(searchTerm));
      }

      return true;
    });
  }, [data, filters, debouncedSearchInput]);

  // 필터링과 정렬을 분리하여 불필요한 재계산을 방지합니다. (filters는 그대로고 sortOption만 변경되는 경우 재계산)
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
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
  }, [filteredData, sortOption, myLocation]);

  //디바운싱된 검색어와 검색어가 다르면 검색중임(디바운싱된 검색어는 500ms 후에 업데이트됨)
  const isSearching = searchInput !== debouncedSearchInput;

  return (
    <main className="flex h-full w-full">
      {/* 앱 사이드바에서 장소를 목록으로 표시합니다. */}
      <AppLayout
        header={
          <>
            <SearchInput
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              isSearching={isSearching}
            />
            <SelectSort
              sortOption={sortOption}
              setSortOption={setSortOption}
              myLocation={!!myLocation}
            />
          </>
        }
      >
        <div className="flex-1">
          <PlaceList
            data={sortedData}
            isPending={isPlacesPending || isSearching}
            error={error}
            myLocation={myLocation}
            setFilters={setFilters}
            setSearchInput={setSearchInput}
            moveTo={moveTo}
          />
        </div>
      </AppLayout>
      <MapContainer
        places={sortedData}
        filters={filters}
        setFilters={setFilters}
        setSearchInput={setSearchInput}
        setMyLocation={setMyLocation}
        setMap={setMap}
        moveTo={moveTo}
      />
    </main>
  );
}
