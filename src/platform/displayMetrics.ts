export type DisplayMetrics = {
  cssViewportWidth: number;
  cssViewportHeight: number;
  physicalWidth: number;
  physicalHeight: number;
  devicePixelRatio: number;
};

export function getCurrentDisplayMetrics(): DisplayMetrics {
  const devicePixelRatio = window.devicePixelRatio || 1;
  const cssViewportWidth = window.visualViewport?.width ?? window.innerWidth;
  const cssViewportHeight = window.visualViewport?.height ?? window.innerHeight;
  return {
    cssViewportWidth,
    cssViewportHeight,
    physicalWidth: Math.round(cssViewportWidth * devicePixelRatio),
    physicalHeight: Math.round(cssViewportHeight * devicePixelRatio),
    devicePixelRatio,
  };
}
