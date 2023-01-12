/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-disable camelcase */
/* eslint-env jest */

import { common } from "../common"

describe("Common", () => {
  describe("quote()", () => {
    test.each([
      ["simple strings", "foobar", '"foobar"'],
      ["strings with quotes", 'foo"bar', '"foo\\"bar"'],
      ["numbers", 123, "123"],
      ["numbers as strings", "123", '"123"'],
      ["vanilla objects", { a: 123, b: "foobar" }, '{"a":123,"b":"foobar"}'],
    ])("%s", (_, value, expected) => {
      expect(common.quote(value)).toBe(expected)
    })
  })

  describe("unquote()", () => {
    test("simple test", () => {
      expect(common.unquote(common.quote("foo'bar'"))).toBe("foo'bar'")
    })
  })

  describe("b64encode()", () => {
    test("simple test", () => {
      expect(common.b64encode("this is a test")).toBe("dGhpcyBpcyBhIHRlc3Q=")
    })
    test("utf-16", () => {
      expect(common.b64encode("☸☹☺☻☼☾☿")).toBe("4pi44pi54pi64pi74pi84pi+4pi/")
    })
  })

  describe("b64decode()", () => {
    test("simple test", () => {
      expect(common.b64decode("dGhpcyBpcyBhIHRlc3Q=")).toBe("this is a test")
    })
    test("utf-16", () => {
      expect(common.b64decode("4pi44pi54pi64pi74pi84pi+4pi/")).toBe("☸☹☺☻☼☾☿")
    })
  })

  describe("mergeHash()", () => {
    test("simple test", () => {
      const obj1 = { member_1: "abc" }
      const obj2 = { member_2: "def" }
      expect(common.mergeHash(obj1, obj2)).toEqual(
        expect.objectContaining({
          member_1: "abc",
          member_2: "def",
        })
      )
    })

    test("duplicate keys", () => {
      const obj1 = { member_1: "abc" }
      const obj2 = { member_1: "xyz", member_2: "def" }
      expect(common.mergeHash(obj1, obj2)).toEqual(
        expect.objectContaining({
          member_1: "xyz",
          member_2: "def",
        })
      )
    })
  })
})
