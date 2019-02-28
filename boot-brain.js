var library = require("module-library")(require)

library.using(
  [library.ref(), "web-site", "web-element", "./brain", "browser-bridge", "bridge-module", "./thought-to-leg"],
  function(lib, WebSite, element, brain, BrowserBridge, bridgeModule, thoughtToLeg) {

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
      [null,"hips",null,null],
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
    var bod = element(".bod.gravity")

    var demoLeg = thoughtToLeg("stance")

    var animatableSingleton = bridge.defineSingleton(
      "demoLeg",
      function() {
        return {
          node: null,
          rotation: 0,
          position: "the claw"}})

    bridge.domReady([
      bridgeModule(
        lib,
        "./thought-to-leg",
        bridge),
      animatableSingleton,
      demoLeg.assignId()],
      function(thoughtToLeg, animatable, elementId) {
        animatable.node = document.getElementById(
          elementId)
        thoughtToLeg.animateNode(
          animatable)})

    page.addChild(demoLeg)

    var rotateLeg = bridge.defineFunction([
      animatableSingleton],
      function(animatable) {
        animatable.rotation++ })

    var body = element("body",{
      onkeydown: rotateLeg.evalable()},
      page)

    for(var height=0; height<brainCells.length; height++) {

      for(var slide=0; slide<brainCells[0].length; slide++) {
        var thought = brainCells[height][slide]
        var neuron = brain.cell(height, slide, thought)

        if (thought == "stance" || thought == "hips") {
          // if (height == 1) {
          //   neuron.appendStyles({visibility: "hidden"})
          // }
          bod.addChild(neuron)
        } else {
          background.addChild(neuron)
        }
      }
    }

    page.addChildren(
      background,
      element(
        ".mover.gravity",
        bod))

    var clock = element(".clock", "0", element.style({"font-family": "sans-serif"}))

    page.addChild(clock)

    thoughtToLeg.prepareBridge(bridge)

    site.addRoute(
      "get",
      "/",
      bridge.requestHandler(body)
    )

  }
)






