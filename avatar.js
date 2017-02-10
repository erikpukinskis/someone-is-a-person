var library = require("module-library")(require)

library.using(
  ["web-site", "web-element", "browser-bridge"],
  function(site, element, BrowserBridge) {
    site.start(4000)

    var bridge = new BrowserBridge()

    var torso = element.style(".torso", {
      "width": "2em",
      "height": "2em",
      "background": "red",
      "animation": "wobble 500ms infinite alternate",
      "animation-timing-function": "cubic-bezier(0.42,0.2,0.58,1)",
      "transform-origin": "center bottom",
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


    var body = [
      element(".track", element(".feet", element(".torso"))),
      element.stylesheet(torso, wobble, hop, feet, track, glide),
    ]

    site.addRoute("get", "/", bridge.requestHandler(body))
  }
)