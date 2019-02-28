var library = require("module-library")(require)

module.exports = library.export(
  "thought-to-leg",[
  "web-element"],
  function(element) {

    var legs = {
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
        top: top,
      }
    }

    function prepareBridge(bridge) {
      bridge.addToHead(stylesheet)
    }

    var stylesheet = element.stylesheet([
      element.style(
        ".dot",{
        "position": "absolute"}),
      element.style(
        ".leg",{
        "position": "relative"}),
      ])

    function thoughtToLeg(thought) {
      if (thought != "stance") {
        return }

      var els = legs["the claw"].map(
        function(dot) {
          if (dot.name == "heel" || dot.name == "toe") {
            var color = "cyan"
          } else {
            var color = "magenta"
          }
          return element(
            ".dot",
            ".dot-"+dot.name,
            element.style({
              "background": color,
              "width": dot.size+"px",
              "height": dot.size+"px",
              "left": dot.left+"px",
              "top": dot.top+"px"}))
        })

      return element(
        ".leg",
        els)
    }

    function animateLeg(legElementId) {
      var node = document.getElementById(legElementId)

      setInterval(nextLegPosition.bind(null, node), 250)
    }

    var position = "the claw"
    var rotation = 0
    var nextPositionAfter = {
      "the claw": "the reach",
      "the reach": "the stand",
      "the stand": "the hop",
      "the hop" : "the claw"}

    function nextLegPosition(legNode) {
      position = nextPositionAfter[position]
      setLegPosition(legNode)}

    function setLegPosition(legNode) {
      var newLeg = legs[position]

      var radians = rotation/180.0 * Math.PI

      var isFacingAway = Math.sin(rotation/180*Math.PI) < 0

      var results = newLeg.map(
        function(dot) {
          var legPart = legNode.querySelector(
            ".dot-"+dot.name)

          var midDotX = dot.left + dot.size/2

          if (midDotX > 1) {
            var negative = true
            midDotX *= -1
          } else {
            var negative = false
          }

          var newMidDotX = Math.cos(radians) * midDotX
          var z = Math.sin(radians) * midDotX

          if (negative) {
            newMidDotX *= -1
          }

          return {
            node: legPart,
            z: z,
            left: newMidDotX - dot.size/2,
            top: dot.top
          }
        })

      results.sort(function(a, b) {
        return a.z - b.z
      })

      if (!isFacingAway) {
        results = results.reverse()
      }

      results.forEach(function(result, i) {
        result.node.style["z-index"] = i
        result.node.style["left"] = result.left+"px"
        result.node.style["top"] = result.top+"px"
      })
    }

    function rotateLeg(legElementId) {
      rotation++
      var node = document.getElementById(legElementId)
      setLegPosition(node)}

    thoughtToLeg.animateLeg = animateLeg

    thoughtToLeg.rotateLeg = rotateLeg

    thoughtToLeg.prepareBridge = prepareBridge

    return thoughtToLeg
  })