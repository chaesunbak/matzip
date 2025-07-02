import { X } from "lucide-react";
import { useSearchParams } from "react-router";
import { useEffect } from "react";
import { debounce } from "lodash";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SearchInput({
  searchInput,
  setSearchInput,
  className,
}: {
  searchInput: string;
  setSearchInput: (searchInput: string) => void;
  className?: string;
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("search")) {
      setSearchInput(searchParams.get("search") || "");
    }
  }, [searchParams, setSearchInput]);

  const handleSearchChange = debounce((value: string) => {
    if (value) {
      setSearchParams({ search: value });

      if (window.gtag) {
        window.gtag("event", "search", {
          search_term: value,
        });
      }
    } else {
      setSearchParams({});
    }
  }, 300);

  return (
    <div className={cn("relative w-full", className)}>
      <Input
        placeholder="키워드, 지역 검색"
        value={searchInput}
        onChange={(e) => {
          setSearchInput(e.target.value);
          handleSearchChange(e.target.value);
        }}
        className={searchInput ? "pr-8" : ""}
      />
      {searchInput && (
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2 p-0 hover:bg-transparent"
          onClick={() => {
            setSearchInput("");
            setSearchParams({});
          }}
          aria-label="검색어 지우기"
        >
          <X size={14} />
        </Button>
      )}
    </div>
  );
}
