const config = require('find-config')
const config_file_name = "pdfreadermode.json"

const default_config = {
  "document" : {
    "width" : "9.14cm",
    "height" : "12.2cm",
    "margin" : "4mm",
    "language" : "en",
    "font-size" : "10pt"
  }
}

exports.load = function(){
  const user_config = config.require(config_file_name) || {}
  let current_config = Object.assign(default_config, user_config)
  return current_config
}

