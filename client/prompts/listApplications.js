const inquirer = require('inquirer')
const downloadApplication = require('../actions/downloadApplication')
const addApplicationPrompt = require('./addApplication')
const chalk = require('chalk')

module.exports = (ssb, view) => {
  let choices = [chalk.green('Add new application'), new inquirer.Separator()]
  const viewValues = Object.values(view)
  viewValues.map(i => {
    choices.push(i.name)
  })
  choices.push(new inquirer.Separator())
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Add an application or choose a posted one to download',
        choices: [...choices],
        filter: i => i.toLowerCase()
      }
    ])
    .then(answers => {
      if (answers.action === '\u001b[32madd new application\u001b[39m') {
        console.log('Select application to add')
        addApplicationPrompt(ssb)
      }
      else {
        const selectedApp = viewValues.filter(i => i.name.toLowerCase() === answers.action)
        const { name, author, key, category, repository, hash, slug } = selectedApp[0]
        const downloadPath = `${process.cwd()}/${slug}`
        console.log('Downloading application: ', name + ' to ' + downloadPath)
        downloadApplication(hash, downloadPath)
      }
    })
}
