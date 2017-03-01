#!/usr/bin/env node
const hyperdrive = require('hyperdrive')
const memdb = require('memdb')
const swarm = require('hyperdiscovery')
const URL = require('url')
const pump = require('pump')
const fs = require('fs')
const path = require('path')

const url = URL.parse(process.argv[2])

pump(open(url), fs.createWriteStream(path.basename(url.pathname)), err => {
  if (err) console.log(err)

  process.exit()
})

function open (url) {
  if (url.protocol !== 'dat:') throw new Error('only works on dat:// url')

  var drive = hyperdrive(memdb())
  var archive = drive.createArchive(url.host, {sparse: true})
  swarm(archive)

  return archive.createFileReadStream(url.pathname.replace(/^\//, ''))
}
