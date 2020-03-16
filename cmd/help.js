const pkg = require('../package.json')
const message = `
Usage:

   pdfreadermode <options> [URL]

Options:

  -h, --help     Print help message
  -v, --version  Print version info
`
module.exports = (args) => {
  console.log(pkg.name)
  console.log(pkg.description)
  console.log(message)
}
