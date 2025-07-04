import { useState, memo } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";

import { Button } from "@/components/ui/button";
import type { Coordinates } from "@/types";
import { useMapContext } from "@/hooks/use-map-context";

const DEFAULT_LOCATION: Coordinates = {
  lat: 37.3595704,
  lng: 127.105399,
}; // 네이버 그린팩토리

interface MyLocationControlProps {
  setMyLocation: (coordinates: Coordinates | null) => void;
}

export const MyLocationControl = memo(function MyLocationControl({
  setMyLocation,
}: MyLocationControlProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOn, setIsOn] = useState(false);
  const { moveTo } = useMapContext();

  const handleSuccess = (position: GeolocationPosition) => {
    const location: Coordinates = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };

    setMyLocation(location);
    moveTo(location, 16);
    setIsOn(true);
    setIsLoading(false);
  };

  const handleError = (error: GeolocationPositionError) => {
    console.error("Error getting location:", error);
    toast.error("위치 정보를 가져오는데 실패했습니다.");
    setMyLocation(DEFAULT_LOCATION);
    moveTo(DEFAULT_LOCATION, 17);
    setIsLoading(false);
  };

  const handleClick = () => {
    setIsLoading(true);

    if (window.gtag) {
      window.gtag("event", "clickMyLocation");
    }

    if (!navigator.geolocation) {
      toast.error("이 브라우저에서는 위치 정보를 사용할 수 없습니다.");
      setMyLocation(DEFAULT_LOCATION);
      moveTo(DEFAULT_LOCATION, 17);
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });
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
});
