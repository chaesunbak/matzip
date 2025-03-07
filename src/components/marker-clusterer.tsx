import { useMap, Marker, useNavermaps } from "react-naver-maps";
import { useMemo } from "react";
import { useSearchParams } from "react-router";
import type { Place } from "@/types";
import {
  REGION_CENTERS_LOW_ZOOM,
  REGION_CENTERS_MID_ZOOM,
} from "@/lib/constants";

interface MarkerClustererProps {
  places: Place[];
  zoom: number;
  bounds: naver.maps.PointBounds | null;
}

export function MarkerClusterer({
  places,
  zoom,
  bounds,
}: MarkerClustererProps) {
  const map = useMap();
  const navermaps = useNavermaps();
  const [, setSearchParams] = useSearchParams();

  const regionGroupsLowZoom = useMemo(
    () =>
      places.reduce(
        (acc, place) => {
          const region = place.주소.split(" ")[0]; // 주소의 첫 번째 부분으로 클러스터링
          if (!acc[region]) {
            acc[region] = {
              count: 0,
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
          let region;
          const addressParts = place.주소.split(" ");
          if (
            addressParts[0] === "서울" ||
            addressParts[0] === "경기" ||
            addressParts[0] === "인천"
          ) {
            region = `${addressParts[0]} ${addressParts[1]}`;
          } else {
            region = addressParts[0];
          }

          if (
            addressParts[0] === "서울" ||
            addressParts[0] === "경기" ||
            addressParts[0] === "인천"
          ) {
            if (!acc[region]) {
              acc[region] = {
                count: 0,
                places: [],
                displayedName: addressParts[1],
              };
            }
            acc[region].count++;
            acc[region].places.push(place);
            acc[region].displayedName = addressParts[1];
          } else {
            if (!acc[region]) {
              acc[region] = {
                count: 0,
                places: [],
                displayedName: region,
              };
            }
            acc[region].count++;
            acc[region].places.push(place);
            acc[region].displayedName = region;
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
            //기존코드
            // 마커가 바운드 밖에 있으면 렌더링하지 않음
            if (!bounds?.hasPoint(position)) return null;

            // 마커가 오프셋 바운드 밖에 있으면 렌더링하지 않음
            // if (!isInOffsetBounds(position)) return null;

            return (
              <Marker
                key={region}
                defaultPosition={position}
                onClick={() => {
                  if (map) {
                    map.morph(position, zoom + 1);
                  }
                }}
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
            // 마커가 오프셋 바운드 밖에 있으면 렌더링하지 않음
            // if (!isInOffsetBounds(position)) return null;

            return (
              <Marker
                key={region}
                defaultPosition={position}
                onClick={() => {
                  if (map) {
                    map.morph(position, zoom + 1);
                  }
                }}
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
        // 마커가 오프셋 바운드 밖에 있으면 렌더링하지 않음
        // if (!isInOffsetBounds(position)) return null;

        return (
          <Marker
            key={index}
            defaultPosition={position}
            onClick={() => {
              if (map) {
                map.morph(position, 16);
              }
              setSearchParams({ search: place.이름 });
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
}
