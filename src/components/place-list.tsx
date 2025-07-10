import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, memo } from "react";

import type { Place } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { Coordinates } from "@/types";
import { PlaceItem } from "./place-item";

function PurePlaceList({
  data,
  isPending,
  error,
  myLocation,
  setFilters,
  setSearchInput,
  moveTo,
}: {
  data: Place[];
  isPending: boolean;
  error: Error | null;
  myLocation: Coordinates | null;
  setSearchInput: (searchInput: string) => void;
  setFilters: (filters: string[]) => void;
  moveTo: (coords: Coordinates, zoom?: number) => void;
}) {
  // The scrollable element for your list
  const parentRef = useRef(null);

  // The virtualizer
  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 84,
  });

  const items = virtualizer.getVirtualItems();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
        <p className="text-destructive font-semibold">오류가 발생했습니다</p>
        <p className="text-muted-foreground text-sm">{error.message}</p>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex flex-col gap-3 divide-y p-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex w-full flex-col gap-2 p-2">
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-5" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-44" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-12 rounded-full" />
              <Skeleton className="h-4 w-5 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-2 text-sm">
        검색결과가 없습니다.
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSearchInput("");
            setFilters([]);
          }}
        >
          검색, 필터 초기화
        </Button>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="h-full w-full overflow-y-auto"
      style={{
        contain: "strict",
      }}
    >
      <div
        className="relative"
        style={{
          height: virtualizer.getTotalSize(),
        }}
      >
        <ul
          className="absolute top-0 left-0 w-full divide-y p-1"
          style={{
            transform: `translateY(${items[0]?.start ?? 0}px)`,
          }}
        >
          {items.map((virtualRow) => {
            const place = data[virtualRow.index];
            return (
              <li
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className="flex w-full flex-col p-2"
              >
                <PlaceItem
                  place={place}
                  myLocation={myLocation}
                  moveTo={moveTo}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export const PlaceList = memo(PurePlaceList);
