var BrowserBridge = require("browser-bridge")
var library = require("module-library")(require)

library.using(
  ["web-site", "phone-number", "browser-bridge", "web-element", "basic-styles"],
  function(site, phoneNumber, bridge, element, basicStyles, tellTheUniverse) {

    var pitch = element([
      element("h1", "Teensy House 3 Construction Bond"),
      element("p", "Purchase a bond and receive back the bond value plus 6%."),
      element("p", "Bond to be repaid on or before February 1, 2017"),
    ])

    var form = element("form", {method: "post", action: "/buy-bonds"}, [
      element("label", {for: "name"}, "We just need your name"),
      element("input", {type: "text", name: "name", placeholder: "Your name here"}),
      element("label", {for: "number"}, "and phone number."),
      element("input", {type: "text", name: "number", placeholder: "555-555-5555"}),
      element("input", {type: "submit", name: "buy10", value: "Buy $10 Bond"}),
      element("input", {type: "submit", name: "buy1000", value: "Buy $1000 Bond"}),
    ])

    var bridge = new BrowserBridge()

    site.addRoute("get", "/", bridge.sendPage([pitch, basicStyles, form]))

    site.addRoute("post", "/buy-bonds",
      function(request, response) {
        var number = request.body.number
        var name = request.body.name

        if (typeof request.body.buy10 == "string") {
          var amount = "10.00"
        } else if (typeof request.body.buy1000 == "string") {
          var amount = "1000.00"
        }

        var me = phoneNumber(process.env.NUM)

        var toDo = "Request $"+amount+" from "+number+" ("+name+")"

        me.send(toDo, function() {
          tellTheUniverse(
            "someone-requested-a-bond",
            {
              for: "teensy-house-3",
              received: process.env.NUM,
              name: name,
              number: number,
              amount: amount,
            }
          )
          
          response.send("We'll get back to you via text.")
        })
      }
    )

    site.start(4441)
  }
)
