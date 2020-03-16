const pkg = require('../package.json')
const message = `
Usage:

   pdfreadermode <options> [HTML file]

Options:

  -f, --format   Output format. Supported values
    tex 
    pdf
  -h, --help     Print help message
  -o, --output   Output file name
  -u, --url      Set URL for HTML files loaded from 
  -v, --version  Print version info
    

HTML file

  Use either URL or filename of the HTML file you want to convert.
  Use - character to read HTML file from STDIN.

`
module.exports = (args) => {
  console.log(pkg.name)
  console.log(pkg.description)
  console.log(message)
}
