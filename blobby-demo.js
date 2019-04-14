var library = require("module-library")(require)

library.using([
  library.ref(),
  "web-site",
  "browser-bridge",
  "basic-styles",
  "./blobby.js",
  "./",
  "single-use-socket",
  "a-wild-universe-appeared",
  "bridge-module"],
  function(lib, WebSite, BrowserBridge, basicStyles, blobby, someoneIsAPerson, SingleUseSocket, aWildUniverseAppeared, bridgeModule) {

    var site = new WebSite()

    var baseBridge = new BrowserBridge()
    basicStyles.addTo(baseBridge)
    SingleUseSocket.installOn(site)
    someoneIsAPerson.prepareSite(site)

    site.start(process.env.PORT || 9000)

    var rooms = {}

    site.addRoute(
      "get",
      "/talk-to/:request",
      function(request, response) {
        var customerId = request.params.request

        var bridge = baseBridge.forResponse(response)

        var meId = someoneIsAPerson.ensureMe(request, response)

        var room = rooms[customerId]

        var universe = room.defineOn(bridge)

        var socket = new SingleUseSocket(site)

        room.syncToSocket(socket)

        bride.domReady([
          customerId,
          socket.defineOn(bridge)],
          function(customerId, socket) {
            universe.syncToSocket(socket)
          })

        var blob = blobby(meId)

        bridge.send(blob)
      })

    site.addRoute(
      "get",
      "/",
      function(request, response) {
        var bridge = baseBridge.forResponse(response)

        var meId = someoneIsAPerson.ensureMe(request, response)

        var socket = new SingleUseSocket(site)

        var room = aWildUniverseAppeared(
          "room",{
          "blobby": "blobby"})

        var roomInBrowser = bridge.defineSingleton([
          bridgeModule(
            lib,
            "a-wild-universe-appeared",
            bridge)],
          function(aWildUniverseAppeared) {
            return aWildUniverseAppeared(
              "hi",{
              "blobby": "blobby"})
          })

        blobby.prepareBridge(
          baseBridge,
          roomInBrowser)

        room.syncToSocket(socket)

        var blob = blobby(bridge, meId)

        bridge.send(blob)
      })
  }
)
