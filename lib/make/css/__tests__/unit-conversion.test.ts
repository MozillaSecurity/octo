/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-env jest */

import { Angle, Frequency, Length, Resolution, Time } from "../unit-conversion"

describe("Angle", () => {
  describe("fromDeg", () => {
    test.each([
      ["deg", 1],
      ["grad", 1.1111111111111112],
      ["rad", 0.017453292519943295],
      ["turn", 0.002777777777777778],
    ])("%s", (unit: string, expected: number) => {
      expect(Angle.fromDeg(1, unit)).toEqual(expected)
    })
  })

  describe("toDeg", () => {
    test.each([
      ["deg", 1],
      ["grad", 0.9],
      ["rad", 57.29577951308232],
      ["turn", 360],
    ])("%s", (unit, expected) => {
      expect(Angle.toDeg(1, unit)).toEqual(expected)
    })
  })
})

describe("Frequency", () => {
  describe("convert to kHz and back again", () => {
    test.each([
      ["Hz", 1000],
      ["kHz", 1],
    ])("%s", (unit, expected) => {
      const result = Frequency.toKhz(1, unit)
      expect(result).toEqual(expected)
      expect(Frequency.fromKhz(result, unit)).toEqual(1)
    })
  })
})

describe("Length", () => {
  describe("convert to px and back again", () => {
    test.each([
      ["cm", 37.79527559055118],
      ["mm", 3.7795275590551185],
      ["Q", 0.9448818897637796],
      ["in", 96],
      ["pc", 16],
      ["pt", 1.3333333333333333],
      ["px", 1],
      ["em", 16],
      ["rem", 16],
      ["ex", 8],
      ["rex", 8],
      ["cap", 12],
      ["rcap", 12],
      ["ch", 8],
      ["rch", 8],
      ["ic", 16],
      ["ric", 16],
      ["lh", 19.2],
      ["rlh", 19.2],
    ])("%s", (unit, expected) => {
      const result = Length.toPx(1, unit)
      expect(result).toEqual(expected)
      expect(Length.fromPx(result, unit)).toBeCloseTo(1, 5)
    })
  })
})

describe("Resolution", () => {
  describe("convert to dppx and back again", () => {
    test.each([
      ["dppx", 1],
      ["dpi", 96],
      ["dpcm", 243.84],
    ])("%s", (unit, expected) => {
      const result = Resolution.toDppx(1, unit)
      expect(result).toEqual(expected)
      expect(Resolution.fromDppx(result, unit)).toEqual(1)
    })
  })
})

describe("Time", () => {
  describe("convert to ms and back again", () => {
    test.each([
      ["ms", 1],
      ["s", 1000],
    ])("%s", (unit, expected) => {
      const result = Time.toMs(1, unit)
      expect(result).toEqual(expected)
      expect(Time.fromMs(result, unit)).toEqual(1)
    })
  })
})

describe("invalid unit error handling", () => {
  test.each([
    ["Angle.fromDeg", (v: number, u: string) => Angle.fromDeg(v, u)],
    ["Angle.toDeg", (v: number, u: string) => Angle.toDeg(v, u)],
    ["Frequency.fromKhz", (v: number, u: string) => Frequency.fromKhz(v, u)],
    ["Frequency.toKhz", (v: number, u: string) => Frequency.toKhz(v, u)],
    ["Length.fromPx", (v: number, u: string) => Length.fromPx(v, u)],
    ["Length.toPx", (v: number, u: string) => Length.toPx(v, u)],
    ["Resolution.fromDppx", (v: number, u: string) => Resolution.fromDppx(v, u)],
    ["Resolution.toDppx", (v: number, u: string) => Resolution.toDppx(v, u)],
    ["Time.fromMs", (v: number, u: string) => Time.fromMs(v, u)],
    ["Time.toMs", (v: number, u: string) => Time.toMs(v, u)],
  ])("%s", (name, callback) => {
    expect(() => callback(1, "foobar")).toThrow("Invalid unit! (foobar)")
  })
})