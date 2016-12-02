var BrowserBridge = require("browser-bridge")
var library = require("module-library")(require)

library.define(
  "sms-person",
  ["plivo"],
  function(plivo) {
    function SmsPerson(number) {
      this.number = number
    }
    SmsPerson.prototype.send = function(message) {

    }
    return SmsPerson
  }
)

library.using(
  ["web-site", "sms-person", "browser-bridge", "web-element", "basic-styles"],
  function(site, SmsPerson, bridge, element, basicStyles, tellTheUniverse) {

    site.addRoute("post", "/buy-bonds",
      function(request, response) {
        var number = request.body.number
        var amount = request.body.amount
        var name = request.body.name

        tellTheUniverse(
          "requestBond",
          {
            name: name,
            number: number,
            amount: amount,
          }
        )

        var me = new SmsPerson(process.env.NUM)

        me.send("Request $"+amount+" from "+number+" ("+name+")")

        resonse.send("We'll get back to you via text.")
      }
    )

    var pitch = element([
      element("h1", "Teensy House 3 Construction Bond"),
      element("p", "Purchase a bond and receive back the bond value plus 6%."),
      element("p", "Bond to be repaid on or before February 1, 2017"),
    ])

    var form = element("form", {method: "post", action: "/buy-bonds"}, [
      element("input.amount", {type: "hidden", name: "amount"}),
      element("label", {for: "name"}, "We just need your name"),
      element("input", {type: "text", name: "name", placeholder: "Your name here"}),
      element("label", {for: "number"}, "and phone number."),
      element("input", {type: "text", name: "number", placeholder: "555-555-5555"}),
      element("input", {type: "submit", name: "buy-10", value: "Buy $10 Bond"}),
      element("input", {type: "submit", name: "buy-1000", value: "Buy $1000 Bond"}),
    ])

    var bridge = new BrowserBridge()

    site.addRoute("get", "/", bridge.sendPage([pitch, basicStyles, form]))

    site.start(4441)
  }
)
