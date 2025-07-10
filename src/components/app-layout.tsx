import { useState, useEffect, memo, ReactNode } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Drawer,
  DrawerHeader,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { AppLogo } from "@/components/app-logo";

// 모바일에서 사이드바 크기 조절 가능한 포인트
const snapPoints = [0.3, 0.5, 0.9];

// 사이드바 컴포넌트
// 데스크탑에서는 사이드바 형태로 보여주고, 모바일에서는 드로어 형태로 보여줌
function PureAppLayout({
  children,
  header,
}: {
  children: ReactNode;
  header: ReactNode;
}) {
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);

  const isMobile = useIsMobile();

  useEffect(() => {
    setSnap(snapPoints[0]);
  }, [isMobile]);

  if (isMobile) {
    return (
      <Drawer
        open={true}
        snapPoints={snapPoints}
        activeSnapPoint={snap}
        setActiveSnapPoint={setSnap}
        modal={false} // 모달 모드 비활성화
        repositionInputs={false} // 드로어 모드에서 입력 위치 재배치 비활성화
      >
        <DrawerContent className="right-0 bottom-0 left-0 flex h-full flex-col rounded-t-2xl p-2 outline-none">
          {" "}
          {/* min-height 설정 */}
          <DrawerHeader className="p-0">
            <AppLogo className="md:hidden" />
            <DrawerTitle className="flex gap-1 p-2">{header}</DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto">{children}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sidebar>
      <SidebarHeader className="flex gap-2">
        <AppLogo />
        {header}
      </SidebarHeader>
      <SidebarContent>{children}</SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

export const AppLayout = memo(PureAppLayout);
