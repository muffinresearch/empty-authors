function listener(details) {
  let filter = browser.webRequest.filterResponseData(details.requestId);
  let decoder = new TextDecoder("utf-8");
  let encoder = new TextEncoder();
  let response = [];

  filter.onstart = event => {
    response = [];
  }

  filter.ondata = event => {
    let str = decoder.decode(event.data, {stream: true});
    response.push(str);
  }

  filter.onstop = event => {
    const jsonResponse = JSON.parse(response.join(''));
    jsonResponse.authors = [];
    console.log('replacing authors with an empty list');
    filter.write(encoder.encode(JSON.stringify(jsonResponse)));
    filter.disconnect();
  }

  return {};
}

browser.webRequest.onBeforeRequest.addListener(
  listener,
  { urls: [
    "https://addons-dev.allizom.org/api/v3/addons/addon/*",
    "https://addons.allizom.org/api/v3/addons/addon/*",
  ], types: ["main_frame", "xmlhttprequest"]},
  ["blocking"]
);
