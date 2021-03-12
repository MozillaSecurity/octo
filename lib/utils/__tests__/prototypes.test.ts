/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-disable camelcase */
/* eslint-env jest */

import { prototypes } from "../prototypes"

beforeAll(() => {
  prototypes.enable()
})

describe("Prototypes", () => {
  describe("enable()", () => {
    test("defines all polyfills", () => {
      expect(typeof Object.isObject).toBe("function")
      expect(typeof "".insert).toBe("function")
    })
  })

  describe("String.insert()", () => {
    test("simple test", () => {
      const str = "foobar"
      expect(str.insert("123", 3)).toBe("foo123bar")
    })
  })

  describe("Object.isObject()", () => {
    test("simple test", () => {
      expect(Object.isObject({})).toBe(true)
      expect(Object.isObject("foobar")).toBe(false)
      expect(Object.isObject(null)).toBe(false)
      expect(Object.isObject(undefined)).toBe(false)
      expect(Object.isObject(123)).toBe(false)
      expect(Object.isObject(new Date())).toBe(false)
    })
  })
})
