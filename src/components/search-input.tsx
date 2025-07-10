import { X, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SearchInput({
  searchInput,
  setSearchInput,
  className,
  isSearching,
}: {
  searchInput: string;
  setSearchInput: (searchInput: string) => void;
  className?: string;
  isSearching: boolean;
}) {
  return (
    <div className={cn("relative w-full", className)}>
      <Input
        placeholder="키워드, 지역 검색"
        value={searchInput}
        onChange={(e) => {
          setSearchInput(e.target.value);
        }}
        className={searchInput ? "pr-8" : ""}
      />
      {isSearching ? (
        <Loader2
          size={14}
          className="text-muted-foreground absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2 animate-spin p-1"
        />
      ) : (
        searchInput && (
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2 p-0 hover:bg-transparent"
            onClick={() => {
              setSearchInput("");
            }}
            aria-label="검색어 지우기"
          >
            <X size={14} />
          </Button>
        )
      )}
    </div>
  );
}
