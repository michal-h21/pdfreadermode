const pkg = require('../package.json')
module.exports = (args) => {
  console.log(pkg.name + ", version " + pkg.version)
}
