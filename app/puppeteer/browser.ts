import chromium from "@sparticuz/chromium";
import puppeteerCore from "puppeteer-core";
import puppeteer from "puppeteer";

export async function getBrowser() {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    return puppeteer.launch({
      headless: true,
    });
  }

  // Production environment (e.g., AWS Lambda)
  return puppeteerCore.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: true,
  });
}
