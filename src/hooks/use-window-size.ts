import { useState, useEffect } from "react";
import { debounce } from "lodash";

export function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<{
    width: number | undefined;
    height: number | undefined;
  }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // 디바운스된 리사이즈 핸들러 생성 (200ms 지연)
    const debouncedHandleResize = debounce(handleResize, 200);

    // Add event listener with debounced handler
    window.addEventListener("resize", debouncedHandleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
      // Cancel any pending debounce
      debouncedHandleResize.cancel();
    };
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
}
