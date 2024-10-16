/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-env jest */
/* eslint-disable jest/no-conditional-expect */

import { calc, datatypes, expandRange, normalizeSuffix, splitUnit } from "../datatypes"
import { random } from "../../../random"

describe("calc()", () => {
  test("multiplication", () => {
    const mockGenerator = jest.fn(() => "")
    jest.spyOn(random, "item").mockReturnValueOnce("*")
    jest.spyOn(random, "shuffled").mockReturnValueOnce(["1px", "1"])
    const value = calc(mockGenerator)
    expect(value).toEqual("calc(1px * 1)")
  })

  test("division", () => {
    const mockGenerator = jest.fn(() => "1px")
    jest.spyOn(random, "item").mockReturnValueOnce("/")
    jest.spyOn(datatypes, "number").mockReturnValueOnce("1")
    const value = calc(mockGenerator)
    expect(value).toEqual("calc(1px / 1)")
  })

  test.each([
    ["addition", "+"],
    ["subtraction", "-"],
  ])("%s", (type, op) => {
    const mockGenerator = jest.fn(() => "1")
    jest.spyOn(random, "item").mockReturnValueOnce(op)
    jest.spyOn(random, "pick").mockReturnValue("1")
    jest.spyOn(datatypes, "number").mockReturnValue("1")
    const value = calc(mockGenerator)
    expect(value).toEqual(`calc(1 ${op} 1)`)
  })
})

describe("expandRange()", () => {
  test.each([
    ["infinity", [null, null], [-2147483648, 0x7fffffff]],
    ["positive-infinity", [0, null], [0, 0xffffffff]],
    ["negative-infinity", [null, 0], [-2147483648, 0]],
    ["clamped", [0, 1], [0, 1]],
  ])("%s", (_, opts, expected) => {
    const value = expandRange(opts[0], opts[1])
    expect(value).toEqual(expected)
  })
})

type RangeType = null | number | string
describe("normalizeSuffix()", () => {
  test.each([
    ["min (null)", [null, null], [null, null]],
    ["min (unit)", ["1px", null], ["1px", null]],
    ["max (null)", [0, null], [0, null]],
    ["max (unit)", [null, "1px"], [null, "1px"]],
    ["mismatch (min)", [1, "100px"], ["1px", "100px"]],
    ["mismatch (max)", ["1px", 100], ["1px", "100px"]],
    ["negative units (min)", ["-90deg", 90], ["-90deg", "90deg"]],
  ])("%s", (name: string, values: RangeType[], expected: RangeType[]) => {
    expect(normalizeSuffix(values[0], values[1])).toEqual(expected)
  })
})

describe("splitUnit()", () => {
  test.each([
    ["positive", "90deg", 90, "deg"],
    ["negative", "-90deg", -90, "deg"],
  ])("%s", (name: string, value: string, prefix: number, suffix: string) => {
    expect(splitUnit(value)).toEqual([prefix, suffix])
  })

  test("mixed case", () => {
    expect(splitUnit("44000Hz")).toEqual([44000, "Hz"])
  })
})

describe("ranged datatypes", () => {
  describe.each([
    "angle",
    "dimension",
    "frequency",
    "flex",
    "integer",
    "length",
    "number",
    "percentage",
    "resolution",
    "time",
  ] as const)("%s", (name) => {
    test.each([
      ["positive", 0, null],
      ["negative", null, 0],
    ])("ranges (%s)", (type, min, max) => {
      const raw = datatypes[name]({ min, max })
      const value = parseInt(raw)
      if (type === "positive") {
        expect(value).toBeGreaterThanOrEqual(0)
      } else {
        expect(value).toBeLessThanOrEqual(0)
      }
    })
  })
})

describe("calc datatypes", () => {
  describe.each([
    "angle",
    "frequency",
    "integer",
    "length",
    "number",
    "percentage",
    "time",
  ] as const)("%s", (name) => {
    test("using calc values", () => {
      jest.spyOn(random, "chance").mockReturnValueOnce(true)
      const value = datatypes[name]()
      expect(value).toMatch(/calc\(.*?\)/)
    })
  })
})
