import { getBrowser } from "@/app/puppeteer/browser";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const browser = await getBrowser();
  const page = await browser.newPage();
  await page.goto("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const html = await page.content();
  return new Response(html);
}
