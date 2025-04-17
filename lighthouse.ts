import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";

export async function runLighthouse(url: string) {
  const chrome = await launch({
    chromeFlags: ["--headless=new", "--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage"],
  });

  const options = {
    logLevel: "info" as const,
    output: "json" as const,
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    port: chrome.port,
  };

  const result = await lighthouse(url, options);
  await chrome.kill();

  if (!result) {
    throw new Error("Lighthouse result is undefined");
  }
  const lhr = result.lhr;

  return {
    url: lhr.finalUrl,
    categories: {
      performance: (lhr.categories.performance.score ?? 0) * 100,
      accessibility: (lhr.categories.accessibility.score ?? 0) * 100,
      bestPractices: (lhr.categories["best-practices"]?.score ?? 0) * 100,
      seo: (lhr.categories.seo.score ?? 0) * 100,
    },
    audits: {
      firstContentfulPaint: lhr.audits["first-contentful-paint"],
      largestContentfulPaint: lhr.audits["largest-contentful-paint"],
      totalBlockingTime: lhr.audits["total-blocking-time"],
      cumulativeLayoutShift: lhr.audits["cumulative-layout-shift"],
      speedIndex: lhr.audits["speed-index"],
    },
  };
}
