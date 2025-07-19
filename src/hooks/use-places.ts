import { useState, useEffect } from "react";

import type { Place } from "@/types";
import { cacheFetch } from "@/lib/utils";

export const usePlaces = () => {
  const [data, setData] = useState<Place[]>([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await cacheFetch("places", () => fetchPlaces());
        setData(data);
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

const fetchPlaces = async (signal?: AbortSignal): Promise<Place[]> => {
  const startTime = performance.now();
  let success = false;
  try {
    const response = await fetch(
      `https://script.google.com/macros/s/AKfycbxycMjPlGw2fgKf3wRohgxlYItfEh6IYn7Qz80tMW9ccDe68mLn8tenDfqrgd2MmVMs/exec?sheetname=시트1`,
      {
        redirect: "follow",
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        signal,
      },
    );

    if (!response.ok) {
      throw new Error(`[${response.status}] ${response.statusText}`);
    }

    // 응답 텍스트를 먼저 확인
    const responseText = await response.text();

    // 텍스트를 JSON으로 파싱
    const parsedData = JSON.parse(responseText);
    success = true;
    return parsedData;
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
