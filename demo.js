var app = require("express")()
var someoneIsAPerson = require(".")
var BrowserBridge = require("browser-bridge")

someoneIsAPerson.prepareSite(app)

app.get("/demo", function(request, response) {

  var meId = someoneIsAPerson.getIdFrom(request)

  if (!meId) {
    someoneIsAPerson.getIdentityFrom(response, "/demo")

  } else {
    var bridge = new BrowserBridge()
    var avatar = someoneIsAPerson(bridge, meId)

    bridge
    .forResponse(response)
    .send(avatar.html())
  }

})

app.listen(3004)
console.log("http://localhost:3004/demo")