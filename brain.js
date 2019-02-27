
var library = require("module-library")(require)

module.exports = library.export(
  "someone-is-a-person/brain",[
  "web-element",
  "./thought-to-leg"],
  function(element, thoughtToLeg) {

    var FRAME_LENGTH_IN_MS = 500





    function backlog() {}
    backlog.done = function(){}


    backlog.done(
      "Draw 4 frames of walk")

    // I am smoking so much and it does very little

    // I did get tobacco (for free!) but it's still very true that I think this pot has run its course for me.

    // It's worth noting that this is a week

    // I should ask Marie in the future for a week not a day. It's traumatic for her

    // But in lieu of cannabis, I have decided to solve programming problems:

    backlog("brain",[
      "voxel moves forward twice as often",
      "draw leftwards legs",
      "code leftward legs as squares",

      "squash leftward legs frontward",
      "any rotation",

      "walk cycle will stretch to other nearby squares if you click them",
      // slider for how tight the knee gets
      // slider for how loose the drop off frame is
      ])


    backlog("chickens",[
      // Chicken wakes up

      // Chicken can try random directions

      // You see food ahead

      // You click in a direction, the chicken just lunges

      // You click near its feet, the chicken takes a step

      // You click left right left right left

      // The chicken gets a food

      // The chicken has a positive memory: left right left right left

      // The chicken will now loop between random, and that nice memory

      // Now it is going in every direction but not staying near the food

      // It feels frustration

      // You make it turn around and go to the food

      // Now it remembers frustration, left left left right left right left

      // Old memories die
    ])


    backlog("someone-is-a-person",[
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


        var leg = thoughtToLeg(thought)

        if (leg) {
          this.addChild(leg)
          debugger}

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



    var stylesheet = element.stylesheet([
      cell,

      element.style(".row", {
        }),

      element.style(".stance", {
        "background": "cyan",
      }),

      element.style(".cell.raised", {
        "background": "transparent",
        "box-sizing": "border-box",
        "border": "2px solid cyan",
        "height": "1em",
        "vertical-align": "top",
      }),

      element.style(".cell.power", {
        "background": "black",
        "transition": "height "+FRAME_LENGTH_IN_MS+"ms"
      }),

      element.style(".gravity", {
        "transition": "transform "+FRAME_LENGTH_IN_MS+"ms",
        "transition-timing-function": "ease-in", // http://stackoverflow.com/a/15427614/778946
      }),

      element.style(".bod", {
        "transform-origin": "2em 4em",
      }),
    ])



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

    brain.prepareBridge = function(bridge){
      if (bridge.remember("someone-is-a-person/brain")) {
        return }

      thoughtToLeg.prepareBridge(bridge)

      bridge.addToHead(stylesheet)

      bridge.see("someone-is-a-person/brain", true)
    }

    brain.cell = cell

    return brain
  })
