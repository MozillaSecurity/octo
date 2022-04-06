/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { make } from "../make"
import { random } from "../random"

/**
 * DOM-related JavaScript command generators.
 */
export class script {
  /**
   * Helper method for appending an element to body or documentElement.
   *
   * @param name - Element identifier.
   */
  static addElementToBody(name: string): string {
    return `(document.body || document.documentElement).appendChild(${name})`
  }

  /**
   * Generates a typed array filled with contents.
   *
   * @deprecated - This method does not appear to be useful and will be removed.
   * @param type - The type of TypedArray to create.
   * @param arrayLength - The array length.
   * @param cb - A callback that will fill the array.
   */
  static makeArray(type: string, arrayLength: number, cb: () => any): string {
    switch (random.number(8)) {
      case 0: {
        let src = `function() { let buffer = new ${type}Array(${arrayLength});`
        src += script.makeLoop(`buffer[i] = ${cb()};`, arrayLength)
        src += "return buffer;}()"
        return src
      }
      case 1:
        return `new ${type}Array([${make.arrays.filledArray(cb, arrayLength)}])`
      default:
        return `new ${type}Array(${arrayLength})`
    }
  }

  /**
   * Dynamically create dictionary using array of keys and values.
   *
   * @param keys - Array of keys.
   * @param values - Array of values.
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static makeConstraint(keys: string[], values: any): Record<string, any> {
    const dict: Record<string, any> = {}
    for (const key of random.subset(keys)) {
      dict[key] = random.pick(values)
    }
    return dict
  }

  /**
   * Wraps the supplied command in a loop.
   *
   * @param s - The command to wrap.
   * @param max - The number of iterations to perform.
   */
  static makeLoop(s: string, max: number): string {
    return `for (let i = 0; i < ${max || make.numbers.tiny()}; i++) {${s}}`
  }

  /**
   * Shuffles dictionary keys and values.
   *
   * @param baseObject - The base object to modify.
   */
  static makeRandomOptions(baseObject: Record<string, any>): string {
    const dict: Record<string, any> = {}
    const unique = random.subset(Object.keys(baseObject))
    for (let i = 0; i < unique.length; i++) {
      dict[unique[i]] = random.pick(baseObject[unique[i]])
    }
    return JSON.stringify(dict)
  }

  /**
   * Generate a method call command.
   *
   * @param objectName - The object variable name.
   * @param methodHash - The object method to target.
   */
  static methodCall(objectName: string, methodHash: Record<string, any>): any {
    if (!Object.keys(methodHash).length || !objectName) {
      return ""
    }
    const methodName = random.key(methodHash)
    const methodArgs = methodHash[methodName]
    if (typeof methodArgs === "function") {
      // Todo: Hmm..
      return methodArgs()
    }
    return `${objectName}.${methodName}${script.methodHead(methodArgs)}`
  }

  /**
   * Generate method using a subset of the supplied values.
   *
   * @param list - Array of values.
   * @param numOptional - Number of values that are optional.
   */
  static methodHead(list: any[], numOptional?: number): string {
    if (numOptional === undefined) {
      numOptional = 0
    }
    const arity = list.length - random.number(numOptional)
    const params: string[] = []
    for (let i = 0; i < arity; i++) {
      params.push(random.pick([list[i]]))
    }
    return `(${params.join(", ")})`
  }

  /**
   * Returns a command that generates the modulo of a value. Useful for identifying lengths in
   * dynamic entries.
   *
   * @example Const offset = utils.script.offset("document.childNodes.length")
   * document.body.appendChild(document.childNodes[eval(offset)])
   *
   * @param s - The variable to generate a modulo for.
   */
  static offset(s: string): string {
    return `(${random.number()} % ${s})`
  }

  /**
   * Wrap command(s) in setInterval, setTimeout, loop or run directly.
   *
   * @param cmds - Command(s) to be executed.
   * @param async - Use async functions.
   */
  static runner(cmds: (string | undefined)[], async = false): string[] {
    cmds = Array.isArray(cmds) ? cmds : [cmds]
    const cleaned = cmds.filter(<T>(t: T | undefined): t is T => t !== undefined)
    const safe = script.safely(cleaned)
    switch (random.number(50)) {
      case 0:
        return [
          `setInterval(${async ? "async" : ""} () => { ${safe} }, ${random.range(1000, 2000)} )`,
        ]
      case 1:
        return [`setTimeout(${async ? "async" : ""} () => { ${safe} }, ${random.range(100, 400)} )`]
      case 2:
        return [`for (let i = 0; i < ${random.range(1, random.range(1, 30))}; i++) { ${safe} }`]
      default:
        return cleaned
    }
  }

  /**
   * Wrap a command in try/catch.
   *
   * @param cmd - The command or array of commands to be wrapped.
   */
  static safely(cmd: string | string[]): string {
    if (typeof cmd === "string") {
      return `try { ${cmd} } catch (e) { }`
    } else {
      return cmd.map((s) => script.safely(s)).join(" ")
    }
  }

  /**
   * Generate a command that sets an attribute.
   *
   * @param objectName - The object variable name.
   * @param attributeHash - An object containing attribute names and values.
   */
  static setAttribute(objectName: string, attributeHash: Record<string, any>): string {
    if (!Object.keys(attributeHash).length || !objectName) {
      return ""
    }
    const attributeName = random.key(attributeHash)
    const attributeValue = random.pick(attributeHash[attributeName])
    return `${objectName}.${attributeName} = ${attributeValue};`
  }

  /**
   * Generate function used for timing out promises that never reject or resolve.
   *
   * @param time - Time limit.
   */
  static promiseTimeout(time: number): string {
    return [
      `async function (cmd) {`,
      `  const timer = new Promise((resolve, reject) => {`,
      `    const id = setTimeout(() => {`,
      `      clearTimeout(id)`,
      `      reject(new Error('Promise timed out!'))`,
      `  }, ${time})`,
      `  })`,
      `  return Promise.race([cmd, timer])`,
      `}`,
    ].join("\n")
  }
}
