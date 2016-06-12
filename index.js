/**
 * Module Dependencies
 */

let esc = require('escape-regexp')

/**
 * Export
 */

module.exports = ast

/**
 * AST
 */

function ast (str, rules) {
  rules = prepare(rules)
  let toks = tokens(str, rules)
  return {
    type: 'document',
    children: children(toks)
  }
}

/**
 * Children
 */

function children (tokens) {
  let in_tag = false
  let token = null
  let ast = []

  while (tokens.length) {
    token = tokens.shift()
    if (token.type === 'text') {
      ast.push(text(token))
    } else if (token.type === 'open') {
      ast.push(block(tokens, token))
    } else if (token.type === 'marker') {
      ast.push(marker(token))
    } else {
      throw SyntaxError(`unexpected token "${token.value}", expected opening tag, opening block or marker`)
    }
  }
  return ast
}

/**
 * Marker node
 */

function marker (token) {
  return token
}

function text (token) {
  return token
}

/**
 * Block node
 */

function block (tokens, open) {
  let token = null

  let out = {
    type: 'block',
    children: []
  }

  if (open.params) {
    out.open = open.params
  }

  while (tokens.length) {
    token = tokens.shift()
    if (token.type === 'text') {
      out.children.push(text(token))
    } else if (token.type === 'marker') {
      out.children.push(marker(token))
    } else if (token.type === 'open') {
      out.children.push(block(tokens, token))
    } else if (token.type === 'close') {
      if (token.params) out.close = token.params
      return out
    } else {
      throw new SyntaxError(`unexpected token "${token.value}"`)
    }
  }

  return out
}

/**
 * Tokenizer
 */

function tokens (str, rules) {
  let match = null
  let offset = 0
  let toks = []
  let buf = []

  while (str.length) {
    let match = null
    for (let rule of rules) {
      match = str.match(rule.pattern)
      if (match) {
        if (buf.length) {
          toks.push({ type: 'text', value: buf.join('') })
          buf = []
        }

        if (match.length > 1) {
          toks.push({ type: rule.name, value: match[0], params: match.slice(1) })
        } else {
          toks.push({ type: rule.name, value: match[0] })
        }

        str = str.slice(match[0].length)
        break
      }
    }

    if (!match) {
      buf.push(str[0])
      str = str.slice(1)
    }
  }

  // push the last remaining
  if (buf.length) {
    toks.push({ type: 'text', value: buf.join('') })
  }

  return toks
}

/**
 * Prepare the rules
 */

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
