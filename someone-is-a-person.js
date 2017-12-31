var library = require("module-library")(require)

module.exports = library.export(
  "someone-is-a-person",
  [library.ref(), "phone-person", "./id-card", "identifiable", "html-painting", "creature", "tell-the-universe", "web-element", "bridge-module", "web-site"],
  function(lib, phonePerson, idCard, identifiable, htmlPainting, creature, aWildUniverseAppeared, element, bridgeModule, WebSite) {

    var redirects = {}

    var creatures = aWildUniverseAppeared("creatures", {
      creature: "creature"
    })

    var s3Options = {
      key: process.env.AWS_ACCESS_KEY_ID,
      secret: process.env.AWS_SECRET_ACCESS_KEY,
      bucket: process.env.S3_BUCKET_NAME,
    }
    // creatures.persistToS3(s3Options)
    // creatures.load()
    creature("01k5", "Kermit")

    var someoneIsAPerson = element.template(
      ".avatar",
      function(bridge, meId) {

        this.addChild(element(".swatches"))

        var name = creature.getName(meId)
        if (!name) {
          throw new Error("No name for "+meId)
        }
        prepareBridge(bridge)
        this.addChild(
          element(".name", name)
        )

        var load = bridge.remember("someone-is-a-person/loadCreaturerPainting")

        bridge.domReady(load.withArgs(meId))
      }
    )

    function prepareBridge(bridge) {
      if (bridge.remember("someone-is-a-person")) { return }

      bridge.see("someone-is-a-person", true)

      var avatarStyle = element.style(".avatar", {

        "position": "absolute",
        "top": "300px",
        "left": "200px",

        " .swatches": {
        },

        " .name": {
          "position": "absolute",
          "top": "-30px",
          "width": idCard.TARGET_WIDTH+"px",
          "text-align": "center",
          "font-weight": "bold",
        },
      })

      bridge.addToHead(element.stylesheet(avatarStyle))


      var moveTo = bridge.defineFunction(
        [idCard.TARGET_WIDTH],
        function moveTo(TARGET_WIDTH, event) {
        var me = document.querySelector(".avatar")
        me.style.top = (event.pageY - 15)+"px"
        me.style.left = (event.pageX - TARGET_WIDTH/2)+"px"
        me.style.transition = "top 2s, left 2s"
      })


      bridge.domReady(
        [moveTo.withArgs(bridge.event).evalable()],
        function(moveToSource) {
          var body = document.querySelector("body")
          if (body.getAttribute("onclick")) {
            throw new Error("Already assigned onclick. Can't add someone-is-a-person creature movement")
          }
          body.setAttribute("onclick", moveToSource)
          body.style["min-height"] = window.innerHeight+"px"
      })

      var loadCreaturePainting = bridge.defineFunction(
        [bridgeModule(lib, "html-painting", bridge), bridgeModule(lib, "creature", bridge), bridgeModule(lib, "tell-the-universe", bridge)],
        function loadCreaturePainting(htmlPainting, creature, aWildUniverseAppeared, meId) {

          var paintings = aWildUniverseAppeared("paintings", {htmlPainting: htmlPainting})
          paintings.persistToLocalStorage()
          paintings.load()

          var creatureUniverse = aWildUniverseAppeared("creatures", {creature: creature})
          creatureUniverse.persistToLocalStorage()
          creatureUniverse.load()

          var avatar = creature.remember(meId, "avatar")

          var transform = "scale("+avatar.scale+") translate("+avatar.offsetLeft+"px, "+avatar.offsetTop+"px)"

          document.querySelector(".swatches").style.transform = transform 


          if (!avatar.paintingId) {
            throw new Error("No painting id")
          }

          htmlPainting.playBackInto(avatar.paintingId, ".swatches")
        }
      )

      bridge.see("someone-is-a-person/loadCreaturePainting", loadCreaturePainting)
    }


    var minutes = 60
    var hours = 60*minutes
    var days = 24*hours
    var years = 365*days

    someoneIsAPerson.prepareSite = function prepareSite(site) {

        if (!site.addRoute) {
          var app = site
          site = new WebSite(app)
        }

        idCard(site, function onIdentity(meId, myName, request, response) {

          var temporaryIdentity = request.cookies.temporaryIdentity
          var redirectTo = redirects[temporaryIdentity]

          if (!name) {
            throw new Error("no name")
          }
          if (!response) {
            throw new Error("no response")
          }

          creature(meId, myName)
          creatures.do("creature", meId, myName)

          response.cookie(
            "creatureId",
            meId,{
            maxAge: 10*years,
            httpOnly: true})

          if (temporaryIdentity && redirectTo) {
            delete redirects[temporaryIdentity]
            response.redirect(redirectTo)
          } else {
            response.send("We seem to have lost track of where you were headed, but your identity has been issued. Maybe hit the back button a bunch of times?")
          }
        })

        site.addRoute("post", "/phone-numbers", registerPhone)

      }

    someoneIsAPerson.getIdentityFrom = function getIdentityFromUser(response, redirectTo) {
        var temporaryIdentity = identifiable.assignId(redirects)

        redirects[temporaryIdentity] = redirectTo

        var minutes = 60
        var hours = 60*minutes

        response.cookie(
          "temporaryIdentity",
          temporaryIdentity,{
          maxAge: 24*hours,
          httpOnly: true})

        response.redirect("/id-card")
      }

    someoneIsAPerson.getIdFrom = function getIdFrom(request) {
        var meId = request.cookies.creatureId

        if (meId && creature.getName(meId, true)) {
          return meId
        }

        return request.cookies.transientCreatureId
      }

    someoneIsAPerson.ensureMe = function(request, response) {
        var meId = someoneIsAPerson.getIdFrom(request)

        if (!meId) {
          meId = creature()

          response.cookie(
            "transientCreatureId",
            meId,{
            maxAge: 10*years,
            httpOnly: true})
        }

        return meId
      }

    function registerPhone(request, response) {

      var number = request.body.number

      var person = phoneNumber(number)
      person.text("you are a person!")

      setTimeout(function() {
        person.text("i am a phone number.")
      }, 5000)

      // ...
      // NOW WHAT NEEDS DOING?

    }

    return someoneIsAPerson
  }
)
