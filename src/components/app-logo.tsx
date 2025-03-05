import { Map } from "lucide-react";
import { useState } from "react";
import { clsx } from "clsx";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function AppLogo({ className }: { className?: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn("ml-2 flex items-baseline gap-1 lg:ml-0", className)}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      <div className="flex items-baseline gap-1">
        <Map
          className={clsx(
            "text-primary h-6 w-6 transition-all duration-500",
            isHovered && "rotate-[360deg]",
          )}
        />
        <h1 className="text-primary text-3xl font-black">먹튜브</h1>
        <span className="text-muted-foreground text-sm">
          : 인플루언서들의 찐맛집
        </span>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <span className="text-muted-foreground cursor-pointer text-xs hover:underline">
            About
          </span>
        </PopoverTrigger>
        <PopoverContent asChild>
          <div className="w-9">
            <p className="text-xs">
              아 여기 근처 뭐 없나...? 내가 쓸라고 만듬.
              <br />
              <a
                href="https://docs.google.com/spreadsheets/d/1g1MRGk_os9nN3zIQvZbU2SYuWvNnCcgZhCCP4Enrsv8/edit?gid=0#gid=0"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                맛집정보 추가하기, 건의하기
              </a>
              <br />
              Created by{" "}
              <a
                href="https://github.com/chaesunbak/matzip"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                @Chaesunbak
              </a>
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
