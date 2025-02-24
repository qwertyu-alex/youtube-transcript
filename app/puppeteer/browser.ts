"use server";

import chromium from "@sparticuz/chromium";
import puppeteerCore from "puppeteer-core";

export async function getBrowser() {
  // Production environment (e.g., AWS Lambda)
  return puppeteerCore.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(
      "https://github.com/Sparticuz/chromium/releases/download/v132.0.0/chromium-v132.0.0-pack.tar"
    ),
    headless: true,
  });
}
