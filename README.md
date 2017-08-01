Identify yourself with a pixely avatar. Declare that **someone-is-a-person**.

```javascript

var site = new require("web-site")

someoneIsAPerson.prepareSite(site)

site.addRoute(
  "get",
  "/demo",
  function(request, response) {

    var meId = someoneIsAPerson.getIdFrom(request)

    if (!meId) {
      someoneIsAPerson.getIdentityFrom(response, "/demo")
      return
    }

    var bridge = new BrowserBridge()
    var avatar = someoneIsAPerson(bridge, meId)

    bridge
    .forResponse(response)
    .send(avatar.html())
  }
)

```

![Picture of Erik made of 11 DIVs](pixel-portrait.gif)
