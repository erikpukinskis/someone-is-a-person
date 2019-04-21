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
  "bridge-module",
  "creature"],
  function(lib, WebSite, BrowserBridge, basicStyles, blobby, someoneIsAPerson, SingleUseSocket, aWildUniverseAppeared, bridgeModule, creature) {

    var site = new WebSite()

    var baseBridge = new BrowserBridge()
    basicStyles.addTo(baseBridge)
    SingleUseSocket.installOn(site)
    someoneIsAPerson.prepareSite(site)

    site.start(process.env.PORT || 9000)

    var rooms = {}

    site.addRoute(
      "get",
      "/",
      function(request, response) {
        var bridge = baseBridge.forResponse(response)
        var meId = someoneIsAPerson.ensureMe(request, response)

        sendRoom(bridge, meId) })

    site.addRoute(
      "get",
      "/chat-to/:themId",
      function(request, response) {
        var bridge = baseBridge.forResponse(response)
        var meId = creature()
        var themId = request.params.themId

        sendRoom(bridge, meId, themId)})

      
    function sendRoom(bridge, meId, themId) {

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

      if (themId) {
        var room = rooms[themId]
        if (!room) {
          throw new Error("No room for them: "+themId)
        }
      } else {
        var room = aWildUniverseAppeared(
          "room",{
          "blobby": "blobby"})

        rooms[meId] = room
      }

      var aWildInBrowser = bridgeModule(
        lib,
        "a-wild-universe-appeared",
        bridge)

      var universeInBrowser = room.defineOn(bridge, aWildInBrowser)

      var socket = new SingleUseSocket(site)

      console.log("we are about to sync to the roomuniverse socket on the server. This ostensibly tells the universe that whatever comes out of that socket needs to get added to itself, and broadcasted to any other clients. It also means this client wants to get any updates onStatement of the universe.")
      debugger
      room.syncToSocket(socket)

      var blobs = []

      if (themId) {
        bridge.domReady([
          socket.defineListenOn(bridge),
          socket.defineSendOn(bridge),
          themId,
          universeInBrowser],
          function(listen, send, v, universe) {
            console.log("we have a customerId to do something with:", customerId, "... maybe filter the universe log based on it?")
            debugger
            universe.syncToSocket(listen, send)
          })
  
        var them = blobby(bridge, themId)
        blobs.push(them)
      }

      var blob = blobby(bridge, meId)
      blobs.push(blob)

      bridge.send(blobs)
    }


  }
)
