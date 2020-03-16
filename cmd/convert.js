const pkg = require('../package.json')
const log = require('../modules/log')
const config = require('../modules/config')
const Article = require('../modules/article').Article
const path = require('path')
const fs = require('fs')
const fetch = require("node-fetch")

// thins will be populated in module.exports
let configuration = {}

// get url for a local file
// use --url CLI option if it was used, otherwise return path
function get_url(path, args){
  return args.u || args.url || path
}

// handle input
// possible values:
// 1. URL
// 2. filename
// 3. "-" -- read from the stdio
async function handle_input (args){
  // return new Promise(function(resolve, reject){
    let options = {}
    const filename = args._[0]
    if(filename.match("^https?://")){
      log.info("load url")
      try{
        const response = await fetch(filename)
        options.input = await response.text()
        options.url = filename
      } catch(error){
        throw(error)
      }
    } else if(filename == "-"){
      log.info("load stdin")
      options.input =  fs.readFileSync(0).toString()
      options.url = get_url("file://" + path.resolve(configuration.resource_dir + "/stdin.html"), args)
      log.info(options.input)
    } else {
      log.info("load file: " + path.resolve(filename))
      let fullpath =  path.resolve(filename)
      options.input = fs.readFileSync(fullpath).toString()
      options.url = get_url("file://" + fullpath, args)
    }
    return options
    // resolve(options)
  // })
}


module.exports = (args) => {
  // configuration is global in this module
  configuration = config.load()
  config.make_resource_dir(configuration.resource_dir)
  log.info("Convert URL: " + args._[0])
  log.info("Document language: " + configuration.document.language)
  let handle = handle_input(args)
  handle.then(
    function(options){
      const article = new Article(options.input, options.url, configuration)
      article.convert(options)
      article.save_images()
    },
    function(error){
      log.fatal(error.message)
    }

  )
}
