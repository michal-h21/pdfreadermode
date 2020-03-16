const {JSDOM} = require('jsdom')
const readability = require('readability')
const fetch = require("node-fetch")
const crypto = require('crypto');
const path = require('path')
const fs = require('fs')

class Article {
  constructor(content, baseurl,config){
    this.original = content
    this.baseurl = baseurl
    this.config = config
  }


  convert(options){
    this.doc = new JSDOM(options.input, {url: options.url})
    const reader = new readability(this.doc.window.document)
    this.article = reader.parse()
  }

  save_image(url){
    // create hash from the image URL. It should be unique and needs to be safe to be used
    const hash = crypto.createHash('sha256').update(url).digest('base64').replace("/","-").replace("+", "_").replace("=","")
    const ext = path.extname(url)
    const newname = path.normalize(this.config.resource_dir + "/" + hash + ext)
    // don't donwload image if it already exists
    if (fs.existsSync(newname)){ return newname }
    // support for HTTP images
    if (url.match("^https:")){
      const response = fetch(url).then(res => {
        const dest = fs.createWriteStream(newname)
        res.body.pipe(dest)
      })
    } else if (url.match("^file:")){ //local filesystem images
      const localname = url.replace("file://", "")
      fs.createReadStream(localname).pipe(fs.createWriteStream(newname))
    } else { // this shouldn't happen
      return url // just return original name
    }
    return newname
  }

  // hash image names and save them in 
  save_images(){
    const fragment = new JSDOM(this.article.content)
    const images = fragment.window.document.querySelectorAll("img")
    const obj = this
    images.forEach(async function(img){
      // save image in the resource_dir with hashed name. save the new name.
      img.src = obj.save_image(img.src)
    })
    console.log(fragment.serialize())
  }
}

module.exports.Article = Article
