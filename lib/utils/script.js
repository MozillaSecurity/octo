/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

utils.script = {
  methodHead: function (list, numOptional) {
    if (isNaN(numOptional)) {
      numOptional = 0
    }
    let arity = list.length - random.number(numOptional)
    let params = []
    for (let i = 0; i < arity; i++) {
      params.push(random.pick([list[i]]))
    }
    return '(' + params.join(', ') + ')'
  },
  methodCall: function (objectName, methodHash) {
    if (!utils.common.getKeysFromHash(methodHash).length || !objectName) {
      return ''
    }
    let methodName = random.key(methodHash)
    let methodArgs = methodHash[methodName]
    if (typeof (methodArgs) === 'function') { // Todo: Hmmmm..
      return methodArgs()
    }
    return objectName + '.' + methodName + utils.script.methodHead(methodArgs)
  },
  setAttribute: function (objectName, attributeHash) {
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
  },
  makeConstraint: function (keys, values) {
    let o = {}
    let n = random.range(0, keys.length)
    while (n--) {
      o[random.pick(keys)] = random.pick(values)
    }
    return o
  },
  makeRandomOptions: function (baseObject) {
    let o = {}
    let unique = random.some(Object.keys(baseObject))
    for (let i = 0; i < unique.length; i++) {
      o[unique[i]] = random.pick(baseObject[unique[i]])
    }
    return JSON.stringify(o)
  },
  safely: function (s) {
    if (window.debug) {
      return 'try { ' + s + ' } catch(e) { logger.JSError(e); }'
    }
    return 'try { ' + s + ' } catch(e) { }'
  },
  makeLoop: function (s, max) {
    return 'for (let i = 0; i < ' + (max || make.number.rangeNumber()) + '; i++) {' + s + '}'
  },
  makeArray: function (type, arrayLength, cb) {
    if (type === null || type === undefined) {
      type = random.index(['Uint8', 'Float32'])
    }
    switch (random.number(8)) {
      case 0:
        let src = 'function() { let buffer = new ' + type + 'Array(' + arrayLength + ');'
        src += utils.script.makeLoop('buffer[i] = ' + cb() + ';', arrayLength)
        src += 'return buffer;}()'
        return src
      case 1:
        return 'new ' + type + 'Array([' + make.arrays.filledArray(cb, arrayLength) + '])'
      default:
        return 'new ' + type + 'Array(' + arrayLength + ')'
    }
  },
  randListIndex: function (objName) {
    return random.number() + ' % ' + o.pick(objName) + '.length'
  },
  addElementToBody: function (name) {
    return '(document.body || document.documentElement).appendChild' + utils.script.methodHead([name])
  },
  forceGC: function () {
    if (utils.platform.isMozilla) {
    }
    if (utils.platform.isChrome) {
      if (window.GCController) {
        return GCController.collect() // eslint-disable-line no-undef
      }
    }
    if (utils.platform.isSafari) {
    }
    if (utils.platform.isIE) {
    }
  },
  getRandomElement: function () {
    return 'document.getElementsByTagName(\'*\')[' + random.number(document.getElementsByTagName('*').length) + ']'
  }
}
