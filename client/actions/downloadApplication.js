const Dat = require('dat-node')
const ora = require('ora')
const chalk = require('chalk')

module.exports = (key, downloadPath) => {
  Dat(downloadPath, { key }, (err, dat) => {
    const spinner = ora(chalk.bold(`Downloading ${key}`)).start()
    dat.joinNetwork((err) => {
      if (err) throw err
      // After the first round of network checks, the callback is called
      // If no one is online, you can exit and let the user know.
      dat.network.on('listening', s => console.log('noise... ', s))
      dat.network.on('connection', (connection, info) => {
        console.log(connection, '----------', info)
      })
      if (!dat.network.connected || !dat.network.connecting) {
        spinner.stop()
        console.error('No users currently online for that key.')
        process.exit(1)
      }
    })
  })  
}