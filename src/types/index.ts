export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Place {
  이름: string;
  분류: string;
  태그: string;
  주소: string;
  위도: number;
  경도: number;
  매체: string;
  "매체 URL": string;
  "지도 URL": string;
}

export const CATEGORIES = [
  "한식",
  "양식",
  "일식",
  "중식",
  "기타",
  "카페, 디저트",
  "바",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type SortOption = "none" | "name" | "distance";
