import { useLayoutEffect, useRef, useState } from "react";
import { getCurrentDisplayMetrics, type DisplayMetrics } from "../platform/displayMetrics";
import { getSeatPositions, type SeatPosition } from "./tableLayout";

type RoundTableLayout = {
  tableRef: React.RefObject<HTMLDivElement | null>;
  seatPositions: SeatPosition[];
  displayMetrics: DisplayMetrics | null;
};

export function useRoundTableLayout(playerCount: number, bottomSeatIndex: number): RoundTableLayout {
  const tableRef = useRef<HTMLDivElement>(null);
  const [seatPositions, setSeatPositions] = useState<SeatPosition[]>([]);
  const [displayMetrics, setDisplayMetrics] = useState<DisplayMetrics | null>(null);

  useLayoutEffect(() => {
    const table = tableRef.current;
    if (!table) return;

    let animationFrame = 0;

    const update = () => {
      const bounds = table.getBoundingClientRect();
      if (bounds.width <= 0 || bounds.height <= 0) return;
      const avatarDiameter = Number.parseFloat(getComputedStyle(table).getPropertyValue("--avatar-size")) || 49;
      setDisplayMetrics(getCurrentDisplayMetrics());
      setSeatPositions(getSeatPositions(
        playerCount,
        {
          width: bounds.width,
          height: bounds.height,
          avatarDiameter,
        },
        bottomSeatIndex,
      ));
    };

    // Measure before installing observers so older WebViews still get a usable layout.
    update();
    animationFrame = window.requestAnimationFrame(update);
    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    resizeObserver?.observe(table);
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    window.visualViewport?.addEventListener("resize", update);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, [bottomSeatIndex, playerCount]);

  return { tableRef, seatPositions, displayMetrics };
}
