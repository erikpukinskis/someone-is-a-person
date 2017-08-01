Identify yourself with a pixely avatar. Declare that **someone-is-a-person**.

```javascript

var app = require("express")()
var someoneIsAPerson = require("someone-is-a-person")

someoneIsAPerson.prepareSite(site)

express.get("/", function(request, response) {

  var meId = someoneIsAPerson.getIdFrom(request)

  if (meId) {
    someoneIsAPerson.getIdentityFrom(response, "/demo")

  } else {
    var bridge = new BrowserBridge()
    var avatar = someoneIsAPerson(bridge, meId)

    bridge
    .forResponse(response)
    .send(avatar.html())
  }

})

```

![Picture of Erik made of 11 DIVs](pixel-portrait.gif)
