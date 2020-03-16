exports.info = function(msg){
  console.info(msg)
}

exports.fatal = function(msg){
  console.error(msg)
  process.exit(1)
}
