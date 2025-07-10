import { memo } from "react";

import type { Place, Coordinates } from "@/types";
import { toast } from "sonner";
import YTLogo from "@/assets/yt_favicon_ringo2.png";
import NaverMapLogo from "@/assets/naver_map_favicon.png";
import KakaoMapLogo from "@/assets/kakao_map_favicon.webp";
import GoogleMapLogo from "@/assets/goggle_map_favicon.png";

function PurePlaceItem({
  place,
  myLocation,
  moveTo,
}: {
  place: Place;
  myLocation: Coordinates | null;
  moveTo: (coords: Coordinates, zoom?: number) => void;
}) {
  return (
    <>
      <div>
        <h3
          className="inline cursor-pointer font-bold hover:underline"
          title="클릭하여 지도에서 보기"
          onClick={() => {
            moveTo({ lat: place.위도, lng: place.경도 }, 16);

            if (window.gtag) {
              window.gtag("event", "clickItem", {
                marker_name: place.이름,
              });
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

                if (window.gtag) {
                  window.gtag("event", "copyAddress", {
                    address: place.주소,
                  });
                }
              } catch (error) {
                console.error(error);
                toast.error("주소 복사에 실패했습니다.");

                if (window.gtag) {
                  window.gtag("event", "copyAddressError", {
                    address: place.주소,
                  });
                }
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
              <img src={YTLogo} alt="유튜브" className="h-[10px] w-[14px]" />
            </a>
          </span>
        )}

        <span className="rounded-full bg-gray-200 px-[4px] py-[2px]">
          <a
            href={`https://map.naver.com/p/search/${place.주소.split(" ")[0]}%20${place.주소.split(" ")[1]}%20${place.이름}`}
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
        <span className="rounded-full bg-gray-200 px-[4px] py-[2px]">
          <a
            href={`https://map.naver.com/p/search/${place.주소.split(" ")[0]}%20${place.주소.split(" ")[1]}%20${place.이름}`}
            target="_blank"
            rel="noopener noreferrer"
            title="카카오 지도에서 보기"
          >
            <img
              src={KakaoMapLogo}
              alt="카카오 지도"
              className="h-[15px] w-[15px]"
            />
          </a>
        </span>
        <span className="rounded-full bg-gray-200 px-[4px] py-[2px]">
          <a
            href={`https://www.google.com/maps/search/${place.주소.split(" ")[0]}+${place.주소.split(" ")[1]}+${place.이름}`}
            target="_blank"
            rel="noopener noreferrer"
            title="구글 지도에서 보기"
          >
            <img
              src={GoogleMapLogo}
              alt="구글 지도"
              className="h-[15px] w-[15px]"
            />
          </a>
        </span>
      </div>
    </>
  );
}

export const PlaceItem = memo(PurePlaceItem);
