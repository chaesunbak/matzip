import {
  createContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import type { Coordinates } from "@/types";

interface MapContextType {
  map: naver.maps.Map | null;
  setMap: (map: naver.maps.Map | null) => void;
  moveTo: (coords: Coordinates, zoom?: number) => void;
}

export const MapContext = createContext<MapContextType | undefined>(undefined);

export function MapProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<naver.maps.Map | null>(null);

  const moveTo = useCallback(
    (coords: Coordinates, zoom = 16) => {
      if (map) {
        const navermaps = window.naver.maps;
        map.morph(new navermaps.LatLng(coords.lat, coords.lng), zoom);
      }
    },
    [map],
  );

  const value = useMemo(() => ({ map, setMap, moveTo }), [map, moveTo]);

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}
