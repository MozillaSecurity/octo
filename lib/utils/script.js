/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const random = require('../random')
const make = require('../make')
const utils = require('../utils')

class script extends utils {
  /**
   * Helper method for appending an element to body or documentElement
   * @param {string} name - Element identifier
   * @returns {string}
   */
  static addElementToBody (name) {
    return `(document.body || document.documentElement).appendChild(${name})`
  }

  static makeArray (type, arrayLength, cb) {
    if (type === null || type === undefined) {
      type = random.item(['Uint8', 'Float32'])
    }
    switch (random.number(8)) {
      case 0:
        let src = `function() { let buffer = new ${type}Array(${arrayLength});`
        src += script.makeLoop(`buffer[i] = ${cb()};`, arrayLength)
        src += 'return buffer;}()'
        return src
      case 1:
        return `new ${type}Array([${make.arrays.filledArray(cb, arrayLength)}])`
      default:
        return `new ${type}Array(${arrayLength})`
    }
  }

  static makeConstraint (keys, values) {
    const dict = {}
    for (let key of random.subset(keys)) {
      dict[key] = random.pick(values)
    }
    return dict
  }

  static makeLoop (s, max) {
    return `for (let i = 0; i < ${max || make.number.tiny()}; i++) {${s}}`
  }

  static makeRandomOptions (baseObject) {
    const dict = {}
    let unique = random.subset(Object.keys(baseObject))
    for (let i = 0; i < unique.length; i++) {
      dict[unique[i]] = random.pick(baseObject[unique[i]])
    }
    return JSON.stringify(dict)
  }

  static methodCall (objectName, methodHash) {
    if (!Object.keys(methodHash).length || !objectName) {
      return ''
    }
    let methodName = random.key(methodHash)
    let methodArgs = methodHash[methodName]
    if (typeof (methodArgs) === 'function') { // Todo: Hmmmm..
      return methodArgs()
    }
    return `${objectName}.${methodName}${script.methodHead(methodArgs)}`
  }

  static methodHead (list, numOptional) {
    if (isNaN(numOptional)) {
      numOptional = 0
    }
    let arity = list.length - random.number(numOptional)
    let params = []
    for (let i = 0; i < arity; i++) {
      params.push(random.pick([list[i]]))
    }
    return `(${params.join(', ')})`
  }

  static offset (s) {
    return `(${random.number()} % ${s})`
  }

  /**
   * Wrap command(s) in setInterval, setTimeout, loop or run directly
   * @param {string|string[]} cmds - Command(s) to be executed
   * @returns {array}
   */
  static runner (cmds) {
    cmds = (Array.isArray(cmds)) ? cmds : [cmds]
    cmds = cmds.filter((i) => i !== undefined)
    // Wrap each command in try/catch for use in setInterval, setTimeout, repeater
    switch (random.number(50)) {
      case 0:
        return [`setInterval(function () { ${script.safely(cmds)} }, ${random.range(100, 400)} )`]
      case 1:
        return [`setTimeout(function () { ${script.safely(cmds)} }, ${random.range(100, 400)} )`]
      case 2:
        return [`for (let i = 0; i < ${random.range(1, random.range(1, 30))}; i++) { ${script.safely(cmds)} }`]
      default:
        return cmds
    }
  }

  static safely (obj) {
    if (Array.isArray(obj)) {
      return obj.map(s => utils.script.safely(s)).join(' ')
    } else {
      return `try { ${obj} } catch (e) { }`
    }
  }

  static setAttribute (objectName, attributeHash) {
    if (!Object.keys(attributeHash).length || !objectName) {
      return ''
    }
    let attributeName = random.key(attributeHash)
    let attributeValue = random.pick(attributeHash[attributeName])
    let operator = ' = '
    /*
     if (typeof(attributeValue) == "number" && Random.chance(8)) {
     operator = " " + Make.randomAssignmentOperator() + " ";
     }
     if (typeof(attributeValue) == "string") {
     attributeValue = "'" + attributeValue + "'";
     }
     */
    return `${objectName}.${attributeName}${operator}${attributeValue};`
  }
}

module.exports = script
