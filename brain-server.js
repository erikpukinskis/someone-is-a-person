var library = require("module-library")(require)

library.using(
  ["web-site", "web-element"],
  function(WebSite, element) {

    var site = new WebSite()
    var FRAME_LENGTH_IN_MS = 200

    site.addRoute(
      "get",
      "/",
      function(x, response) {
        response.send(page.html())
      }
    )

    site.addRoute(
      "get",
      "/brain.js",
      site.sendFile(__dirname, "brain.js")
    )

    site.start(5550)

    var rowStyle = element.style(".row", {
    })

    var cell = element.template(
      ".cell.gravity",
      element.style({
        "display": "block",
        "position": "absolute",
        "width": "2em",
        "height": "2em",
        "background": "#eee",
      }),
      function(height, slide, thought) {

        this.appendStyles({
          "left": slide*2+"em",
          "top": height*2+"em",
          "transform-origin": slide*2+"em "+height*2+"em",
        })

        this.addSelector(".height-"+height+".slide-"+slide)

        if (thought == "stance") {
          this.addSelector(".stance")
        }
      }
    )


    var stance = element.style(".stance", {
      "background": "cyan",
    })

    var raised = element.style(".cell.raised", {
      "background": "transparent",
      "box-sizing": "border-box",
      "border": "2px solid cyan",
      "height": "1em",
      "vertical-align": "top",
    })

    var powerStyle = element.style(".cell.power", {
      "background": "black",
      "transition": "height "+FRAME_LENGTH_IN_MS+"ms"
    })

    var base
    var gravityStyle = element.style(".gravity", {
      "transition": "transform "+FRAME_LENGTH_IN_MS+"ms",
      "transition-timing-function": "ease-out", // http://stackoverflow.com/a/15427614/778946
    })

    var bodyStyle = element.style(".bod", {
      "transform-origin": "2em 4em",
    })



    // Brain

    var brain = [
      [null,"stance",null,null],
      ["stance",null,"stance",null],
    ]

    var highs = brain[0]
    var lows = brain[1]

    var page = element(".page",
      element.style({
        "position": "absolute",
        "left": "5em",
        "top": "5em",
      }),
      element.stylesheet(rowStyle, cell, gravityStyle, stance, raised, powerStyle, bodyStyle)
    )


    var background = element(".background")
    var body = element(".bod.gravity")

    for(var height=0; height<brain.length; height++) {

      for(var slide=0; slide<brain[0].length; slide++) {
        var thought = brain[height][slide]
        var neuron = cell(height, slide, thought)

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

    page.addChild(element("script", {src: "brain.js"}))

  }
)






