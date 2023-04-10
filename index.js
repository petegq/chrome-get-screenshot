const chromeLauncher = require("chrome-launcher");
const chromeRemoteInterface = require("chrome-remote-interface");

async function runApp() {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ["--disable-gpu", "--headless"],
  });

  const client = await chromeRemoteInterface({
    port: chrome.port,
  });

  const { Page, Network } = client;

  await Promise.all([Page.enable(), Network.enable()]);

  await Page.navigate({ url: "https://bing.com" });
  Page.loadEventFired(async () => {
    console.log("Page loaded successfully.");

    const screenshot = await Page.captureScreenshot({ format: "png" });
    require("fs").writeFileSync("screenshot.png", screenshot.data, "base64");
    console.log("Screenshot saved as screenshot.png.");

    await client.close();
    await chrome.kill();
  });
}

runApp().catch(console.error);
