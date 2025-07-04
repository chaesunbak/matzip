import { useState } from "react";
import { usePlaces } from "@/hooks/use-places";
import { AppLayout } from "@/components/app-layout";
import type { Coordinates, SortOption, Place } from "@/types";
import { PlaceList } from "@/components/place-list";
import { MapContainer } from "@/components/map-container";

function App() {
  const { data = [], isPending, error } = usePlaces();
  const [myLocation, setMyLocation] = useState<Coordinates | null>(null);
  const [filters, setFilters] = useState<string[]>([]); // 카테고리 필터
  const [searchInput, setSearchInput] = useState<string>(""); // 검색 필터
  const [sortOption, setSortOption] = useState<SortOption>("none");

  const filteredData = data.filter((place: Place) => {
    // 카테고리 필터링
    if (
      filters.length > 0 &&
      !filters.some((filter) => place.분류.includes(filter))
    ) {
      return false;
    }

    // 검색어 필터링
    if (searchInput) {
      const searchLower = searchInput.toLowerCase();
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

  return (
    <main className="flex h-full w-full">
      {/* 앱 사이드바에서 장소를 목록으로 표시합니다. */}
      <AppLayout
        myLocation={myLocation}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        sortOption={sortOption}
        setSortOption={setSortOption}
      >
        <PlaceList
          data={filteredData}
          isPending={isPending}
          error={error}
          myLocation={myLocation}
          setFilters={setFilters}
          sortOption={sortOption}
          setSearchInput={setSearchInput}
        />
      </AppLayout>
      <MapContainer
        places={filteredData}
        filters={filters}
        setFilters={setFilters}
        setSearchInput={setSearchInput}
        setMyLocation={setMyLocation}
      />
    </main>
  );
}

export default App;
