/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { decode, encode } from "html-entities"
import jsesc from "jsesc"

/** Common utilities. */
export class common {
  /**
   * Escape and quote a string.
   * @param str - Object to be quoted.
   * @param html - Identifies whether the string must be HTML safe.
   */
  static quote(str: unknown, html = false): string {
    const options = {
      isScriptContext: html,
      minimal: true,
      quotes: "double" as const,
      wrap: true,
    }

    return jsesc(str, options)
  }

  /**
   * Remove quotes and escape sequence from string.
   * @param str - String to be unquoted.
   */
  static unquote(str: string): string {
    return str
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
      .replace(/\\0/g, "\0")
      .replace(/\\\\/g, "\\")
      .replace(/(^['|"])(.*)\1$/gm, "$2")
  }

  /**
   * Unicode safe b64 encoding.
   * @param str - String to encode.
   */
  static b64encode(str: string): string {
    return Buffer.from(str).toString("base64")
  }

  /**
   * Unicode safe b64 decoding.
   * @param str - String to decode.
   */
  static b64decode(str: string): string {
    return Buffer.from(str, "base64").toString("utf8")
  }

  /**
   * Escape special characters using HTML entities.
   * @param str - String to escape.
   */
  static htmlEscape(str: string): string {
    return encode(str)
  }

  /**
   * Remove HTML entities from string.
   * @param str - String to unescape.
   */
  static htmlUnescape(str: string): string {
    return decode(str)
  }

  /**
   * Merge two objects recursively.
   * @param obj1 - Object to merge into.
   * @param obj2 - Object to merge from.
   */
  static mergeHash(
    obj1: Record<string, unknown>,
    obj2: Record<string, unknown>,
  ): Record<string, unknown> {
    for (const p in obj2) {
      try {
        const value = obj2[p]
        if (
          value !== null &&
          value !== undefined &&
          typeof value === "object" &&
          value.constructor === Object
        ) {
          obj1[p] = common.mergeHash(
            (obj1[p] ?? {}) as Record<string, unknown>,
            value as Record<string, unknown>,
          )
        } else {
          obj1[p] = value
        }
      } catch (_) {
        obj1[p] = obj2[p]
      }
    }
    return obj1
  }

  /**
   * Template string beautifier.
   * @param obj - Array of commands to beautify.
   */
  static mockup(obj: string): string {
    return obj
      .split("\n")
      .map((ln) => ln.trim())
      .join("")
  }
}
