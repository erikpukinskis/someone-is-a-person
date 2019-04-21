var library = require("module-library")(require)

module.exports = library.export(
  "someone-is-a-person/blobs",
  function() {

    var focus
    var el
    var meId

    function focusOnBlob(blob, elementId, creatureId) {
      focus = blob
      meId = creatureId
      el = document.getElementById(elementId)
    }

    function moveToHere(universe, event) {

      var blob = focus

      var x = event.clientX
      var y = event.clientY
      var dx = blob.x - x
      var dy = blob.y - y
      dx = Math.round(dx / 100)*100
      dy = Math.round(dy / 100)*100

      if (dx == 0 && dy == 0) {
        toggleAwake(blob)
        return
      }

      console.log("we are about to do a do, which should trigger a websocket.send somehow...")
      debugger
      universe.do("creature.moveTo", meId, x, y)

      blob.x = x
      blob.y = y

      var distance = Math.sqrt(dx*dx + dy*dy)

      var time = distance/200

      load(blob)

      blob.bodyEl.classList.remove("bobbing")
      blob.bodyEl.classList.add("walking")
      blob.nameEl.classList.add("awake")

      blob.nameEl.style["transition"] = "opacity 0.2s"
      blob.nameEl.style["opacity"] = "0"

      if (blob.timeout) {
        clearTimeout(blob.timeout)}

      var ms = Math.ceil(time*1000)

      var transform = "translateX("+(x-20)+"px) translateY("+(y-20)+"px)"

      blob.timeout = setTimeout(
        function() {
          blob.bodyEl.classList.remove("walking")
          blob.bodyEl.classList.add("bobbing")
          blob.nameEl.style.transform = transform
          blob.nameEl.style["transition"] = "opacity 2s"
          blob.nameEl.style["opacity"] = "1"
        }, ms)


      blob.el.style["transition"] = "transform "+time+"s cubic-bezier(0.19, 0, 0.58, 1)"
      blob.el.style.transform = transform
    }

    function toggleAwake(blob) {
      load(blob)
      if (blob.isAwake) {
        blob.bodyEl.classList.remove("bobbing")
        blob.nameEl.classList.remove("awake")
        blob.isAwake = false
      } else {
        blob.bodyEl.classList.add("bobbing")
        blob.nameEl.classList.add("awake")
        blob.isAwake = true
      }
    }

    function blob() {
      var me = {
        isAwake: true,
        x: 100,
        y: 100}

      return me
    }

    function load(blob) {
      if (blob.el) {
        return }
      blob.el = el.querySelector(
        ".blobby")
      blob.bodyEl = el.querySelector(
        ".blobby-body")
      blob.nameEl = el.querySelector(".blobby-name")
    }

    blob.moveToHere = moveToHere
    blob.focusOnBlob = focusOnBlob

    return blob
  })