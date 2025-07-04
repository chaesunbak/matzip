import { Marker, useNavermaps } from "react-naver-maps";
import { useMemo, memo } from "react";

import type { Place } from "@/types";
import {
  REGION_CENTERS_LOW_ZOOM,
  REGION_CENTERS_MID_ZOOM,
} from "@/lib/constants";
import { useMapContext } from "@/hooks/use-map-context";

interface MarkerClustererProps {
  places: Place[];
  zoom: number;
  bounds: naver.maps.PointBounds | null;
  setSearchInput: (searchInput: string) => void;
}

const ClusterMarker = memo(function ClusterMarker({
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
});

export const MarkerClusterer = memo(function MarkerClusterer({
  places,
  zoom,
  bounds,
  setSearchInput,
}: MarkerClustererProps) {
  const navermaps = useNavermaps();
  const { moveTo } = useMapContext();

  const regionGroupsLowZoom = useMemo(
    () =>
      places.reduce(
        (acc, place) => {
          const region = place.주소.split(" ")[0]; // 주소의 첫 번째 부분으로 클러스터링
          if (!acc[region]) {
            acc[region] = {
              count: 1,
              places: [],
              displayedName: region,
            };
          }
          acc[region].displayedName = region;
          acc[region].count++;
          acc[region].places.push(place);
          return acc;
        },
        {} as Record<
          string,
          { count: number; places: Place[]; displayedName: string }
        >,
      ),
    [places],
  );

  const regionGroupsMidZoom = useMemo(
    () =>
      places.reduce(
        (acc, place) => {
          // 서울, 경기, 인천은 시/군/구까지 포함, 나머지는 광역시/도만

          const addressParts = place.주소.split(" ");
          const region = `${addressParts[0]} ${addressParts[1]}`;

          if (!acc[region]) {
            acc[region] = {
              count: 1,
              places: [],
              displayedName: addressParts[1],
            };
          } else {
            acc[region].count++;
            acc[region].places.push(place);
            acc[region].displayedName = addressParts[1];
          }

          return acc;
        },
        {} as Record<
          string,
          { count: number; places: Place[]; displayedName: string }
        >,
      ),
    [places],
  );

  // 줌 레벨이 10 미만일 때 (광역시/도 단위 클러스터링)
  if (zoom < 10) {
    return (
      <>
        {Object.entries(regionGroupsLowZoom).map(
          ([region, { count, displayedName }]) => {
            const center = REGION_CENTERS_LOW_ZOOM[region];
            if (!center) return null;

            const position = new navermaps.LatLng(center.lat, center.lng);
            if (!bounds?.hasPoint(position)) return null;

            return (
              <ClusterMarker
                key={region}
                position={position}
                displayedName={displayedName}
                count={count}
                onClick={() => {
                  moveTo({ lat: center.lat, lng: center.lng }, zoom + 2);

                  // Google Analytics 이벤트 전송
                  if (window.gtag) {
                    window.gtag("event", "clickMarker", {
                      marker_name: displayedName,
                    });
                  }
                }}
              />
            );
          },
        )}
      </>
    );
  }

  // 줌 레벨이 10 이상 14 미만일 때 (시/군/구 단위 클러스터링)
  if (zoom < 14) {
    return (
      <>
        {Object.entries(regionGroupsMidZoom).map(
          ([region, { count, displayedName }]) => {
            const center = REGION_CENTERS_MID_ZOOM[region];
            if (!center) return null;

            const position = new navermaps.LatLng(center.lat, center.lng);

            if (!bounds?.hasPoint(position)) return null;

            return (
              <ClusterMarker
                key={region}
                position={position}
                displayedName={displayedName}
                count={count}
                onClick={() => {
                  moveTo({ lat: center.lat, lng: center.lng }, zoom + 2);

                  // Google Analytics 이벤트 전송
                  if (window.gtag) {
                    window.gtag("event", "clickMarker", {
                      marker_name: displayedName,
                    });
                  }
                }}
              />
            );
          },
        )}
      </>
    );
  }

  // 줌 레벨이 14 이상일 때 (개별 장소 마커)
  return (
    <>
      {places.map((place, index) => {
        const position = new navermaps.LatLng(place.위도, place.경도);

        if (!bounds?.hasPoint(position)) return null;

        return (
          <Marker
            key={index}
            defaultPosition={position}
            onClick={() => {
              moveTo({ lat: place.위도, lng: place.경도 }, 16);
              setSearchInput(place.이름);

              // Google Analytics 이벤트 전송
              if (window.gtag) {
                window.gtag("event", "clickMarker", {
                  marker_name: place.이름,
                });
              }
            }}
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
      })}
    </>
  );
});
