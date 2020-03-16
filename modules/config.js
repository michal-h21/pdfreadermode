const config = require('find-config')
const fs = require('fs')
const config_file_name = "pdfreadermode.json"
const path = require('path')

const default_config = {
  'document' : {
    'width' : '9.14cm', // These are Kindle's dimensions
    'height' : '12.2cm',
    'margin' : '4mm',
    'language' : 'en',
    'font-size' : '10pt'
  },
  'resource_dir': './__pdfreadermode'
}

exports.load = function(){
  const user_config = config.require(config_file_name) || {}
  let current_config = Object.assign(default_config, user_config)
  return current_config
}

exports.make_resource_dir = function(resource_dir){
  if (!fs.existsSync(resource_dir)){
    fs.mkdirSync(cfg.resource_dir)
  }
}

