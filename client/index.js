const Client = require('ssb-client')
const path = require('path')
const ora = require('ora')
const config = require('../config')
const listApplicationsPrompt = require('./prompts/listApplications')

module.exports = () => Client(config.keys, config, (err, ssbServer) => {
  if (err) throw err
  const spinner = ora('Initializing Secure Scuttlebot...').start()
  ssbServer.whoami((err, data) => { 
    if (err) throw err
    const myId = data.id
    ssbServer.communityApps.get((err, view) => {
      if (err) throw err
      spinner.stop()
      listApplicationsPrompt(ssbServer, view)
      // ssbServer.close()
    })
  })
})
