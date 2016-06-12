let fs = require('fs')

let delims = require('handlebars-delimiters')
let helpers = require('handlebars-helpers')
let handlebars = require('handlebars')
let lint = require('handlebars-lint')

delims(handlebars, ['__', '__'])

let str = fs.readFileSync(__dirname + '/the-egg.txt', 'utf8')

let missing = lint(str, {
  context:
  hbs: handlebars
})
console.log(missing)

// var b = handlebars.compile(str)({name: 'Jon'});
// console.log(b)
// function compile (str, rules) {

// }

// compile
