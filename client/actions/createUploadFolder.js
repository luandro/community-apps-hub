const inquirer = require('inquirer')
const slugify = require('slugify')
const fs = require('fs')
const uploadApplication = require('./uploadApplication')

// Templates
const compiledMetadataTemplate = (apkPath) => `
  {
    "convention": "1",
    "apk": "${apkPath}",
    "readme": "/README.md"
  }
`
const compiledReadmeTemplate = (name) => `
  # ${name}

  ----------------

  Something about this application.
`

const confirmPrompt = (folderName) => new Promise((resolve, reject) => {
  return inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'createUploadFolderConfirm',
        message: `Are you ready to distribute the application and publish it?`,
        default: true
      }
    ])
    .then(confirm => {
      if (confirm.createUploadFolderConfirm) {
        uploadApplication(`./${folderName}`)
          .then(res => resolve(res))
      }
    })
})

const questions = [
  {
    type: 'input',
    name: 'addAppName',
    message: 'What is the name of the application you would like to add?'
  },
  {
    type: 'checkbox',
    name: 'addAppCategory',
    message: 'Select which categories the application fits under:',
    choices: ['Economic', 'Governance', 'Cultural', 'Scientific', 'Networking']
  },
  {
    type: 'input',
    name: 'addAppRepo',
    message: 'What is the applications repository?'
  }
]

module.exports = (apkPath) => {
  return new Promise((resolve, reject) => {
    // Ask for application name
  inquirer
    .prompt(questions)
    .then(ans => {
      const name = ans.addAppName
      const category = ans.addAppCategory
      const repository = ans.addAppRepo
      const slug = slugify(name.toLowerCase())
      const folderName = `${slug}-package`
      // create new folder with applicaiton name
      fs.mkdirSync(folderName)
      // copy apk to folder
      fs.copyFileSync(apkPath, `./${folderName}/${apkPath}`)
      // scaffold base manifest.json and readme.md
      fs.writeFileSync(`./${folderName}/README.md`, compiledReadmeTemplate(name))
      fs.writeFileSync(`./${folderName}/metadata.json`, compiledMetadataTemplate(apkPath))
      // wait for user to edit the files (mirror-folder)
      console.log(' ')
      console.log(`Your files have been created at './${folderName}'.`)
      console.log(`Please edit the files with necessary information.`)
      console.log(' ')
      confirmPrompt(folderName)
        .then((hash) => {
          resolve({
            slug,
            name,
            category,
            repository,
            hash
          })
        })
    })
  // return path if ready or error
  })
} 