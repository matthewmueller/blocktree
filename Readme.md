# Blocktree

Back to the basics, Hickey-inspired, generic text parser that spits out an [Abstract Syntax Tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree) that you can operate on.

## Example

```js
let str = 'a<1,2,3<hi<cool>>4>hi'

let ast = Tree(str, {
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

## Concepts

All text operations can be boiled down to 2 concepts: **markers** & **blocks**. Here's some examples:

- If you want to insert some text, you'd insert at a **marker**
- If you want to delete some text, you'd delete a **block**
- If you want to update or replace some text, you'd swap out a **block**

Another analogy you can draw is where your cursor is in a document is a **marker** and when you make a selection, that's a **block**.

Given **markers** and **blocks**, you can implement pretty much anything.

Here's HTML:

```
let html = '<h2>hi<u>ok</u></h2>'
ast = Tree(html, {
  marker: /<(\w+)\/>/,
  open: /<(\w+)>/,
  close: /<\/(\w+)>/,
})
```
