import { useState } from "react";
import { useNavermaps } from "react-naver-maps";
import { MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";

import { Button } from "@/components/ui/button";

import type { Coordinates } from "@/types";

interface MyLocationControlProps {
  setMyLocation: (coordinates: Coordinates) => void;
  map: naver.maps.Map | null;
}

const DEFAULT_LOCATION: Coordinates = {
  lat: 37.3595704,
  lng: 127.105399,
}; // 네이버 그린팩토리

export function MyLocationControl({
  setMyLocation,
  map,
}: MyLocationControlProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOn, setIsOn] = useState(false);
  const navermaps = useNavermaps();

  const handleClick = () => {
    console.log("handleClick");
    setIsLoading(true);

    if (!navigator.geolocation) {
      toast.error("이 브라우저에서는 위치 정보를 사용할 수 없습니다.");
      setMyLocation(DEFAULT_LOCATION);
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: Coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setMyLocation(location);
        setIsOn(true);
        if (map) {
          map.morph(new navermaps.LatLng(location.lat, location.lng), 16);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("위치 정보를 가져오는데 실패했습니다.");
        setMyLocation(DEFAULT_LOCATION);
        if (map) {
          map.setCenter(
            new navermaps.LatLng(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng),
          );
          map.setZoom(17);
        }
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    );
  };

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      disabled={isLoading}
      className="ml-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <MapPin
          className={clsx("h-4 w-4 transition-colors", {
            "text-blue-300": isOn,
          })}
        />
      )}
    </Button>
  );
}
