/**
 * Module Dependencies
 */

let esc = require('escape-regexp')

module.exports = ast

/**
 * Delim Map
 */

function ast (str, rules) {
  rules = prepare(rules)
  let toks = tokens(str, rules)
  return {
    type: 'document',
    children: children(toks)
  }
}

function children (tokens) {
  let in_tag = false
  let token = null
  let ast = []

  while (tokens.length) {
    token = tokens.shift()
    if (token.type === 'raw') {
      ast.push({
        type: 'text',
        value: token.value
      })
    }

    if (token.type === 'delim') {
      if (token.label === 'tag_open') {
        ast.push(tag(tokens))
        continue
      } else if (token.label === 'start_block_open') {
        ast.push(block(tokens))
      } else if (token.label === 'marker') {
        ast.push(marker(token))
      } else {
        throw SyntaxError(`unexpected token "${token.value}", expected opening tag, opening block or marker`)
      }
    }
  }
  return ast
}

function marker (token) {
  return {
    type: 'marker',
    value: token.value
  }
}

function tag (tokens) {
  let in_tag = true
  let tag_token = {
    type: 'tag',
    value: ''
  }

  while (tokens.length) {
    let token = tokens.shift()
    if (token.type === 'raw') {
      tag_token.value += token.value
    } else if (token.type === 'delim') {
      let closing_tag = token.label === 'tag_close'
        || (in_tag && token.label === 'tag_open')
      if (closing_tag) {
        return tag_token
      } else {
        throw SyntaxError(`unexpected token "${token.value}", expected closing tag`)
      }
    } else {
      throw SyntaxError(`unexpected token "${token.value}", expected closing tag`)
    }
  }

  return tag_token
}

function block (tokens) {
  let in_start_tag = true
  let in_end_tag = false
  let in_block = false
  let token = null

  let out = {
    type: 'block',
    children: []
  }

  while (tokens.length) {
    token = tokens.shift()
    if (token.type === 'raw') {
      if (in_start_tag) {
        out.start = token.value
      } else if (in_end_tag) {
        out.end = token.value
      } else if (in_block) {
        out.children.push({
          type: 'text',
          value: token.value
        })
      } else {
        tokens.unshift(token)
        return out
      }
    }

    if (token.type === 'delim') {
      let closing_start_tag = token.label === 'start_block_close'
        || (in_start_tag && token.label === 'end_block_close')
        || (in_start_tag && token.label === 'tag_open')
      let closing_end_tag = token.label === 'end_block_close'
        || (in_end_tag && token.label === 'start_block_close')
        || (in_end_tag && token.label === 'tag_open')

      if (closing_start_tag) {
        in_start_tag = false
        in_block = true
      } else if (closing_end_tag) {
        in_end_tag = false
      } else if (token.label === 'end_block_open') {
        in_block = false
        in_end_tag = true
      } else if (token.label === 'start_block_open') {
        out.children.push(block(tokens))
      } else if (token.label === 'tag_open') {
        out.children.push(tag(tokens))
      } else if (token.label === 'marker') {
        out.children.push(marker(token))
      } else {
        throw new SyntaxError(`unexpected token "${token.value}"`)
      }
    }
  }

  return out
}

function tokens (str, rules) {
  let match = null
  let offset = 0
  let toks = []
  let buf = []

  while (str.length) {
    for (let rule of rules) {
      match = str.match(rule.pattern)
      if (match) {
        if (buf.length) {
          toks.push({ type: 'raw', value: buf.join('') })
          buf = []
        }

        toks.push({ type: 'delim', label: rule.name, value: match[0] })
        str = str.slice(match[0].length)
      }
    }

    buf.push(str[0])
    str = str.slice(1)
  }

  if (buf.length) {
    toks.push({ type: 'raw', value: buf.join('') })
  }
  // while (match = re.exec(str)) {


  //   toks.push({ type: 'raw', value: str.slice(offset, match.index) })
  //   for (let i = 0, delim; delim = delims[i]; i++) {
  //     if (delim.value === match[0]) {
  //       toks.push()
  //       break
  //     }
  //   }
  //   offset = match.index + match[0].length
  // }

  return toks
}

function prepare (rules) {
  return Object.keys(rules).map(function (label) {
    let rule = rules[label]
    if (rule.source) {
      return {
        name: label,
        pattern: new RegExp('^' + rule.source, rule.flags.replace('g', ''))
      }
    } else if (typeof rule === 'string') {
      return {
        name: label,
        pattern: new RegExp('^' + esc(rule))
      }
    } else if (Array.isArray(rule)) {
      return {
        name: label,
        pattern: new RegExp(`^(${rule.map(r => esc(r)).join('|')})`)
      }
    } else {
      throw new Error(`rule must be either a string, regexp or an array of strings`)
    }
  })
}

/**
 * Handle the different arguments
 *
 * @param {Array} d
 * @return {Array}
 */

function args (d) {
  switch (d.length) {
    case 1: return [d[0], d[0], d[0], d[0], d[0], d[0]]
    case 2: return [d[0], d[1], d[0], d[1], d[0], d[1]]
    case 3: return [d[0], d[1], d[2], d[1], d[2], d[1]]
    case 4: return [d[0], d[1], d[2], d[3], d[2], d[3]]
    case 5: return [d[0], d[1], d[2], d[3], d[4], d[3]]
    default: return d
  }
}

function desc (a, b) {
  return b.value.length - a.value.length
}
