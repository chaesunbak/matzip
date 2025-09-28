import { Marker, useNavermaps } from "react-naver-maps";
import { useMemo, memo, useCallback } from "react";

import type { Place } from "@/types";
import type { Coordinates } from "@/types";

interface MarkerClustererProps {
  places: Place[];
  zoom: number;
  bounds: naver.maps.PointBounds | null;
  setSearchInput: (searchInput: string) => void;
  moveTo: (coords: Coordinates, zoom?: number) => void;
}

type RegionGroup = {
  count: number;
  places: Place[];
  displayedName: string;
  latSum: number;
  lngSum: number;
};

function PureMarkerClusterer({
  places,
  zoom,
  bounds,
  setSearchInput,
  moveTo,
}: MarkerClustererProps) {
  const regionGroupsLowZoom = useMemo(
    () =>
      groupPlacesByRegion(places, (place) => {
        const region = place.주소.split(" ")[0];
        return { key: region, displayedName: region };
      }),
    [places],
  );

  const regionGroupsMidZoom = useMemo(
    () =>
      groupPlacesByRegion(places, (place) => {
        const addressParts = place.주소.split(" ");
        const key = `${addressParts[0]} ${addressParts[1]}`;
        const displayedName = addressParts[1];
        return { key, displayedName };
      }),
    [places],
  );

  // 줌 레벨이 10 미만일 때 (광역시/도 단위 클러스터링)
  if (zoom < 10) {
    return (
      <>
        {Object.entries(regionGroupsLowZoom).map(([region, group]) => (
          <RegionClusterMarker
            key={region}
            region={region}
            group={group}
            bounds={bounds}
            moveTo={moveTo}
            zoom={zoom}
          />
        ))}
      </>
    );
  }

  // 줌 레벨이 10 이상 14 미만일 때 (시/군/구 단위 클러스터링)
  if (zoom < 14) {
    return (
      <>
        {Object.entries(regionGroupsMidZoom).map(([region, group]) => (
          <RegionClusterMarker
            key={region}
            region={region}
            group={group}
            bounds={bounds}
            moveTo={moveTo}
            zoom={zoom}
          />
        ))}
      </>
    );
  }

  // 줌 레벨이 14 이상일 때 (개별 장소 마커)
  return (
    <>
      {places.map((place, index) => (
        <PlaceMarker
          key={index}
          place={place}
          index={index}
          bounds={bounds}
          moveTo={moveTo}
          setSearchInput={setSearchInput}
        />
      ))}
    </>
  );
}
export const MarkerClusterer = memo(PureMarkerClusterer);

function PureClusterMarker({
  position,
  displayedName,
  count,
  onClick,
}: {
  position: naver.maps.LatLng;
  displayedName: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <Marker
      defaultPosition={position}
      onClick={onClick}
      icon={{
        content: `
         <div
          class="bg-primary text-primary-foreground font-bold flex rounded-full text-center py-0.5 px-2 items-center justify-between overflow-hidden text-clip text-nowrap">
          ${displayedName} <span class="text-sm font-normal ml-1">${count}</span>
        </div>
      `,
      }}
    />
  );
}
const ClusterMarker = memo(PureClusterMarker);

const RegionClusterMarker = memo(function RegionClusterMarker({
  region,
  group,
  bounds,
  moveTo,
  zoom,
}: {
  region: string;
  group: RegionGroup;
  bounds: naver.maps.PointBounds | null;
  moveTo: (coords: Coordinates, zoom?: number) => void;
  zoom: number;
}) {
  const { count, displayedName, latSum, lngSum } = group;
  const navermaps = useNavermaps();

  const { avgLat, avgLng } = useMemo(
    () => ({
      avgLat: latSum / count,
      avgLng: lngSum / count,
    }),
    [latSum, lngSum, count],
  );

  const position = useMemo(
    () => new navermaps.LatLng(avgLat, avgLng),
    [navermaps, avgLat, avgLng],
  );

  const onClick = useCallback(() => {
    moveTo({ lat: avgLat, lng: avgLng }, zoom + 2);

    if (window.gtag) {
      window.gtag("event", "clickMarker", {
        marker_name: displayedName,
      });
    }
  }, [moveTo, avgLat, avgLng, zoom, displayedName]);

  if (!bounds?.hasPoint(position)) return null;

  return (
    <ClusterMarker
      key={region}
      position={position}
      displayedName={displayedName}
      count={count}
      onClick={onClick}
    />
  );
});

const PlaceMarker = memo(function PlaceMarker({
  place,
  index,
  bounds,
  moveTo,
  setSearchInput,
}: {
  place: Place;
  index: number;
  bounds: naver.maps.PointBounds | null;
  moveTo: (coords: Coordinates, zoom?: number) => void;
  setSearchInput: (searchInput: string) => void;
}) {
  const navermaps = useNavermaps();
  const position = useMemo(
    () => new navermaps.LatLng(place.위도, place.경도),
    [navermaps, place.위도, place.경도],
  );

  const onClick = useCallback(() => {
    moveTo({ lat: place.위도, lng: place.경도 }, 16);
    setSearchInput(place.이름);

    if (window.gtag) {
      window.gtag("event", "clickMarker", {
        marker_name: place.이름,
      });
    }
  }, [moveTo, setSearchInput, place.위도, place.경도, place.이름]);

  if (!bounds?.hasPoint(position)) return null;

  return (
    <Marker
      key={index}
      defaultPosition={position}
      onClick={onClick}
      icon={{
        content: `
          <div class="full bg-primary text-primary-foreground flex flex-col rounded-full text-center py-0.5 px-2 items-center justify-between overflow-hidden text-clip text-nowrap">
            <div class="text-sm font-extrabold">${place.이름}</div>
            <div class="text-xs font-semibold">${place.분류} ${place.태그}</div>
          </div>
        `,
      }}
    />
  );
});

function groupPlacesByRegion(
  places: Place[],
  getRegionInfo: (place: Place) => { key: string; displayedName: string },
): Record<string, RegionGroup> {
  return places.reduce(
    (acc, place) => {
      const { key, displayedName } = getRegionInfo(place);

      if (!acc[key]) {
        acc[key] = {
          count: 0,
          places: [],
          displayedName,
          latSum: 0,
          lngSum: 0,
        };
      }
      acc[key].count++;
      acc[key].places.push(place);
      acc[key].latSum += place.위도;
      acc[key].lngSum += place.경도;
      return acc;
    },
    {} as Record<string, RegionGroup>,
  );
}
