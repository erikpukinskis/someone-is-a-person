var library = require("module-library")(require)

module.exports = library.export(
  "someone-is-a-person",
  [library.ref(), "phone-person", "./id-card", "identifiable", "html-painting", "character", "tell-the-universe", "web-element", "bridge-module"],
  function(lib, phonePerson, idCard, identifiable, htmlPainting, character, aWildUniverseAppeared, element, bridgeModule) {

    var redirects = {}

    var characters = aWildUniverseAppeared("characters", {
      character: "./character"
    })

    var s3Options = {
      key: process.env.AWS_ACCESS_KEY_ID,
      secret: process.env.AWS_SECRET_ACCESS_KEY,
      bucket: process.env.S3_BUCKET_NAME,
    }
    // characters.persistToS3(s3Options)
    // characters.load()
    character("xwtr", "Purp")
    characters.do("character", "xwtr", "Purp")


    var someoneIsAPerson = element.template(
      ".avatar",
      function(bridge, meId) {

        this.addChild(element(".swatches"))

        var name = character.getName(meId)
        if (!name) {
          throw new Error("No name for "+meId)
        }
        prepareBridge(bridge)
        this.addChild(
          element(".name", name)
        )

        var load = bridge.remember("someone-is-a-person/loadCharacterPainting")

        bridge.domReady(load.withArgs(meId))
      }
    )

    function prepareBridge(bridge) {
      if (bridge.remember("someone-is-a-person")) { return }

      bridge.see("someone-is-a-person")

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
            throw new Error("Already assigned onclick. Can't add someone-is-a-person character movement")
          }
          body.setAttribute("onclick", moveToSource)
          body.style["min-height"] = window.innerHeight+"px"
      })

      var loadCharacterPainting = bridge.defineFunction(
        [bridgeModule(lib, "html-painting", bridge), bridgeModule(lib, "character", bridge), bridgeModule(lib, "tell-the-universe", bridge)],
        function loadCharacterPainting(htmlPainting, character, aWildUniverseAppeared, meId) {

          var paintings = aWildUniverseAppeared("paintings", {htmlPainting: htmlPainting})
          paintings.persistToLocalStorage()
          paintings.load()

          var characterUniverse = aWildUniverseAppeared("characters", {character: character})
          characterUniverse.persistToLocalStorage()
          characterUniverse.load()

          var picture = character.getPicture(meId)

          var transform = "scale("+picture.scale+") translate("+picture.offsetLeft+"px, "+picture.offsetTop+"px)"

          document.querySelector(".swatches").style.transform = transform 


          if (!picture.paintingId) {
            throw new Error("No painting id")
          }

          htmlPainting.playBackInto(picture.paintingId, ".swatches")
        }
      )

      bridge.see("someone-is-a-person/loadCharacterPainting", loadCharacterPainting)
    }


    var minutes = 60
    var hours = 60*minutes
    var days = 24*hours
    var years = 365*days

    someoneIsAPerson.prepareSite = function prepareSite(site) {

        idCard(site, function onIdentity(meId, myName, request, response) {

          var temporaryIdentity = request.cookies.temporaryIdentity
          var redirectTo = redirects[temporaryIdentity]

          if (!name) {
            throw new Error("no name")
          }
          if (!response) {
            throw new Error("no response")
          }

          character(meId, myName)
          characters.do("character", meId, myName)

          response.cookie(
            "characterId",
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

    someoneIsAPerson.getIdentityFrom = function getIdentityFrom(response, redirectTo) {
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
        return request.cookies.characterId
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
