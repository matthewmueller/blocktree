# Blocktree

Back to the basics, Hickey-inspired, generic text parser that spits out an [Abstract Syntax Tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree) that you can operate on.

## Example

```js
let parse = require('blocktree')
let str = 'a<1,2,3<hi<cool>>4>hi'

let ast = parse(str, {
  marker: ',',
  open: '<',
  close: '>',
})

{
  type: 'document',
  children: [
    { type: 'text', value: 'a' },
    {
      type: 'block',
      children: [
        { type: 'text', value: '1' },
        ...
      ]
    }
  ]
}
```

## Installation

```js
npm install blocktree
```

## Concepts

All languages can be boiled down to 2 concepts: **markers** & **blocks**. Here's some examples:

- Loops, conditionals are all just **blocks**
- Variables, Binary operators are just **markers**
- Arrays and objects are just a group of **markers**

Another analogy you can draw is where your cursor is in a document is a **marker** and when you make a selection, that's a **block**.

Given **markers** and **blocks**, you can implement pretty much anything.

Here's a basic HTML parser:

```js
let html = '<h2>hi<u>ok</u></h2>'
ast = Tree(html, {
  marker: /<(\w+)\/>/,
  open: /<(\w+)>/,
  close: /<\/(\w+)>/,
})
```

For complex languages, you may want a more expressive AST, but for DSLs and micro-languages, this is a nice constraint.
