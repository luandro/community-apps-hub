const publish = (ssbServer, appData, resolve) => {
  return ssbServer.publish({
    type: 'community-applications-poc',
    application: {...appData}
  }, (err, msg) => {
    if (err) throw err
    return resolve(msg)
  })
}

module.exports = (ssbServer, appData) => {
  return new Promise ((resolve, reject) => publish(ssbServer, appData, resolve))
}