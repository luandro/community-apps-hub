const uploadApplication = require('../actions/uploadApplication')
const createUploadFolder = require('../actions/createUploadFolder')
const publishApplication = require('../actions/publishApplication')
const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')

module.exports = (ssb) => {
  return fs.readdir(process.cwd(), (err, data) => {
    if (err) throw err;
    const availableApk = data.filter(i => i.split('.')[1] === 'apk')
    console.log('APKs ', availableApk)
    if (availableApk.length < 1) {
      console.error(
        'You dont seem to have any apk files in the current directory. '
        +'Please execute the command from the directory where the apk file is located.'
      )
      process.exit(1)
    } else if (availableApk.length === 1) {
      return inquirer
        .prompt([
          {
            type: 'confirm',
            name: 'addThisApp',
            message: `Upload ${availableApk[0]} ?`,
            default: true
          }
        ])
        .then(ans => {
          if (ans.addThisApp) {
            createUploadFolder(`./${availableApk[0]}`)
              .then(({ hash, name, category, repository, slug }) => {
                publishApplication(ssb, {
                  slug,
                  name,
                  hash,
                  // description,
                  category,
                  repository
                })
                  .then((msg) => {
                    if (msg.key) {
                      console.log(' ')
                      console.log(chalk.green('Success'))
                      console.log('The applications has been shared on Dat and on SSB.')
                      console.log(`The applications Dat url is:`)
                      console.log(chalk.blue(`dat://${hash}`))
                      console.log(`The SSB post's key is:`)
                      console.log(chalk.blue(msg.key))
                      console.log(chalk.red('Press any key to exit'))
                      process.stdin.setRawMode(true);
                      process.stdin.resume();
                      process.stdin.on('data', process.exit.bind(process, 0));
                    }
                  })
              })
          }
        })
    } {
      return inquirer
        .prompt([
          {
            type: 'list',
            name: 'add-app',
            message: 'Select application .apk file',
            choices: [...apkChoices]
          },

        ])
        .then(answers => {
          console.log(answers)
        })
    }
  })
}