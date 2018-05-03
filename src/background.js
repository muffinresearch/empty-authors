function listener(details) {
  let filter = browser.webRequest.filterResponseData(details.requestId);
  let decoder = new TextDecoder("utf-8");
  let encoder = new TextEncoder();

  filter.ondata = event => {
    let str = decoder.decode(event.data, {stream: false});
    const jsonResponse = JSON.parse(str);
    jsonResponse.authors = [];
    filter.write(encoder.encode(JSON.stringify(jsonResponse)));
    filter.disconnect();
  }

  return {};
}

browser.webRequest.onBeforeRequest.addListener(
  listener,
  { urls: [
    "https://addons-dev.allizom.org/api/v3/addons/addon/*",
    "https://addons.allizom.org/api/v3/addons/addon/*"
  ], types: ["main_frame"]},
  ["blocking"]
);
