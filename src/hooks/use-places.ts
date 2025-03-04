import type { Place } from "@/types";

const fetchPlaces = async (): Promise<Place[]> => {
  const response = await fetch(
    `https://script.google.com/macros/s/AKfycbxycMjPlGw2fgKf3wRohgxlYItfEh6IYn7Qz80tMW9ccDe68mLn8tenDfqrgd2MmVMs/exec?sheetname=시트1`,
    {
      redirect: "follow",
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`[${response.status}] ${response.statusText}`);
  }

  // 응답 텍스트를 먼저 확인
  const responseText = await response.text();

  // 텍스트를 JSON으로 파싱
  const parsedData = JSON.parse(responseText);
  return parsedData;
};

import { useQuery } from "@tanstack/react-query";

export const usePlaces = () => {
  const { data, isPending, error } = useQuery<Place[], Error>({
    queryKey: ["places"],
    queryFn: fetchPlaces,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return { data, isPending, error };
};
