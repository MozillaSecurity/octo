/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const random = require('../random')
const make = require('../make')
const utils = require('../utils')
const {o} = require('./objects')

class script extends utils {
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

  static methodCall (objectName, methodHash) {
    if (!utils.common.getKeysFromHash(methodHash).length || !objectName) {
      return ''
    }
    let methodName = random.key(methodHash)
    let methodArgs = methodHash[methodName]
    if (typeof (methodArgs) === 'function') { // Todo: Hmmmm..
      return methodArgs()
    }
    return objectName + '.' + methodName + script.methodHead(methodArgs)
  }

  static setAttribute (objectName, attributeHash) {
    if (!utils.common.getKeysFromHash(attributeHash).length || !objectName) {
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
    return objectName + '.' + attributeName + operator + attributeValue + ';'
  }

  static makeConstraint (keys, values) {
    let o = {}
    let n = random.range(0, keys.length)
    while (n--) {
      o[random.pick(keys)] = random.pick(values)
    }
    return o
  }

  static makeRandomOptions (baseObject) {
    let o = {}
    let unique = random.subset(Object.keys(baseObject))
    for (let i = 0; i < unique.length; i++) {
      o[unique[i]] = random.pick(baseObject[unique[i]])
    }
    return JSON.stringify(o)
  }

  static safely (obj) {
    if (Array.isArray(obj)) {
      return obj.map(s => utils.script.safely(s)).join(' ')
    } else {
      return `try { ${obj} } catch(e) { }`
    }
  }

  static makeLoop (s, max) {
    return 'for (let i = 0; i < ' + (max || make.number.range()) + '; i++) {' + s + '}'
  }

  static makeArray (type, arrayLength, cb) {
    if (type === null || type === undefined) {
      type = random.item(['Uint8', 'Float32'])
    }
    switch (random.number(8)) {
      case 0:
        let src = 'function() { let buffer = new ' + type + 'Array(' + arrayLength + ');'
        src += script.makeLoop('buffer[i] = ' + cb() + ';', arrayLength)
        src += 'return buffer;}()'
        return src
      case 1:
        return `new ${type}Array([${make.arrays.filledArray(cb, arrayLength)}])`
      default:
        return `new ${type}Array(${arrayLength})`
    }
  }

  static randListIndex (objName) {
    return random.number() + ' % ' + o.pick(objName) + '.length'
  }

  static addElementToBody (name) {
    return `(document.body || document.documentElement).appendChild${script.methodHead([name])}`
  }

  static getRandomElement () {
    return `document.getElementsByTagName('*')[${random.number(document.getElementsByTagName('*').length)}]`
  }
}

module.exports = script
