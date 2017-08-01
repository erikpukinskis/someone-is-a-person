var library = require("module-library")(require)

library.using(
  [".", "web-host", "browser-bridge"],
  function(someoneIsAPerson, host, BrowserBridge) {

    // if (isEveryoneFree() != "no") {
    //   throw new Error("We need a new goal")
    // }

    var minutes = 60
    var hours = 60*minutes
    var days = 24*hours
    var years = 365*days

    host.onSite(function(site) {

      someoneIsAPerson.prepareSite(site)

      site.addRoute("get", "/demo", function(request, response) {

        var meId = someoneIsAPerson.getIdFrom(request)

        // // uncomment to clear
        // response.cookie(
        //   "characterId",
        //   "",{
        //   maxAge: 10*years,
        //   httpOnly: true})
        // meId = false

        if (!meId) {
          someoneIsAPerson.getIdentityFrom(response, "/demo")
          return
        }

        var bridge = new BrowserBridge()
        var avatar = someoneIsAPerson(bridge, meId)
        bridge.forResponse(response).send(avatar.html())
      })

    })

  }
)