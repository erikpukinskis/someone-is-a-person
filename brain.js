
var library = require("module-library")(require)

module.exports = library.export(
  "someone-is-a-person/brain",[
  "web-element"],
  function(element) {

    var FRAME_LENGTH_IN_MS = 2000



    function backlog() {}

    // I am smoking so much and it does very little

    // I did get tobacco (for free!) but it's still very true that I think this pot has run its course for me.

    // It's worth noting that this is a week

    // I should ask Marie in the future for a week not a day. It's traumatic for her

    // But in lieu of cannabis, I have decided to solve programming problems:


    backlog("someone-is-a-person",[
      "walk cycle will stretch to other nearby squares if you click them",
      "Paint your head",
      "Paint your body (choose one color)",
      "Pants can have multiple segments (max 3), but they are only posed once per frame",
      "Choose your legs",
      "Skinny jeans",
      "Baggy blues",
      "Naked",
      ])






    // Templates

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


    var rowStyle = element.style(".row", {
    })




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

    var gravityStyle = element.style(".gravity", {
      "transition": "transform "+FRAME_LENGTH_IN_MS+"ms",
      "transition-timing-function": "ease-in", // http://stackoverflow.com/a/15427614/778946
    })

    var bodyStyle = element.style(".bod", {
      "transform-origin": "2em 4em",
    })










    // Original Brain Boot Stuff

    var clock
    var state
    var bod
    var mover
    var right
    var left
    var t
    var legs
    var y

    function brain(node) {
      state = {
        right: "stance",
        left: "stance",
      }
      t = 0
      y = 0

      clock = document.querySelector(".clock")

      document.querySelector("html").addEventListener('keydown', function(event){
        if (event.key == "ArrowLeft") {
          console.log("left!")
        }
      }, false);

      setTimeout(function() {
        bod = document.querySelector(".bod")
        mover = document.querySelector(".mover")
        if (!mover) { console.log("no mover"); return }

        legs = {
          left: cellNode(1,0),
          right: cellNode(1,2),
        }
        
        setInterval(tick, FRAME_LENGTH_IN_MS)
      })

    }

    function cellNode(height, slide) {
      return document.querySelector(".height-"+height+".slide-"+slide)
    }

    function lift(which) {
      legs[which].classList.remove(state[which])
      legs[which].classList.add("raised")
      state[which] = "raised"
      if (which == "right") {
        bod.style["transform-origin"] = "2em 4em"
        bod.style.transform = "rotate(20deg) translateY(0em)"
      } else {
        bod.style["transform-origin"] = "4em 4em"
        bod.style.transform = "rotate(-20deg) translateY(0em)"
      }
    }

    function power(which) {
      legs[which].classList.remove("raised")
      legs[which].classList.add("power")
      state[which] = "power"

      var other = which == "right" ? "left" : "right"
      legs[other].classList.remove("power")
      legs[other].classList.add("stance")
      state[other] = "stance"

      legs[which].style.transform = "scaleY(1.0)"
      bod.style.transform = "rotate(0deg) translateY(-0.3em)"
    }



    // step 0: Solid box below each leg, tap right
    // step 1: leg collapses
    // step 2: tap and hold right to give it strength, tap left
    // step 3: [has air]
    // step 4: tap and hold left to give it strength, tap right
    // step 4: [has air]
    // ... step 2 again


    function tick() {
      if (t>50) {
        return
      }

      y += 0.25

      mover.style.transform = "translateY("+y+"em)"

      t++
      clock.innerHTML = t.toString()

      if ((t-1) % 8 == 1) {
        var background = document.querySelector(".background")
        background.style.transform = "translateY("+y+"em)"
      } 
      
      var mod = (t-1)%4+1

      switch(mod) {
          
      case 1:
        lift("right")
      break;
      case 2:
        power("right")
      break;
      case 3:
        lift("left")
      break;
      case 4:
        power("left")
      break;
      }
    }

    brain.FRAME_LENGTH_IN_MS = FRAME_LENGTH_IN_MS

    brain.addTo = function(bridge){
      if (bridge.remember("someone-is-a-person/brain")) {
        return }

      bridge.addToHead(
        element.stylesheet(rowStyle, cell, gravityStyle, stance, raised, powerStyle, bodyStyle))

      bridge.see("someone-is-a-person/brain", true)
    }

    brain.cell = cell
    
    return brain
  })
