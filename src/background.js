function listener(details) {
  let filter = browser.webRequest.filterResponseData(details.requestId);
  let decoder = new TextDecoder("utf-8");
  let encoder = new TextEncoder();

  filter.ondata = event => {
    let str = decoder.decode(event.data, {stream: false});
    // Just change any instance of Example in the HTTP response
    // to WebExtension Example.
    //
    console.log(str);
    //
    filter.write(encoder.encode(str));
    filter.disconnect();
  }

  return {};
}

browser.webRequest.onBeforeRequest.addListener(
  listener,
  {urls: ["https://addons-dev.allizom.org/api/v3/addons/addon/*"], types: ["main_frame"]},
  ["blocking"]
);
