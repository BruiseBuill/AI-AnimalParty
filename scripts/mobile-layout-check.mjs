import { chromium } from "playwright-core";

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

const viewports = [
  { width: 320, height: 568, name: "narrow-portrait" },
  { width: 360, height: 640, name: "small-portrait" },
  { width: 360, height: 680, name: "physical-1080x2040", dpr: 3 },
  { width: 390, height: 844, name: "portrait" },
  { width: 568, height: 320, name: "narrow-landscape" },
  { width: 740, height: 360, name: "small-landscape" },
  { width: 844, height: 390, name: "landscape" },
];

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: viewport.dpr ?? 1,
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:5173/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByRole("button", { name: "6", exact: true }).click();
  await page.getByRole("button", { name: "展开圆桌" }).click();

  const result = await page.locator(".player-token .avatar").evaluateAll((avatars) => {
    const boxes = avatars.map((avatar) => {
      const box = avatar.getBoundingClientRect();
      return { left: box.left, top: box.top, right: box.right, bottom: box.bottom };
    });
    const overlaps = [];
    for (let left = 0; left < boxes.length; left += 1) {
      for (let right = left + 1; right < boxes.length; right += 1) {
        const a = boxes[left];
        const b = boxes[right];
        if (a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top) overlaps.push([left + 1, right + 1]);
      }
    }
    return {
      count: boxes.length,
      visible: boxes.filter((box) => box.right > 0 && box.left < innerWidth && box.bottom > 0 && box.top < innerHeight).length,
      fullyVisible: boxes.filter((box) => box.left >= 0 && box.right <= innerWidth && box.top >= 0 && box.bottom <= innerHeight).length,
      overlaps,
      boxes,
    };
  });
  const physicalResolution = await page.locator(".round-table").getAttribute("data-physical-resolution");

  await page.screenshot({ path: `artifacts/mobile-6-${viewport.name}.png`, fullPage: false });
  console.log(JSON.stringify({ viewport, physicalResolution, ...result }));
  await context.close();
}

await browser.close();
