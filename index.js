#!/usr/bin/env node

const Server = require('scuttlebot')
const fs = require('fs')
const Path = require('path')
const app = require('./client')
const ora = require('ora')
const clear = require('clear')
const spinner = ora('Starting Secure Scuttlebot...').start()

const config = require('./config')
// console.log('config:', config)

// console.log('*** installing ssb-server plugins ***')

const setup = () => new Promise((resolve, reject) => {
  Server
    .use(require('scuttlebot/plugins/master'))
    // .use(require('community-apps-ssb-plugin'))
    .use(require('community-apps-ssb-plugin'))
  const server = Server(config)
  // console.log('*** updating manifest ***')
  const manifest = server.getManifest()
  fs.writeFileSync(Path.join(config.path, 'manifest.json'), JSON.stringify(manifest))
  resolve()
})

setup()
  .then(() => {
    spinner.stop()
    clear()
    app()
  })

// console.log('*** starting ssb-server ***')

// this is required for ssb-client to consume
// it's a list of methods that can be called remotely, without this code we won't be able to call our new plugin
