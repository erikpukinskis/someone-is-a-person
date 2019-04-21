var library = require("module-library")(require)

module.exports = library.export(
  "blobby",[
  library.ref(),
  "web-element",
  "bridge-module",
  "./blobs.js"],
  function(lib, element, bridgeModule, blobs) {

    function blobby(bridge, someoneId) {

      var creatureOffset = element.style({
        "transform": "translate(100px, 100px)"})

      var thumbprint = element(
        ".blobby",
        creatureOffset,
        element(
          ".breathing.blobby-body",
          someoneId))

      var name = element(
        ".blobby-name",
        zs(),
        creatureOffset,
        "Erik")

      var el = element(
        ".blobby-container",
        thumbprint,
        name)

      var blob = blobs()

      bridge.domReady(
        bridgeModule(
          lib,
          "someone-is-a-person/blobs",
          bridge)
        .methodCall(
          "focusOnBlob")
        .withArgs(
          blob,
          el.assignId(),
          someoneId))

      return el}

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
        ".blobby-body",{
        "background": "lightgreen",
        "transition": "background 0.5s",
        "opacity": "0.7",
        "width": "1.4cm",
        "height": "1.5cm",
        "border-radius": "0.75cm"}),

      element.style(
        ".blobby-body.bobbing , .blobby-body.walking",{
          "background": "#fdcf27"}),

      element.style(
        ".blobby-name",{
        "width": "1.4cm",
        "text-align": "center",
        "line-height": "1cm",
        "color": "black",
        "font-weight": "bold"}),      
      ])

    function prepareBridge(bridge, roomOnBrowser) {
      if (bridge.remember("blobby")) {
        return }

      bridge.addToHead(stylesheet)

      var blobsOnBrowser = bridgeModule(
        lib,
        "someone-is-a-person/blobs",
        bridge)

      bridge.addBodyEvent(
        "onclick",
        blobsOnBrowser.methodCall("moveToHere").withArgs(roomOnBrowser, bridge.event).evalable())

      bridge.see("blobby", true)
    }

    blobby.prepareBridge = prepareBridge

    return blobby
  }
)
