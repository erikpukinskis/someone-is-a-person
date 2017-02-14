var library = require("module-library")(require)

module.exports = library.export(
  "avatar",
  function() {

    function avatar() {
    }

    // $('.photo-button').click(function() {
    //   console.log('ya')
    //   $('.camera').click()
    // })

    // .camera {
    //   display: none;
    // }

    // <h1>Share</h1>
    // <input class="camera" type="file" accept="image/*" capture="camera" placeholder="foo">
    // <button class="photo-button">Take a photo</button>

    return avatar
  }
)