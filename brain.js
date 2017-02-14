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
      "transform-origin": "2em 4em",
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

          function cell(height, slide) {
            return document.querySelector(".height-"+height+".slide-"+slide)
          }


          function tick() {
            var bod = document.querySelector(".bod")
            var right = cell(1,2)
            var left = cell(1,0)

            t++
            clock.innerHTML = t.toString()

            if (t==5) { t = 1 }
            switch(t) {
            case 1:
              left.classList.remove("power")
              left.classList.add("stance")
              right.classList.remove("stance")
              right.classList.add("raised")
              bod.style.transform = "rotate(20deg)"
              bod.style["transform-origin"] = "2em 4em"
            break;
            case 2:
              right.classList.remove("raised")
              right.classList.add("power")
              right.style.transform = "scaleY(1.0)"
              bod.style.transform = "rotate(0deg)"
            break;
            case 3:
              left.classList.remove("stance")
              left.classList.add("raised")
              bod.style["transform-origin"] = "4em 4em"
              bod.style.transform = "rotate(-20deg)"
            break;
            case 4:
              left.classList.remove("raised")
              left.classList.add("power")
              right.classList.remove("power")
              right.classList.add("stance")
              bod.style.transform = "rotate(0deg)"
            break;
            }
          }
        }
      )

      bridge.send([element(".clock", "0", element.style({"font-family": "sans-serif"})), page])

    })

  }
)