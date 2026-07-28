import { useLayoutEffect, useRef, useState } from "react";
import { getCurrentDisplayMetrics, type DisplayMetrics } from "../platform/displayMetrics";
import { getSeatPositions, type SeatPosition } from "./tableLayout";

type RoundTableLayout = {
  tableRef: React.RefObject<HTMLDivElement | null>;
  seatPositions: SeatPosition[];
  displayMetrics: DisplayMetrics | null;
};

export function useRoundTableLayout(playerCount: number): RoundTableLayout {
  const tableRef = useRef<HTMLDivElement>(null);
  const [seatPositions, setSeatPositions] = useState<SeatPosition[]>([]);
  const [displayMetrics, setDisplayMetrics] = useState<DisplayMetrics | null>(null);

  useLayoutEffect(() => {
    const table = tableRef.current;
    if (!table) return;

    const update = () => {
      const bounds = table.getBoundingClientRect();
      const avatarDiameter = Number.parseFloat(getComputedStyle(table).getPropertyValue("--avatar-size")) || 49;
      setDisplayMetrics(getCurrentDisplayMetrics());
      setSeatPositions(getSeatPositions(playerCount, {
        width: bounds.width,
        height: bounds.height,
        avatarDiameter,
      }));
    };

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(table);
    window.addEventListener("orientationchange", update);
    window.visualViewport?.addEventListener("resize", update);
    update();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("orientationchange", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, [playerCount]);

  return { tableRef, seatPositions, displayMetrics };
}
