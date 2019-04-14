var library = require("module-library")(require)

library.using([
  "web-site",
  "browser-bridge",
  "basic-styles",
  "./blobby.js",
  "./"],
  function(WebSite, BrowserBridge, basicStyles, blobby, someoneIsAPerson) {

    var site = new WebSite()
    site.start(process.env.PORT || 9000)
    var baseBridge = new BrowserBridge()
    basicStyles.addTo(baseBridge)
    blobby.prepareBridge(baseBridge)
    someoneIsAPerson.prepareSite(site)

    

    site.addRoute(
      "get",
      "/",
      function(request, response) {
        var meId = someoneIsAPerson.ensureMe(request, response)
        var bridge = baseBridge.forResponse(response)

        var blob = blobby(meId)

        bridge.forResponse(response).send(blob)
      })
  }
)
