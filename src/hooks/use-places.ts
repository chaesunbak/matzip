import { useState, useEffect } from "react";

import type { Place, PlacesApiResponse } from "@/types";

export const usePlaces = () => {
  const [data, setData] = useState<Place[]>([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await fetchPlaces();
        const { headers, rows } = responseData;

        const transformedData: Place[] = rows.map((row) => {
          const placeObject: Partial<Place> = {};
          headers.forEach((header, index) => {
            const key = header as keyof Place;
            const value = row[index];

            if (key === "위도" || key === "경도") {
              placeObject[key] = Number(value);
            } else {
              placeObject[key] = value as string;
            }
          });
          return placeObject as Place;
        });

        setData(transformedData);
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsPending(false);
      }
    };
    fetchData();
  }, []);

  return { data, isPending, error };
};

const fetchPlaces = async (
  signal?: AbortSignal,
): Promise<PlacesApiResponse> => {
  const startTime = performance.now();
  let success = false;
  try {
    const response = await fetch(
      `https://script.google.com/macros/s/AKfycbxycMjPlGw2fgKf3wRohgxlYItfEh6IYn7Qz80tMW9ccDe68mLn8tenDfqrgd2MmVMs/exec?sheetname=시트1`,
      {
        redirect: "follow",
        method: "GET",
        cache: "no-cache",
        headers: {
          Accept: "application/json",
        },
        signal,
      },
    );

    if (!response.ok) {
      throw new Error(`[${response.status}] ${response.statusText}`);
    }
    success = true;
    const data = await response.json();

    return data;
  } finally {
    const endTime = performance.now();
    const duration = endTime - startTime;
    if (window.gtag) {
      window.gtag("event", "fetch_places", {
        "duration(ms)": Math.round(duration),
        result: success ? "success" : "failure",
      });
    }
  }
};
