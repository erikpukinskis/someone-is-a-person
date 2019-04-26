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

        sendRoom(bridge, themId, meId)})

      
    function sendRoom(bridge, meId, observerId) {

      var room = rooms[meId]

      if (!room) {
        console.log("setting up a room for the browser...")
        var room = aWildUniverseAppeared(
          "room-for-talking-to-"+meId,{
          "blobby": "blobby"})

        rooms[meId] = room
      } else {
        console.log("found a room for "+meId)
      }

      var aWildInBrowser = bridgeModule(
        lib,
        "a-wild-universe-appeared",
        bridge)

      var universeInBrowser = room.defineOn(bridge, aWildInBrowser)

      blobby.prepareBridge(
        bridge,
        universeInBrowser)

      var socket = new SingleUseSocket(site)

      console.log("We are about to tell the room universe to sync to a newly created socket.\n")
      debugger
      room.syncToSocket(socket, andRebroadcast)

      var blobs = []

      bridge.domReady([
        socket.defineListenOn(bridge),
        socket.defineSendOn(bridge),
        universeInBrowser],
        function(listen, send, universe) {
          console.log("Syncing universe to socket listen and send on client")
          debugger
          var fakeSocket = {
            listen: listen,
            send: send }
          universe.syncToSocket(fakeSocket, andBackfillOnly)

          function andBackfillOnly(senderId, universe, data) {
            console.log("// 3")
            debugger
            data = JSON.parse(data)
            var functionIdentifier = data.functionIdentifier
            var args = data.args            
            universe.do(functionIdentifier, args)
          }
        })
  
      var blob = blobby(bridge, meId)
      blobs.push(blob)

      if (observerId) {
        var observer = blobby(bridge, observerId)
        blobs.push(observer)
      }

      console.log("sending blobs to bridge!")
      bridge.send(blobs)
    }

    function andRebroadcast (senderId, universe, data) {
      console.log("// 2")
      console.log("did get a message on the server. Should backfill and broadcast")
      debugger

      data = JSON.parse(data)
      var functionIdentifier = data.functionIdentifier
      var args = data.args

      universe.do(functionIdentifier, args)
      universe.broadcast()
    }


    // end of demo
  }
)
