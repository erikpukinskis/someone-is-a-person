var library = require("module-library")(require)

library.using([
  "web-site",
  "browser-bridge",
  "basic-styles",
  "./blobby.js"],
  function(WebSite, BrowserBridge, basicStyles, blobby) {

    var site = new WebSite()
    site.start(process.env.PORT || 9000)
    var bridge = new BrowserBridge()
    basicStyles.addTo(bridge)
    blobby.prepareBridge(bridge)

    var blob = blobby()

    site.addRoute(
      "get",
      "/",
      bridge.requestHandler(blob))
  }
)
