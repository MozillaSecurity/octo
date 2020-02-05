/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { make } from '../make'
import { random } from '../random'

export class script {
  /**
   * Helper method for appending an element to body or documentElement
   *
   * @param {string} name - Element identifier
   * @returns {string}
   */
  static addElementToBody (name: string) {
    return `(document.body || document.documentElement).appendChild(${name})`
  }

  static makeArray (type: string, arrayLength: number, cb: Function) {
    switch (random.number(8)) {
      case 0: {
        let src = `function() { let buffer = new ${type}Array(${arrayLength});`
        src += script.makeLoop(`buffer[i] = ${cb()};`, arrayLength)
        src += 'return buffer;}()'
        return src
      }
      case 1:
        return `new ${type}Array([${make.arrays.filledArray(cb, arrayLength)}])`
      default:
        return `new ${type}Array(${arrayLength})`
    }
  }

  static makeConstraint (keys: string[], values: any) {
    const dict: Record<string, any> = {}
    for (const key of random.subset(keys)) {
      dict[key] = random.pick(values)
    }
    return dict
  }

  static makeLoop (s: string, max: number) {
    return `for (let i = 0; i < ${max || make.numbers.tiny()}; i++) {${s}}`
  }

  static makeRandomOptions (baseObject: Record<string, any>) {
    const dict: Record<string, any> = {}
    const unique = random.subset(Object.keys(baseObject))
    for (let i = 0; i < unique.length; i++) {
      dict[unique[i]] = random.pick(baseObject[unique[i]])
    }
    return JSON.stringify(dict)
  }

  static methodCall (objectName: string, methodHash: Record<string, any>) {
    if (!Object.keys(methodHash).length || !objectName) {
      return ''
    }
    const methodName = random.key(methodHash)
    const methodArgs = methodHash[methodName]
    if (typeof (methodArgs) === 'function') { // Todo: Hmmmm..
      return methodArgs()
    }
    return `${objectName}.${methodName}${script.methodHead(methodArgs)}`
  }

  static methodHead (list: any[], numOptional?: number) {
    if (numOptional === undefined) {
      numOptional = 0
    }
    const arity = list.length - random.number(numOptional)
    const params: string[] = []
    for (let i = 0; i < arity; i++) {
      params.push(random.pick([list[i]]))
    }
    return `(${params.join(', ')})`
  }

  static offset (s: string) {
    return `(${random.number()} % ${s})`
  }

  /**
   * Wrap command(s) in setInterval, setTimeout, loop or run directly
   *
   * @param {string|string[]} cmds - Command(s) to be executed
   * @param {boolean} async - Use async functions
   * @returns {Array}
   */
  static runner (cmds: (string | undefined)[], async = false): string[] {
    cmds = (Array.isArray(cmds)) ? cmds : [cmds]
    const cleaned = cmds.filter(<T> (t: T | undefined): t is T => t !== undefined)
    const safe = script.safely(cleaned)
    // Wrap each command in try/catch for use in setInterval, setTimeout, repeater
    switch (random.number(50)) {
      case 0:
        return [`setInterval(${(async) ? 'async' : ''} () => { ${safe} }, ${random.range(100, 400)} )`]
      case 1:
        return [`setTimeout(${(async) ? 'async ' : ''} () => { ${safe} }, ${random.range(100, 400)} )`]
      case 2:
        return [`for (let i = 0; i < ${random.range(1, random.range(1, 30))}; i++) { ${safe} }`]
      default:
        return cleaned
    }
  }

  static safely (obj: string | string[]): string {
    if (typeof obj === 'string') {
      return `try { ${obj} } catch (e) { }`
    } else {
      return obj.map(s => script.safely(s)).join(' ')
    }
  }

  static setAttribute (objectName: string, attributeHash: Record<string, any>) {
    if (!Object.keys(attributeHash).length || !objectName) {
      return ''
    }
    const attributeName = random.key(attributeHash)
    const attributeValue = random.pick(attributeHash[attributeName])
    const operator = ' = '
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
