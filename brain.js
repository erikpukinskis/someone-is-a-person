var library = require("module-library")(require)

library.using(
  ["web-host", "web-element"],
  function(host, element) {

    var rowStyle = element.style(".row", {
    })

    var cell = element.template(
      ".cell",
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
      "transition": "2s",
      "transition-timing-function": " cubic-bezier(0.310, 0.440, 0.445, 1.650)",
    })

    var bodyStyle = element.style(".bod", {
      "transform-origin": "0em 4em",
      "transition": "2s",
      "transition-timing-function": " cubic-bezier(0.310, 0.440, 0.445, 1.650)",
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
      element.stylesheet(rowStyle, cell, stance, raised, powerStyle, bodyStyle)
    )


    var background = element(".background")
    var body = element(".bod")

    for(var height=0; height<brain.length; height++) {

      for(var slide=0; slide<brain[0].length; slide++) {
        var thought = brain[height][slide]
        var neuron = cell(height, slide, thought)

        if (thought == "stance") {
          body.addChild(neuron)
        } else {
          background.addChild(neuron)
        }
      }
    }

    page.addChildren(background, body)




    host.onRequest(function(getBridge) {

      var bridge = getBridge()

      bridge.asap(
        [brain],
        function(brain) {
          var t = 0
          setInterval(tick, 1000)
          var clock = document.querySelector(".clock")
          var foot = cell(1,2)
          var bod = document.querySelector(".bod")

          function cell(height, slide) {
            return document.querySelector(".height-"+height+".slide-"+slide)
          }


          function tick() {
            t++
            clock.innerHTML = t.toString()
            switch(t) {
            case 1:
              foot.classList.remove("stance")
              foot.classList.add("raised")
              bod.style.transform = "rotate(20deg)"
            break;
            case 2:
              foot.classList.remove("raised")
              foot.classList.add("power")
              foot.style.transform = "scaleY(1.0)"
              bod.style.transform = "rotate(0deg)"
            break;
            default:
            break;
            }
          }
        }
      )

      bridge.send([element(".clock", "0", element.style({"font-family": "sans-serif"})), page])

    })

  }
)