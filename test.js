let Tree = require('./index')

let str = 'a<1,2,3<hi<cool>>4>hi'

let ast = Tree(str, {
  marker: ',',
  open: '<',
  close: '>',
})

console.dir(ast, { colors: true, depth: Infinity })

let html = '<h2>hi<u>ok</u></h2>'
ast = Tree(html, {
  marker: /<(\w+)\/>/,
  open: /<(\w+)>/,
  close: /<\/(\w+)>/,
})

console.dir(ast, { colors: true, depth: Infinity })
