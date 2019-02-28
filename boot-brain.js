var library = require("module-library")(require)

library.using(
  [library.ref(), "web-site", "web-element", "./brain", "browser-bridge", "bridge-module", "./animated-dots"],
  function(lib, WebSite, element, brain, BrowserBridge, bridgeModule, animatedDots) {

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

    var frames = {
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
      ]
    }

    function dot(name, size, left, top) {
      return {
        name: name,
        size: size,
        left: left,
        top: top}}

    var demoLeg = animatedDots(frames)

    var frameSingleton = bridge.defineSingleton(
      "legFrames",[
      frames],
      function(frames) {
        return frames })

    var animatableSingleton = bridge.defineSingleton(
      "demoLeg",[
      frameSingleton],
      function(frames) {
        return {
          node: null,
          frames: frames,
          rotation: 0,
          position: null}})

    bridge.domReady([
      bridgeModule(
        lib,
        "./animated-dots",
        bridge),
      animatableSingleton,
      demoLeg.assignId()],
      function(animatedDots, animatable, elementId) {
        animatable.node = document.getElementById(
          elementId)
        if (!animatable.position) {
          animatable.position = Object.keys(animatable.frames)[0]
        }
        animatedDots.animateNode(
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

    animatedDots.prepareBridge(bridge)

    site.addRoute(
      "get",
      "/",
      bridge.requestHandler(body)
    )

  }
)






