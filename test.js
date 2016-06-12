let esc = require('escape-regexp')
let logic = require('./index')
let fs = require('fs')

let str = fs.readFileSync(__dirname + '/the-egg.txt', 'utf8')
// let ast = logic(str, ['__', '__', '__#', '__', '__/'])

let ast = logic(str, {
  start_block_open: '__#',
  end_block_open: '__/',
  tag_open: '__',
  marker: '---',
  start_block_close: '__',
  end_block_close: '__',
  tag_close: '__'
})


console.dir(ast, { colors: true, depth: Infinity })
