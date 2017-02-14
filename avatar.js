var library = require("module-library")(require)


// tick 3: tilt right
// tick 4: rotate forward right foot forward (allowed since it is off ground)
// moves center of gravity forward
// tick 5: tilt forward
// (momentum forward, right)
// tick 6: when right center of gravity is as far forward as foot, touch to ground, to the right of center of gravity
// tick 7: we are leaning slightly forward
// tick 8: down force on right foot = cancels right rotation, accelerates forward
// lift left foot (back to tick 2, but flipped)

// controls: lift right, touch right, force right, lift left, touch left, force left







library.using(
  ["web-site", "web-element", "browser-bridge", "basic-styles"],
  function(site, element, BrowserBridge, basicStyles) {
    site.start(4000)

    var bridge = new BrowserBridge()
    basicStyles.addTo(bridge)

    var torso = element.style(".torso", {
      "width": "2em",
      "height": "2em",
      "background": "red",
      // "animation": "wobble 500ms infinite alternate",
      // "animation-timing-function": "cubic-bezier(0.42,0.2,0.58,1)",
      // "transform-origin": "center bottom",
    })

    var wobble = 
      "\n\n@keyframes wobble {\n"+
      "  from {transform: rotate(-20deg) translateX(-1em);}\n"+
      "  to {transform: rotate(20deg) translateX(1em);}\n"+
      "}"

    var feet = element.style(".feet", {
      "animation": "hop 500ms infinite alternate",
      "animation-timing-function": "cubic-bezier(0.42,0.2,0.58,1)",
      "animation-delay": "250ms",
    })

    var hop = 
      "\n\n@keyframes hop {\n"+
      "  0% {transform: translateY(0);}\n"+
      "  50% {transform: translateY(1em);}\n"+
      "  100% {transform: translateY(0);\n}"+
      "}"

     var track = element.style(".track", {
      "animation": "glide 10s infinite alternate ease-in-out",
    })

    var glide = 
      "\n\n@keyframes glide {\n"+
      "  from {transform: translate(4em, 4em); }\n"+
      "  to {transform: translate(40em, 40em);}\n"+
      "}"


// tick 1: two feet on ground
// pivot is between two feet, on ground
// center of gravity on ground
// tick 2: lift right foot
// pivot shifts to left foot
// center of gravity lifts up to height of left foot

    var tick = bridge.defineFunction(function(t) {
      var rightLeg = document.querySelector(".right-leg")
  
      switch(t) {
        case 1:
        break;
        case 2:
          rightLeg.style.height = "1em"
          break;
        case 3:
        break;
        case 4:
        break;
      }
    })

    var ticks = element([
      element(".button", "1", {onclick: tick.withArgs(1).evalable()}),
      element(".button", "2", {onclick: tick.withArgs(2).evalable()}),
      element(".button", "3", {onclick: tick.withArgs(3).evalable()}),
      element(".button", "4", {onclick: tick.withArgs(4).evalable()}),
    ])


    var body = element(
      element.style({width: "2em", height: "4em", "white-space": "nowrap", position: "relative"}),
      [
        element(".torso"),
        element(".leg.right-leg", element.style({
          position: "absolute",
          right: "0",
          width: "0.5em",
          height: "2em",
          background: "blue"
        })),
        element(".leg.left-leg", element.style({
          position: "absolute",
          left: "0",
          width: "0.5em",
          height: "2em",
          background: "blue",
          display: "inline-block",
        })),
      ]
    )




    var page = [
      ticks,
      body,
      element.stylesheet(torso, wobble, hop, feet, track, glide),
    ]

    site.addRoute("get", "/", bridge.requestHandler(page))
  }
)