const fs = require('fs')
const zlib = require('zlib')

function encode( string ) {
  return Buffer.from(zlib.deflateRawSync(string)).toString('base64')
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

console.log(`content:\n${encode(read('./render.html'))}\n`)
console.log(`defaultCode:\n${encode(read('./example.es'))}`)

