var library = require("module-library")(require)

library.using(
  [library.ref(), "web-site", "web-element", "./brain", "browser-bridge", "bridge-module"],
  function(lib, WebSite, element, brain, BrowserBridge, bridgeModule) {

    var site = new WebSite()
    var bridge = new BrowserBridge()
    site.start(5550)

    var FRAME_LENGTH_IN_MS = brain.FRAME_LENGTH_IN_MS

    bridge.domReady([
      bridgeModule(lib, "./brain", bridge)],
      function(startBrain) {
        startBrain() })

    // Brain

    var brainCells = [
      [null,"stance",null,null],
      ["stance",null,"stance",null],
    ]

    var highs = brainCells[0]
    var lows = brainCells[1]

    var page = element(".page",
      element.style({
        "position": "absolute",
        "left": "5em",
        "top": "5em",
      }),
    )

    brain.prepareBridge(bridge)

    var background = element(".background")
    var body = element(".bod.gravity")

    for(var height=0; height<brainCells.length; height++) {

      for(var slide=0; slide<brainCells[0].length; slide++) {
        var thought = brainCells[height][slide]
        var neuron = brain.cell(height, slide, thought)

        if (thought == "stance") {
          // if (height == 1) {
          //   neuron.appendStyles({visibility: "hidden"})
          // }
          body.addChild(neuron)
        } else {
          background.addChild(neuron)
        }
      }
    }

    page.addChildren(background, element(".mover.gravity", body))

    var clock = element(".clock", "0", element.style({"font-family": "sans-serif"}))

    page.addChild(clock)

    site.addRoute(
      "get",
      "/",
      bridge.requestHandler(page)
    )

  }
)






