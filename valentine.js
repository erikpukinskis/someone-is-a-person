var library = require("module-library")(require)

library.using(
  ["web-element", "web-host"],
  function(element, host) {


    var square = element.template(".square",
      element.style({
        "width": "40px",
        "height": "40px",
        "position": "absolute",
      }),
      function(styles) {
        if (styles.color && !styles["background-color"]) {
          styles["background-color"] = styles.color
        }
        this.appendStyles(styles)
      }
    )

    var colors = [
      "#ff2626",
      "#ff78c6",
      "#ef5858",
    ]

    host.onRequest(function(getBridge) {
      var bridge = getBridge()

      var random = []

      colors.forEach(function(color) {
        if (Math.random() > 0.5) {
          random.push(color)
        } else {
          random.unshift(color)
        }
      })

      var voxels = [
        square({
          "background": "#ff6300",
          "left": "100px", 
          "top": "100px",
          "transform": "rotate(45deg)",
        }),
        square({
          "background": "#ff10e8",
          "left": "83px", 
          "top": "85px",
          "transform": "rotate(45deg)",
        }),
        square({
          "background": "#ff0796",
          "left": "116px", 
          "top": "84px",
          "transform": "rotate(45deg)",
        }),
        square({
          "left": "100px", 
          "top": "89px",
          "color": "white",
          "width": "9px",
          "height": "6px",
          "transform": "rotate(45deg)",
        }),
        square({
          "left": "140px", 
          "top": "92px",
          "color": "white",
          "width": "12px",
          "height": "6px",
          "transform": "rotate(51deg)",
        }),
      ]
    


      bridge.send([voxels, element.stylesheet(square)])
    })

  }
)
