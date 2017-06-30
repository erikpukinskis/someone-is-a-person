
var frame = 900


// Boot

var t = 0
setInterval(tick, frame)
var clock = document.querySelector(".clock")

function cellNode(height, slide) {
  return document.querySelector(".height-"+height+".slide-"+slide)
}

var y = 0


var key = {
  up: 38,
  down: 40,
  right: 39,
  left: 37,
}

document.querySelector("html").addEventListener('keydown', function(event){
  if (event.which == key.left) {
    console.log("left!")
  }
}, false);



var state = {
  right: "stance",
  left: "stance",
}


function tick() {
  if (t>50) {
    return
  }
  var bod = document.querySelector(".bod")
  var mover = document.querySelector(".mover")
  if (!mover) { console.log("no mover"); return }
    
  var right = cellNode(1,2)
  var left = cellNode(1,0)
  y += 0.25

  mover.style.transform = "translateY("+y+"em)"

  t++
  clock.innerHTML = t.toString()

  if ((t-1) % 8 == 1) {
    var background = document.querySelector(".background")
    background.style.transform = "translateY("+y+"em)"
  } 

  var legs = {
    left: left,
    right: right,
  }
    
  function lift(which) {
    legs[which].classList.remove(state[which])
    legs[which].classList.add("raised")
    console.log("adding raised to ", which)
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
    if (state[which] != "raised") {
      console.log("existing state on "+which+" is "+state[which])
      console.log("existing classes are "+legs[which].classList)
    }
    
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
  
  var mod = (t-1)%4+1

  switch(mod) {

  // step 0: Solid box below each leg, tap right
  // step 1: leg collapses
  // step 2: tap and hold right to give it strength, tap left
  // step 3: [has air]
  // step 4: tap and hold left to give it strength, tap right
  // step 4: [has air]
  // ... step 2 again
      
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



