Identify yourself with a pixely avatar. Declare that **someone-is-a-person**.

```javascript
var someoneIsAPerson = require("someone-is-a-person")
var app = require("express")()
var BrowserBridge = require("browser-bridge")

someoneIsAPerson.prepareSite(app)

app.get("/", function(request, response) {

  var meId = someoneIsAPerson.getIdFrom(request)

  if (!meId) {
    someoneIsAPerson.getIdentityFrom(response, "/")

  } else {
    var bridge = new BrowserBridge()
    var avatar = someoneIsAPerson(bridge, meId)

    bridge
    .forResponse(response)
    .send(avatar.html())
  }

})

app.listen(1413)
console.log("http://localhost:1413/")
```

![Picture of Erik made of 11 DIVs](pixel-portrait.gif)
