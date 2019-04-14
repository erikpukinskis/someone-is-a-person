var library = require("module-library")(require)

module.exports = library.export(
  "blobby",[
  "web-element"],
  function(element) {

    function blobby(someoneId) {

      var bod = element(
        ".breathing.blobby", someoneId)

      var creatureOffset = element.style({
        "transform": "translate(100px, 100px)"})

      var thumbprint = element(
        ".creature",
        creatureOffset,
        element(
          ".creature-body",
          bod))

      var name = element(
        ".name",
        zs(),
        creatureOffset,
        "Erik")

      var blob = [
        thumbprint,
        name]

      return blob}

    var zs = element.template(
      ".zs",
      function() {
        for(var i=0; i<5; i++) {
          var style = element.style({
            "animation-delay": i+"s"})
          this.addChild(
            element(
              ".z",
              "z",
              style))}
        })

    var awake = element.style(
      ".awake .zs",{
        "display": "none"})

    var zStyle = element.style(
      ".zs",{
      "position": "relative",
      "overflow": "hidden",
      "width": "100px",
      "height": "73px",
      "display": "inline-block",
      "padding-left": "20px",
      "margin-right": "-120px",
      "margin-top": "-100px",

      " .z": {
        "opacity": "0",
        "position": "absolute",
        "bottom": "0",
        "animation-name": "float-up",
        "animation-duration": "5s",
        "animation-iteration-count": "infinite"},
      })

    var floatUp = element.style(
      "@keyframes float-up",{
      "from": {
        "transform": "translate(0px,0px)",
        "animation-timing-function": "ease-out",
        "opacity": "0"},
      "10%": {
        "transform": "translate(5px,-5px)",
        "animation-timing-funasction": "ease-in"},
      "20%": {
        "transform": "translate(0px,-10px)",
        "animation-timing-function": "ease-out"},
      "30%": {
        "transform": "translate(-5px,-15px)",
        "animation-timing-function": "ease-in"},
      "40%": {
        "transform": "translate(0px,-20px)",
        "animation-timing-function": "ease-out"},
      "50%": {
        "transform": "translate(5px,-25px)",
        "animation-timing-function": "ease-in",
        "opacity": "1"},
      "60%": {
        "transform": "translate(0px,-30px)",
        "animation-timing-function": "ease-out"},
      "70%": {
        "transform": "translate(-5px,-35px)",
        "animation-timing-function": "ease-in"},
      "80%": {
        "transform": "translate(0px,-40px)",
        "animation-timing-function": "ease-out"},
      "90%": {
        "transform": "translate(5px,-45px)",
        "animation-timing-function": "ease-in"},
      "to": {
        "transform": "translate(0px,50px)",
        "opacity": "0"},  
      })

    var stylesheet = element.stylesheet([

      zStyle,
      awake,
      floatUp,


      element.style(
        "html",{
        "height": "100%"}),

      element.style(
        "body",{
        "cursor": "pointer",
        "margin": "0",
        "min-height": "100%"}),

      element.style(
        ".breathing",{
        "animation-name": "breathing",
        "animation-duration": "5s",
        "animation-iteration-count": "infinite",
        "transform-origin": "50% 100%",
      }),

      element.style(
        "@keyframes breathing",{
        "from": {
          "transform": "scale(1)",
          "animation-timing-function": "ease-out"
        },
        "33%": {
          "transform": "scale(1.15)",
          "animation-timing-function": "ease-in"},
        "66%": {
          "transform": "scale(1.075)",
          "animation-timing-function": "linear"},
        "to": {
          "transform": "scale(1)"},
        }), 

      element.style(
        "@keyframes high-wiggle",{
        "from": {
          "transform": "translateX(0px)",
          "animation-timing-function": "ease-out"
        },
        "33%": {
          "transform": "translateX(2px)",
          "animation-timing-function": "ease-in"},
        "66%": {
          "transform": "translateX(1px))",
          "animation-timing-function": "linear"},
        "to": {
          "transform": "tranlateX(0px)"},
        }), 

      element.style(
        ".bobbing",{
        "animation-name": "bobbing",
        "animation-duration": "0.75s",
        "animation-iteration-count": "infinite"}),
      element.style(
        "@keyframes bobbing",{
        "from": {
          "transform": "translateY(-4px)",
          "animation-timing-function": "ease-out"},
        "50%": {
          "transform": "translateY(0)",
          "animation-timing-function": "ease-in"},
        "to": {
          "transform": "translateY(-4px)"},
        }),

      // OK, this is crappy because the movement doesn't match at all with the coarse movement.

      element.style(
        ".walking",{
        "animation-name": "walking",
        "animation-duration": "0.75s",
        "animation-iteration-count": "infinite"}),
      element.style(
        "@keyframes walking",{
        "from": {
          "transform": "translateY(-12px)",
          "animation-timing-function": "ease-in"},
        "25%": {
          "transform": "translateY(0px) translateX(0px)",
          "animation-timing-function": "ease-out"},
        "50%": {
          "transform": "translateY(-12px)",
          "animation-timing-function": "ease-in"},
        "75%": {
          "transform": "translateY(0px)",
          "animation-timing-function": "ease-out"},
        "to": {
          "transform": "translateY(-12px)"},
        }),

      element.style(
        ".blobby",{
        "background": "lightgreen",
        "transition": "background 0.5s",
        "opacity": "0.7",
        "width": "1.4cm",
        "height": "1.5cm",
        "border-radius": "0.75cm"}),

      element.style(
        ".bobbing .blobby, .walking .blobby",{
          "background": "#fdcf27"}),

      element.style(
        ".name",{
          "width": "1.4cm",
          "text-align": "center",
          "line-height": "1cm",
          "color": "black",
          "font-weight": "bold"}),      
      ])

    function prepareBridge(bridge) {
      if (bridge.remember("blobby")) {
        return }

      bridge.addToHead(stylesheet)

      var awakeCall = bridge.defineFunction(
        toggleAwake)

      var moveCall = bridge.defineFunction([awakeCall],
        moveToHere)

      var creature = bridge.defineSingleton(
        buildCreature)

      bridge.addBodyEvent(
        "onclick",
        moveCall.withArgs(creature, bridge.event).evalable())

      bridge.see("blobby", true)
    }

    function moveToHere(toggleAwake, creature, event) {
      var x = event.clientX
      var y = event.clientY
      var dx = creature.x - x
      var dy = creature.y - y
      dx = Math.round(dx / 100)*100
      dy = Math.round(dy / 100)*100

      if (dx == 0 && dy == 0) {
        toggleAwake(creature)
        return
      }

      creature.x = x
      creature.y = y

      var distance = Math.sqrt(dx*dx + dy*dy)

      var time = distance/200

      creature.load()

      creature.bodyEl.classList.remove("bobbing")
      creature.bodyEl.classList.add("walking")
      creature.nameEl.classList.add("awake")

      creature.nameEl.style["transition"] = "opacity 0.2s"
      creature.nameEl.style["opacity"] = "0"

      if (creature.timeout) {
        clearTimeout(creature.timeout)}

      var ms = Math.ceil(time*1000)

      var transform = "translateX("+(x-20)+"px) translateY("+(y-20)+"px)"

      creature.timeout = setTimeout(
        function() {
          creature.bodyEl.classList.remove("walking")
          creature.bodyEl.classList.add("bobbing")
          creature.nameEl.style.transform = transform
          creature.nameEl.style["transition"] = "opacity 2s"
          creature.nameEl.style["opacity"] = "1"
        }, ms)


      creature.el.style["transition"] = "transform "+time+"s cubic-bezier(0.19, 0, 0.58, 1)"
      creature.el.style.transform = transform
    }

    function toggleAwake(creature) {
      creature.load()
      if (creature.isAwake) {
        creature.bodyEl.classList.remove("bobbing")
        creature.nameEl.classList.remove("awake")
        creature.isAwake = false
      } else {
        creature.bodyEl.classList.add("bobbing")
        creature.nameEl.classList.add("awake")
        creature.isAwake = true
      }
    }

    function buildCreature() {
      var me = {
        isAwake: true,
        x: 100,
        y: 100}

      function load() {
        if (this.el) {
          return }
        this.el = document.querySelector(
          ".creature")
        this.bodyEl = this.el.querySelector(
          ".creature-body")
        this.nameEl = document.querySelector(".name")}

      me.load = load.bind(me)

      return me
    }

    blobby.prepareBridge = prepareBridge

    return blobby
  }
)
