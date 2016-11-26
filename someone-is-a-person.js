tellTheUniverse(
  "a-story",
  "someone-is-a-person"
  ["sms-person", "web-site"],
  function(Person) {

    function someoneIsAPerson(number) {
      var person = new Person(number)
      person.text("you are a person!")

      setTimeout(function() {
        person.text("i am a phone number.")
      }, 5000)

      // ...
      // NOW WHAT NEEDS DOING?

    }

    someoneIsAPerson.registerThem = registerThem

    function registerThem() {
      var page = [
        element("someone's phone number"),
        element("input.persons-number", {placeholder: "number goes here"}),
        element("button", "they are a person")
      ]

      webSite.addRoute("get", "/", bridge.sendPage(page))

      webSite.addRoute("post", "/people", function(request, response) {
        someoneIsAPerson(request.body.number)
        tellTheUniverse(
          "someoneIsAPerson",
          request.body.number
        )
      })

      site.start(process.env.PORT)
    }

    return someoneIsAPerson
  }
)
