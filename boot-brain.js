var library = require("module-library")(require)

library.using(
  [library.ref(), "web-site", "web-element", "./brain", "browser-bridge", "bridge-module", "./animated-dots"],
  function(lib, WebSite, element, brain, BrowserBridge, bridgeModule, animatedDots) {

    var site = new WebSite()
    var bridge = new BrowserBridge()
    site.start(5550)

    var FRAME_LENGTH_IN_MS = brain.FRAME_LENGTH_IN_MS


    // Brain

    bridge.domReady([
      bridgeModule(lib, "./brain", bridge)],
      function(startBrain) {
        startBrain() })

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




    // I hope I never stop copy/pasting these type of thing around EZJS

    function dot(name, size, left, top) {
      return {
        name: name,
        size: size,
        left: left,
        top: top}}



    // Legs

    var legFrames = {

      "the reach": [
        dot("thigh-base", 10,-10,0),
        dot("thigh-mid", 10,-17,7),
        dot("thigh-end", 10,-24,14),
        dot("knee", 7, -30,23),
        dot("calf", 7, -36,29),
        dot("ankle", 7, -42,35),
        dot("heel", 7, -48,41),
        dot("toe", 7, -55,36),
      ],

      "the stand": [
        dot("thigh-base", 10,-10,0),
        dot("thigh-mid", 10,-10,11),
        dot("thigh-end", 10,-10,22),
        dot("knee", 7, -6,31),
        dot("calf", 7, -6,39),
        dot("ankle", 7, -6,47),
        dot("heel", 7, -7,50),
        dot("toe", 7, -14,50),
      ],

      "the hop": [
        dot("thigh-base", 10,-10,0),
        dot("thigh-mid", 10,-8,11),
        dot("thigh-end", 10,-6,22),
        dot("knee", 7, 1,32),
        dot("calf", 7, 6,38),
        dot("ankle", 7, 12,47),
        dot("heel", 7, 10,52),
        dot("toe", 7, 8,59),
      ],

      "the claw": [
        dot("thigh-base", 10,-11,0),
        dot("thigh-mid", 10,-22,0),
        dot("thigh-end", 10,-33,0),
        dot("knee", 7,-35, 13),
        dot("calf", 7,-26, 13),
        dot("ankle", 7,-17, 13),
        dot("heel", 7,-14, 15),
        dot("toe", 7,-14, 22),
      ],        
    }

    // This is a sign you are doing too much with the bridge and should do this in a module:

    function buildAnimationForBrowser(bridge, frameSingleton, el) {

      var animatableSingleton = bridge.defineSingleton(
        "animatable",[
        frameSingleton],
        function(frames) {
          return {
            node: null,
            frames: frames,
            rotation: 0,
            position: null}})

      bridge.addBodyEvent(
        "onkeydown",
        bridgeModule(
          lib,
          "animated-dots",
          bridge)
        .methodCall("rotate")
        .withArgs(
          animatableSingleton)
        .evalable())

      bridge.domReady(
        bridgeModule(
          lib,
          "animated-dots",
          bridge)
        .methodCall("startAnimation")
        .withArgs(animatableSingleton, el.assignId()))
      }



    // Movers

    var background = element(".background")
    var bod = element(".bod.gravity")

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


    var framesSingleton = bridge.defineSingleton(
      "legFrames",[
      legFrames],
      function(frames) {
        return frames })

    var el = animatedDots(legFrames)

    buildAnimationForBrowser(bridge, framesSingleton, el)

    var firstMover = element(
      ".mover.gravity",
      bod)

    page.addChildren(
      background,
      firstMover,
      el)

    var clock = element(".clock", "0", element.style({"font-family": "sans-serif"}))

    page.addChild(clock)

    animatedDots.prepareBridge(bridge)

    site.addRoute(
      "get",
      "/",
      bridge.requestHandler(page)
    )

  }
)






