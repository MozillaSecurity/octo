/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { random } from "../../random"
import { script } from "../script"

describe("offset()", () => {
  beforeEach(() => random.seed(1))

  test("uses the supplied expression as the modulus", () => {
    expect(script.offset("a.length + 1")).toMatch(/^\(\d+ % \(a\.length \+ 1\) \|\| 0\)$/)
  })

  test("includes the upper bound when passed length + 1", () => {
    const seen = new Set<number>()
    for (let i = 0; i < 200; i++) {
      seen.add(new Function("a", `return ${script.offset("a.length + 1")}`)([1, 2, 3, 4]))
    }
    expect([...seen].sort()).toEqual([0, 1, 2, 3, 4])
  })

  test("returns 0 for non-numeric lengths", () => {
    expect(new Function(`return ${script.offset("undefined")}`)()).toEqual(0)
  })

  test("uses a single random value", () => {
    const spy = jest.spyOn(random, "number")
    script.offset("a.length")
    expect(spy).toHaveBeenCalledTimes(1)
    spy.mockRestore()
  })
})
