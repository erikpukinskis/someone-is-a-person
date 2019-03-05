var library = require("module-library")(require)

module.exports = library.export(
  "animated-dots",[
  library.ref(),
  "web-element"],
  function(lib, element) {

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

    function animatedDots(frames) {
      var position = Object.keys(frames)[0]
      var dots = frames[position]

      var els = dots.map(
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

    function startAnimation(animatedDots, animatable, elementId) {
      animatable.node = document.getElementById(
        elementId)
      if (!animatable.position) {
        animatable.position = Object.keys(animatable.frames)[0]
      }
      animatedDots.animateNode(
        animatable)}


    function animateNode(animatable) {
      setInterval(
        tickAnimation.bind(null, animatable),
        250)
    }

    function nextKey(currentKey, object) {
      var keys = Object.keys(object)
      var currentIndex = keys.indexOf(currentKey)
      if (currentIndex == keys.length - 1) {
        return keys[0]
      } else {
        return keys[currentIndex + 1]}}

    function tickAnimation(animatable) {
      var frames = Object.keys(animatable.frames)

      animatable.position = nextKey(
        animatable.position,
        animatable.frames)

      var dots = animatable.frames[animatable.position]

      setLegPosition(animatable.node, animatable.rotation, dots)  
    }

    function setLegPosition(legNode, rotation, dots) {
      var radians = rotation/180.0 * Math.PI
      var isFacingAway = Math.sin(radians) < 0

      var results = dots.map(
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

    function rotate(animatable) {
      animatable.rotation++ }

    animatedDots.startAnimation = startAnimation

    animatedDots.animateNode = animateNode

    animatedDots.prepareBridge = prepareBridge

    animatedDots.rotate = rotate

    return animatedDots
  })