import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * sessionStorage를 사용하여 데이터를 캐싱하기 위한 유틸리티 함수 모음
 */

const CACHE_PREFIX = "query_cache_";

/**
 * 주어진 키에 해당하는 캐시된 데이터를 sessionStorage에서 가져옵니다.
 * @param key - 캐시를 식별하는 고유 키
 * @returns 캐시된 데이터 또는 데이터가 없거나 파싱에 실패한 경우 null
 */
export const getCache = <T>(key: string): T | null => {
  const cacheKey = `${CACHE_PREFIX}${key}`;
  const cachedData = sessionStorage.getItem(cacheKey);

  if (cachedData) {
    try {
      return JSON.parse(cachedData) as T;
    } catch (e) {
      console.error(`Error parsing cache for key "${key}":`, e);
      sessionStorage.removeItem(cacheKey);
      return null;
    }
  }
  return null;
};

/**
 * 데이터를 sessionStorage에 캐시합니다.
 * @param key - 캐시를 식별하는 고유 키
 * @param data - 캐시할 데이터
 */
export const setCache = <T>(key: string, data: T): void => {
  const cacheKey = `${CACHE_PREFIX}${key}`;
  try {
    const serializedData = JSON.stringify(data);
    sessionStorage.setItem(cacheKey, serializedData);
  } catch (e) {
    console.error(`Error setting cache for key "${key}":`, e);
  }
};

export async function cacheFetch<T>(
  key: string,
  fetchFn: (signal: AbortSignal) => Promise<T>,
  signal: AbortSignal,
): Promise<T> {
  const cachedData = getCache(key);
  if (cachedData) {
    return cachedData as T;
  }
  const data = await fetchFn(signal);
  setCache(key, data);
  return data;
}
