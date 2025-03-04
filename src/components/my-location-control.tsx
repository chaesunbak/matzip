import { useEffect, useState } from "react";
import { useNavermaps, useMap, Overlay } from "react-naver-maps";

import type { Coordinates } from "@/types";

export function MyLocationControl({
  setMyLocation,
}: {
  setMyLocation: (location: Coordinates) => void;
}) {
  const navermaps = useNavermaps();
  const map = useMap();

  const locationBtnHtml = `
      <a href="/#" 
        class="abosolute rounded-full border border-input"
        style="
          z-index: 200;
          overflow: hidden;
          display: inline-block;
          top: 7px;
          left: 5px;
          width: 36px;
          height: 36px;
          background-color: #fcfcfd;
          background-clip: border-box;
          text-align: center;
          -webkit-background-clip: padding;
          background-clip: padding-box;
        "
      >
        <span style="
          overflow: hidden;
          display: inline-block;
          color: transparent !important;
          vertical-align: top;
          background: url(https://ssl.pstatic.net/static/maps/m/spr_trff_v6.png) 0 0;
            background-position-x: 0px;
            background-position-y: 0px;
            background-size: auto;
          background-size: 200px 200px;
          -webkit-background-size: 200px 200px;
          width: 20px;
          height: 20px;
          margin: 7px 0 0 0;
          background-position: -153px -31px;
        ">내 위치</span>
      </a>
    `;

  const [customControl] = useState(() => {
    return new navermaps.CustomControl(locationBtnHtml, {
      position: navermaps.Position.TOP_LEFT,
    });
  });

  const DEFAULT_LOCATION: Coordinates = {
    lat: 37.3595704,
    lng: 127.105399,
  }; // 네이버 그린팩토리

  const handleLocationClick = () => {
    if (!map) return;

    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      map.setZoom(17);
      map.setCenter(
        new navermaps.LatLng(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng),
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!map) return;

        const location: Coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map.setZoom(17);
        map.setCenter(new navermaps.LatLng(location.lat, location.lng));
        setMyLocation(location);
      },
      (error) => {
        if (!map) return;

        console.error("Error getting location:", error);
        map.setZoom(17);
        map.setCenter(
          new navermaps.LatLng(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng),
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    );
  };
  useEffect(() => {
    // naver.maps.Event.addDOMListener 사용할 필요 없이, native addEventListener를 사용합니다.
    // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
    const domElement = customControl.getElement();

    domElement.addEventListener("click", handleLocationClick);

    return () => {
      domElement.removeEventListener("click", handleLocationClick);
    };
  }, []);

  return <Overlay element={customControl} />;
}
