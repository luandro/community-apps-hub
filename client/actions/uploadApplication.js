const Dat = require('dat-node')

module.exports = (path) => {
  return new Promise((res, rej) => {
    return Dat(path, (err, dat) => {
      if (err) throw err
    
      var progress = dat.importFiles({watch: true}) // with watch: true, there is no callback
      dat.joinNetwork()
      // (And share the link)
      res(dat.key.toString('hex'))
    })
  })
}
