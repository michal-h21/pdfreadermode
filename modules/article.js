const {JSDOM} = require('jsdom')
const readability = require('readability')
const fetch = require('node-fetch')
const {spawnSync} = require('child_process')
const crypto = require('crypto');
const path = require('path')
const fs = require('fs')
const Mustache = require('mustache')

class Article {
  constructor(content, baseurl, config){
    this.original = content
    this.baseurl = baseurl
    this.config = config
  }


  convert(options){
    let jsdom_options = this.config.jsdom_options
    jsdom_options.url = options.url
    this.doc = new JSDOM(options.input, jsdom_options)
    const reader = new readability(this.doc.window.document)
    this.article = reader.parse()
  }

  save_image(url){
    // create hash from the image URL. It should be unique and needs to be safe to be used
    const hash = crypto.createHash('sha256').update(url).digest('base64').replace(/\//g,"-").replace(/\+/g, "_").replace(/=/g,"")
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
      console.log("saving image " + img.src)
    })
    // replace original content with new one, with updated links to images
    this.article.content = fragment.serialize()
  }

  // content template should interpolate article variables to text stub
  get_content_template(){
    const tpl_file = this.config.content_template
    if (fs.existsSync(tpl_file)){
      return fs.readFileSync(tpl_file).toString()
    }
    console.error("Cannot find template file: " + tpl_file)
    return ""
  }

  tex_content(){
    // convert the article content to LaTeX 
    // the command must read HTML from stdin and write LaTeX to stdout
    // for example: pandoc -f html -t latex
    let article = this.article
    const convert_cmd = this.config.convert_cmd
    const convertor = spawnSync(convert_cmd.cmd, convert_cmd.options, {input: article.content})
    // get converted article
    article.tex_content = convertor.stdout.toString()
    let template = this.get_content_template()
    return Mustache.render(template, article, {}, this.config.mustache_tags)
  }

}

module.exports.Article = Article
