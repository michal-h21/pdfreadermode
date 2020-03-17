const minimist = require('minimist')

module.exports = () => {
  // process CLI arguments
  const args = minimist(process.argv.slice(2), {
    boolean: ["images"],
    alias: { f: "format"},
    default: { f: "pdf", images: true }
  })
  let cmd = (args._[0] ? "convert" : "help")
  if (args.version || args.v) {
    cmd = 'version'
  }
  if (args.help || args.h) {
    cmd = 'help'
  }
  switch(cmd){
    case 'help':
      require('./cmd/help')(args);
      break;
    case 'version':
      require('./cmd/version')(args);
      break;
    case 'convert':
      require('./cmd/convert')(args);
      break;
  }

}
