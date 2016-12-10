const test = require('tape')
const fs = require('fs')
const getDirs = require('../index')

const testDir = __dirname + '/testDirectory'

test.test('it will return, in an array, only directories', t => {
  const dirs = getDirs(testDir)

  t.deepEqual(dirs, [
    `${testDir}/folderA`,
    `${testDir}/folderA/folderAA`,
    `${testDir}/folderB`
  ])
  t.end()
})

test.test('it will throw an error if no root directory is given', t => {
  t.throws(getDirs, Error)
  t.end()
})

test.test('it will throw an error if root directory does not exist', t => {
  try {
    getDirs('./this_folder_does_not_exist')
  } catch(ex) {
    t.equal(ex.code, 'ENOENT')
  }
  t.end()
})

test.test('it will ignore any directories that match the naming passed to exclude arg', t => {

  let excludeDir = ['folderAA']
  let dirs = getDirs(testDir, excludeDir)
  t.deepEqual(dirs, [
    `${testDir}/folderA`,
    `${testDir}/folderB`
  ])

  excludeDir = ['folderAA', 'folderB']
  dirs = getDirs(testDir, excludeDir)
  t.deepEqual(dirs, [
    `${testDir}/folderA`
  ])

  excludeDir = ['fold']
  dirs = getDirs(testDir, excludeDir)
  t.deepEqual(dirs, [])

  t.end()

})

test.test('it will ignore any directories that match a passed-in RegEx object', t => {
  fs.mkdirSync(`${testDir}/.secretFolder`)
  fs.mkdirSync(`${testDir}/test.folder`)

  const exclude = [/^\.\w+|\/\./] // match any root or nested /.dotFolders, nothing else
  const dirs = getDirs(testDir, exclude)
  t.deepEqual(dirs, [
    `${testDir}/folderA`,
    `${testDir}/folderA/folderAA`,
    `${testDir}/folderB`,
    `${testDir}/test.folder`
  ])

  fs.rmdirSync(`${testDir}/.secretFolder`)
  fs.rmdirSync(`${testDir}/test.folder`)
  t.end()
})

test.test('it will throw an error if something other than a string or RegEx is passed into exclusion array', t => {
  const exclude = [1, 2, 3]
  t.throws(getDirs.bind(null, testDir, exclude), Error)
  t.end()
})
