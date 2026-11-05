/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { make } from "../index"
import { random } from "../../random"

const { text } = make

beforeEach(() => random.seed(1))

/**
 * Generate a number of samples.
 * @param fn - Generator.
 * @param count - Number of samples.
 */
function sample(fn: () => string, count = 300): string[] {
  return Array.from({ length: count }, () => fn())
}

describe("layoutCharCodes()", () => {
  test("produces bidi isolates", () => {
    expect(sample(text.layoutCharCodes).some((c) => /[\u2066-\u2069]/.test(c))).toBe(true)
  })
})

describe("word()", () => {
  test("returns 1-12 ASCII letters", () => {
    sample(text.word).forEach((word) => expect(word).toMatch(/^[a-z]{1,12}$/))
  })
})

describe("whitespace()", () => {
  test("returns a run of 1-3 spaces or tabs", () => {
    sample(text.whitespace).forEach((ws) => expect(ws).toMatch(/^( {1,3}|\t{1,3})$/))
  })
})

describe("rtl()", () => {
  test("returns a run of Hebrew or Arabic letters", () => {
    sample(text.rtl).forEach((rtl) =>
      expect(rtl).toMatch(/^([\u05d0-\u05ea]{1,8}|[\u0627-\u064a]{1,8})$/),
    )
  })
})

describe("cjk()", () => {
  test("returns a run of 1-6 CJK ideographs", () => {
    sample(text.cjk).forEach((cjk) => expect(cjk).toMatch(/^[\u4e00-\u9fff]{1,6}$/))
  })
})

describe("layout()", () => {
  test("returns non-empty strings", () => {
    sample(text.layout).forEach((s) => expect(s.length).toBeGreaterThan(0))
  })

  test.each([
    ["whitespace runs", / {2,}/],
    ["words", /[a-zA-Z]{4,}/],
    ["line breaks", /[\n\r]/],
    ["RTL runs", /[\u05d0-\u05ea\u0627-\u064a]{3,}/],
    ["CJK", /[\u4e00-\u9fff\u3041-\u3096]/],
    ["bidi isolates", /[\u2066-\u2069]/],
    ["consecutive layout characters", /[\u00ad\u200b-\u200f\u202a-\u202e\u2066-\u2069]{2,}/],
    ["surrogate pairs", /[\ud800-\udbff][\udc00-\udfff]/],
    ["combining marks", /[\u0300-\u036f]/],
  ])("produces %s", (_, pattern) => {
    expect(sample(text.layout).some((s) => pattern.test(s))).toBe(true)
  })

  test("produces layout characters at least as often as any()", () => {
    const layoutChars = new Set(sample(text.layoutCharCodes, 20000))
    const measure = (fn: () => string) => {
      const strings = sample(fn, 1000)
      const counts = strings.map((s) => Array.from(s).filter((c) => layoutChars.has(c)).length)
      return {
        perString: counts.reduce((a, b) => a + b, 0) / strings.length,
        withAny: counts.filter((c) => c > 0).length,
      }
    }
    const any = measure(text.any)
    const layout = measure(text.layout)
    expect(layout.perString).toBeGreaterThanOrEqual(any.perString)
    expect(layout.withAny).toBeGreaterThanOrEqual(any.withAny)
  })

  test("uses fewer random values than any()", () => {
    const count = (fn: () => string) => {
      const { prng } = random as unknown as {
        prng: { random_int(): number; random_long(): number }
      }
      const spies = [jest.spyOn(prng, "random_int"), jest.spyOn(prng, "random_long")]
      sample(fn, 200)
      const calls = spies.reduce((sum, spy) => sum + spy.mock.calls.length, 0)
      spies.forEach((spy) => spy.mockRestore())
      return calls
    }
    expect(count(text.layout)).toBeLessThan(count(text.any))
  })
})
