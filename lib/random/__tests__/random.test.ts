/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-disable camelcase */
/* eslint-env jest */
import { random } from "../"

describe("Random", () => {
  test("init", () => {
    expect(() => {
      random.number()
    }).toThrow()
    random.seed(1)
    random.number()
  })

  test("number() corner cases", () => {
    random.seed(Math.random() * 0x100000000)
    let sum = 0

    for (let i = 0; i < 100; ++i) {
      sum += random.number(0)
    }
    expect(sum).toEqual(0)

    for (let i = 0; i < 100; ++i) {
      sum += random.number(1)
    }
    expect(sum).toEqual(0)

    const bins = new Uint32Array(2)
    for (let i = 0; i < 100; ++i) {
      ++bins[random.number(2)]
    }
    expect(bins[0] + bins[1]).toEqual(100)
    expect(bins[0]).toBeGreaterThan(20)

    sum = 0
    for (let i = 0; i < 15; ++i) {
      sum |= random.number()
    }
    expect(sum >>> 0).toEqual(0xffffffff)
  })

  test("number() uniform distribution", () => {
    const N = Math.pow(2, 17)
    const TRIES = 3
    const XSQ = 564.7 // quantile of chi-square dist. k=511, p=.05

    random.seed(Math.random() * 0x100000000)

    const _test = () => {
      const tries = []
      for (let attempt = 0; attempt < TRIES; ++attempt) {
        const bins = new Uint32Array(512)
        for (let i = 0; i < N; ++i) {
          const tmp = random.number(bins.length)
          expect(tmp).toBeLessThan(bins.length)
          ++bins[tmp]
        }
        const xsq = bins.reduce((a, v) => {
          const e = N / bins.length
          return a + Math.pow(v - e, 2) / e
        }, 0)
        /*
         * XSQ = scipy.stats.chi2.isf(.05, 511)
         * if xsq > XSQ, the result is biased at 95% significance
         */
        if (xsq < XSQ) {
          console.log(`Expected x^2 to be < ${XSQ}, got ${xsq} on attempt #${attempt + 1}`)
          return true
        }
        tries.push(xsq)
      }
      // assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": " + tries)
      return false
    }

    expect(_test()).toBe(true)
  })

  test("float() uniform distribution", () => {
    const N = Math.pow(2, 17)
    const TRIES = 3
    const XSQ = 564.7 // quantile of chi-square dist. k=511, p=.05

    random.seed(Math.random() * 0x100000000)

    const _test = () => {
      const tries = []
      for (let attempt = 0; attempt < TRIES; ++attempt) {
        const bins = new Uint32Array(512)
        for (let i = 0; i < N; ++i) {
          const tmp = (random.float() * bins.length) >>> 0
          expect(tmp).toBeLessThan(bins.length)
          ++bins[tmp]
        }
        const xsq = bins.reduce((a, v) => {
          const e = N / bins.length
          return a + Math.pow(v - e, 2) / e
        }, 0)
        /*
         * XSQ = scipy.stats.chi2.isf(.05, 511)
         * if xsq > XSQ, the result is biased at 95% significance
         */
        if (xsq < XSQ) {
          console.log(`Expected x^2 to be < ${XSQ}, got ${xsq} on attempt #${attempt + 1}`)
          return true
        }
        tries.push(xsq)
      }
      // assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": " + tries)
      return false
    }

    expect(_test()).toBe(true)
  })

  test("range() uniform distribution", () => {
    const N = 1e4
    const TRIES = 3
    const XSQ = 66.34 // quantile of chi-square dist. k=49, p=.05

    random.seed(Math.random() * 0x100000000)

    const _test = () => {
      const tries = []
      for (let attempt = 0; attempt < TRIES; ++attempt) {
        const bins = new Uint32Array(50)
        for (let i = 0; i < N; ++i) {
          const tmp = random.range(0, bins.length - 1)
          expect(tmp).toBeLessThan(bins.length)
          ++bins[tmp]
        }
        const xsq = bins.reduce((a, v) => {
          const e = N / bins.length
          return a + Math.pow(v - e, 2) / e
        }, 0)
        /*
         * XSQ = scipy.stats.chi2.isf(.05, 49)
         * if xsq > XSQ, the result is biased at 95% significance
         */
        if (xsq < XSQ) {
          console.log(`Expected x^2 to be < ${XSQ}, got ${xsq} on attempt #${attempt + 1}`)
          return true
        }
        tries.push(xsq)
      }
      // assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": " + tries)
      return false
    }

    expect(_test()).toBe(true)
  })

  test("range() uniform distribution with offset", () => {
    const N = 1e4
    const TRIES = 3
    const XSQ = 66.34 // quantile of chi-square dist. k=49, p=.05

    random.seed(Math.random() * 0x100000000)

    const _test = () => {
      const tries = []
      for (let attempt = 0; attempt < TRIES; ++attempt) {
        const bins = new Uint32Array(50)
        for (let i = 0; i < N; ++i) {
          const tmp = random.range(10, 10 + bins.length - 1) - 10
          expect(tmp).toBeGreaterThanOrEqual(0)
          expect(tmp).toBeLessThan(bins.length)
          ++bins[tmp]
        }
        const xsq = bins.reduce((a, v) => {
          const e = N / bins.length
          return a + Math.pow(v - e, 2) / e
        }, 0)
        /*
         * XSQ = scipy.stats.chi2.isf(.05, 49)
         * if xsq > XSQ, the result is biased at 95% significance
         */
        if (xsq < XSQ) {
          console.log(`Expected x^2 to be < ${XSQ}, got ${xsq} on attempt #${attempt + 1}`)
          return true
        }
        tries.push(xsq)
      }
      // assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": " + tries)
      return false
    }

    expect(_test()).toBe(true)
  })

  test("range() PRNG reproducibility", () => {
    let seed, result1, result2
    seed = Math.random() * 0x100000000
    for (let t = 0; t < 50; ++t) {
      random.seed(seed)
      result1 = random.range(1, 20)
      for (let i = 0; i < 5; ++i) {
        random.seed(seed)
        result2 = random.range(1, 20)
        expect(result1).toBe(result2)
      }
      seed = random.number()
    }
  })

  test("item() distribution with list", () => {
    const N = 1e4
    const TRIES = 3
    const XSQ = 5.99 // quantile of chi-square dist. k=2, p=.05

    random.seed(Math.random() * 0x100000000)

    const _test = () => {
      const tries = []
      for (let attempt = 0; attempt < TRIES; ++attempt) {
        const bins = new Uint32Array(3)
        for (let i = 0; i < N; ++i) {
          const tmp = random.item([99, 100, 101]) - 99
          expect(tmp).toBeGreaterThanOrEqual(0)
          expect(tmp).toBeLessThan(bins.length)
          ++bins[tmp]
        }
        const xsq = bins.reduce((a, v) => {
          const e = N / bins.length
          return a + Math.pow(v - e, 2) / e
        }, 0)
        /*
         * XSQ = scipy.stats.chi2.isf(.05, 2)
         * if xsq > XSQ, the result is biased at 95% significance
         */
        if (xsq < XSQ) {
          console.log(`Expected x^2 to be < ${XSQ}, got ${xsq} on attempt #${attempt + 1}`)
          return true
        }
        tries.push(xsq)
      }

      // assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": " + tries)
      return false
    }

    expect(_test()).toBe(true)
  })

  test("key() distribution", () => {
    const N = 1e4
    const TRIES = 3
    const XSQ = 5.99 // quantile of chi-square dist. k=2, p=.05

    random.seed(Math.random() * 0x100000000)

    const _test = () => {
      const tries = []
      for (let attempt = 0; attempt < TRIES; ++attempt) {
        const bins = new Uint32Array(3)
        for (let i = 0; i < N; ++i) {
          const tmp = +random.key({ 99: 0, 100: 0, 101: 0 }) - 99
          expect(tmp).toBeGreaterThanOrEqual(0)
          expect(tmp).toBeLessThan(bins.length)
          ++bins[tmp]
        }
        const xsq = bins.reduce((a, v) => {
          const e = N / bins.length
          return a + Math.pow(v - e, 2) / e
        }, 0)
        /*
         * XSQ = scipy.stats.chi2.isf(.05, 2)
         * if xsq > XSQ, the result is biased at 95% significance
         */
        if (xsq < XSQ) {
          console.log(`Expected x^2 to be < ${XSQ}, got ${xsq} on attempt #${attempt + 1}`)
          return true
        }
        tries.push(xsq)
      }
      // assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": " + tries)
      return false
    }
    expect(_test()).toBe(true)
  })

  test("bool() distribution", () => {
    const N = 1e4
    const TRIES = 3
    const XSQ = 3.84 // quantile of chi-square dist. k=1, p=.05

    random.seed(Math.random() * 0x100000000)

    const _test = () => {
      const tries = []
      for (let attempt = 0; attempt < TRIES; ++attempt) {
        const bins = new Uint32Array(2)
        for (let i = 0; i < N; ++i) {
          const tmp = random.bool() ? 1 : 0
          ++bins[tmp]
        }
        const xsq = bins.reduce((a, v) => {
          const e = N / bins.length
          return a + Math.pow(v - e, 2) / e
        }, 0)
        /*
         * XSQ = scipy.stats.chi2.isf(.05, 1)
         * if xsq > XSQ, the result is biased at 95% significance
         */
        if (xsq < XSQ) {
          console.log(`Expected x^2 to be < ${XSQ}, got ${xsq} on attempt #${attempt + 1}`)
          return true
        }
        tries.push(xsq)
      }
      // assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": " + tries)
      return false
    }
    expect(_test()).toBe(true)
  })

  test("pick() cases", () => {
    random.seed(Math.random() * 0x100000000)

    for (let i = 0; i < 100; ++i) {
      const tmp = Math.random()
      expect(random.pick(tmp)).toEqual(tmp)
    }

    for (let i = 0; i < 100; ++i) {
      const tmp = (Math.random() * 100) >>> 0
      expect(random.pick(tmp)).toEqual(tmp)
    }

    for (let i = 0; i < 100; ++i) {
      const tmp = Math.random() + ""
      expect(random.pick(tmp)).toEqual(tmp)
    }

    for (let i = 0; i < 100; ++i) {
      const tmp = Math.random()
      expect(random.pick([tmp])).toEqual(tmp)
    }

    for (let i = 0; i < 100; ++i) {
      const tmp = Math.random()
      expect(random.pick(() => tmp)).toEqual(tmp)
    }

    for (let i = 0; i < 100; ++i) {
      const tmp = Math.random()
      expect(random.pick(() => [tmp])).toEqual([tmp])
    }
  })

  test("pick() with equal distribution", () => {
    const N = 1e4
    const TRIES = 3
    const XSQ = 5.99 // quantile of chi-square dist. k=2, p=.05

    random.seed(Math.random() * 0x100000000)

    const _test = () => {
      const tries = []
      for (let attempt = 0; attempt < TRIES; ++attempt) {
        const bins = new Uint32Array(3)
        for (let i = 0; i < N; ++i) {
          const tmp = random.pick([0, [1, 1], () => 2])
          expect(tmp).toBeGreaterThanOrEqual(0)
          expect(tmp).toBeLessThan(bins.length)
          ++bins[tmp]
        }
        const xsq = bins.reduce((a, v) => {
          const e = N / bins.length
          return a + Math.pow(v - e, 2) / e
        }, 0)
        /*
         * XSQ = scipy.stats.chi2.isf(.05, 2)
         * if xsq > XSQ, the result is biased at 95% significance
         */
        if (xsq < XSQ) {
          console.log(`Expected x^2 to be < ${XSQ}, got ${xsq} on attempt #${attempt + 1}`)
          return true
        }
        tries.push(xsq)
      }
      // assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": " + tries)
      return false
    }

    expect(_test()).toBe(true)
  })

  test("pick() with unequal distribution", () => {
    const N = 1e4
    const TRIES = 3
    const XSQ = 5.99 // quantile of chi-square dist. k=2, p=.05

    random.seed(Math.random() * 0x100000000)

    const _test = () => {
      const tries = []
      for (let attempt = 0; attempt < TRIES; ++attempt) {
        const bins = new Uint32Array(3)
        for (let i = 0; i < N; ++i) {
          const tmp = random.pick([[0, 1], [1], () => 2])
          expect(tmp).toBeGreaterThanOrEqual(0)
          expect(tmp).toBeLessThan(bins.length)
          ++bins[tmp]
        }
        const xsq =
          Math.pow(bins[0] - N / 6, 2) / (N / 6) +
          Math.pow(bins[1] - N / 2, 2) / (N / 2) +
          Math.pow(bins[2] - N / 3, 2) / (N / 3)
        /*
         * XSQ = scipy.stats.chi2.isf(.05, 2)
         * if xsq > XSQ, the result is biased at 95% significance
         */
        if (xsq < XSQ) {
          console.log(`Expected x^2 to be < ${XSQ}, got ${xsq} on attempt #${attempt + 1}`)
          return true
        }
        tries.push(xsq)
      }
      // assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": " + tries)
      return false
    }

    expect(_test()).toBe(true)
  })

  test("chance(undefined) distribution", () => {
    const N = 1e4
    const TRIES = 3
    const XSQ = 3.84 // quantile of chi-square dist. k=1, p=.05

    random.seed(Math.random() * 0x100000000)

    const _test = () => {
      const tries = []
      for (let attempt = 0; attempt < TRIES; ++attempt) {
        const bins = new Uint32Array(2)
        for (let i = 0; i < N; ++i) {
          const tmp = random.chance() ? 1 : 0
          ++bins[tmp]
        }
        const xsq = bins.reduce((a, v) => {
          const e = N / bins.length
          return a + Math.pow(v - e, 2) / e
        }, 0)
        /*
         * XSQ = scipy.stats.chi2.isf(.05, 1)
         * if xsq > XSQ, the result is biased at 95% significance
         */
        if (xsq < XSQ) {
          console.log(`Expected x^2 to be < ${XSQ}, got ${xsq} on attempt #${attempt + 1}`)
          return true
        }
        tries.push(xsq)
      }
      // assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": " + tries)
      return false
    }

    expect(_test()).toBe(true)
  })

  test("chance(2) distribution", () => {
    const N = 1e4
    const TRIES = 3
    const XSQ = 3.84 // quantile of chi-square dist. k=1, p=.05

    random.seed(Math.random() * 0x100000000)

    const _test = () => {
      const tries = []
      for (let attempt = 0; attempt < TRIES; ++attempt) {
        const bins = new Uint32Array(2)
        for (let i = 0; i < N; ++i) {
          const tmp = random.chance(2) ? 1 : 0
          ++bins[tmp]
        }
        const xsq = bins.reduce((a, v) => {
          const e = N / bins.length
          return a + Math.pow(v - e, 2) / e
        }, 0)
        /*
         * XSQ = scipy.stats.chi2.isf(.05, 1)
         * if xsq > XSQ, the result is biased at 95% significance
         */
        if (xsq < XSQ) {
          console.log(`Expected x^2 to be < ${XSQ}, got ${xsq} on attempt #${attempt + 1}`)
          return true
        }
        tries.push(xsq)
      }
      // assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": " + tries)
      return false
    }

    expect(_test()).toBe(true)
  })

  test("chance(3) distribution", () => {
    const N = 1e4
    const TRIES = 3
    const XSQ = 3.84 // quantile of chi-square dist. k=1, p=.05

    random.seed(Math.random() * 0x100000000)

    const _test = () => {
      const tries = []
      for (let attempt = 0; attempt < TRIES; ++attempt) {
        const bins = new Uint32Array(2)
        for (let i = 0; i < N; ++i) {
          const tmp = random.chance(3) ? 0 : 1
          ++bins[tmp]
        }
        const xsq =
          Math.pow(bins[0] - N / 3, 2) / (N / 3) +
          Math.pow(bins[1] - (2 * N) / 3, 2) / ((2 * N) / 3)
        /*
         * XSQ = scipy.stats.chi2.isf(.05, 1)
         * if xsq > XSQ, the result is biased at 95% significance
         */
        if (xsq < XSQ) {
          console.log(`Expected x^2 to be < ${XSQ}, got ${xsq} on attempt #${attempt + 1}`)
          return true
        }
        tries.push(xsq)
      }
      // assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": " + tries)
      return false
    }

    expect(_test()).toBe(true)
  })

  test("chance(1000) distribution", () => {
    const N = 1e6
    const TRIES = 3
    const XSQ = 3.84 // quantile of chi-square dist. k=1, p=.05

    random.seed(Math.random() * 0x100000000)

    const _test = () => {
      const tries = []
      for (let attempt = 0; attempt < TRIES; ++attempt) {
        const bins = new Uint32Array(2)
        for (let i = 0; i < N; ++i) {
          const tmp = random.chance(1000) ? 0 : 1
          ++bins[tmp]
        }
        const xsq =
          Math.pow(bins[0] - N / 1000, 2) / (N / 1000) +
          Math.pow(bins[1] - (999 * N) / 1000, 2) / ((999 * N) / 1000)
        /*
         * XSQ = scipy.stats.chi2.isf(.05, 1)
         * if xsq > XSQ, the result is biased at 95% significance
         */
        if (xsq < XSQ) {
          console.log(`Expected x^2 to be < ${XSQ}, got ${xsq} on attempt #${attempt + 1}`)
          return true
        }
        tries.push(xsq)
      }
      // assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": " + tries)
      return false
    }

    expect(_test()).toBe(true)
  })

  test("choose() with equal distribution", () => {
    const N = 1e4
    const TRIES = 3
    const XSQ = 5.99 // quantile of chi-square dist. k=2, p=.05

    random.seed(Math.random() * 0x100000000)

    const _test = () => {
      const tries = []
      for (let attempt = 0; attempt < TRIES; ++attempt) {
        const bins = new Uint32Array(3)
        for (let i = 0; i < N; ++i) {
          const tmp = random.choose([
            [1, 0],
            [1, 1],
            [1, 2],
          ])
          expect(tmp).toBeLessThan(bins.length)
          ++bins[tmp]
        }
        const xsq = bins.reduce((a, v) => {
          const e = N / bins.length
          return a + Math.pow(v - e, 2) / e
        }, 0)
        /*
         * XSQ = scipy.stats.chi2.isf(.05, 2)
         * if xsq > XSQ, the result is biased at 95% significance
         */
        if (xsq < XSQ) {
          console.log(`Expected x^2 to be < ${XSQ}, got ${xsq} on attempt #${attempt + 1}`)
          return true
        }
        tries.push(xsq)
      }
      // assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": " + tries)
      return false
    }

    expect(_test()).toBe(true)
  })

  test.skip("choose() with unequal distribution", () => {
    const N = 1e4
    const TRIES = 3
    const XSQ = 5.99 // quantile of chi-square dist. k=2, p=.05

    random.seed(Math.random() * 0x100000000)

    const _test = () => {
      const tries = []
      for (let attempt = 0; attempt < TRIES; ++attempt) {
        const bins = new Uint32Array(3)
        for (let i = 0; i < N; ++i) {
          const tmp = random.choose([
            [1, 0],
            [2, 1],
            [1, 2],
          ])
          expect(tmp).toBeLessThan(bins.length)
          ++bins[tmp]
        }
        const xsq =
          Math.pow(bins[0] - N / 4, 2) / (N / 4) +
          Math.pow(bins[1] - N / 2, 2) / (N / 2) +
          Math.pow(bins[2] - N / 4, 2) / (N / 4)
        /*
         * XSQ = scipy.stats.chi2.isf(.05, 2)
         * if xsq > XSQ, the result is biased at 95% significance
         */
        if (xsq < XSQ) {
          console.log(`Expected x^2 to be < ${XSQ}, got ${xsq} on attempt #${attempt + 1}`)
          return true
        }
        tries.push(xsq)
      }
      // assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": " + tries)
      return false
    }

    expect(_test()).toBe(true)
  })

  test("choose(flat) equal distribution with types not picked", () => {
    const N = 1e4
    const TRIES = 3
    const XSQ = 5.99 // quantile of chi-square dist. k=2, p=.05
    const v1 = 1
    const v2 = [12]
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const v3 = () => {}

    random.seed(Math.random() * 0x100000000)

    const _test = () => {
      const tries = []
      for (let attempt = 0; attempt < TRIES; ++attempt) {
        const bins = new Uint32Array(3)
        for (let i = 0; i < N; ++i) {
          let tmp = random.choose(
            [
              [1, v1],
              [1, v2],
              [1, v3],
            ],
            true,
          )
          if (tmp === v1) {
            tmp = 0
          } else if (tmp === v2) {
            tmp = 1
          } else if (tmp === v3) {
            tmp = 2
          } else {
            throw new Error(`Unexpected random.choose() result: ${tmp}`)
          }
          ++bins[tmp]
        }
        const xsq = bins.reduce((a, v) => {
          const e = N / bins.length
          return a + Math.pow(v - e, 2) / e
        }, 0)
        /*
         * XSQ = scipy.stats.chi2.isf(.05, 2)
         * if xsq > XSQ, the result is biased at 95% significance
         */
        if (xsq < XSQ) {
          console.log(`Expected x^2 to be < ${XSQ}, got ${xsq} on attempt #${attempt + 1}`)
          return true
        }
        tries.push(xsq)
      }
      // assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": " + tries)
      return false
    }

    expect(_test()).toBe(true)
  })

  test("weighted() with equal distribution", () => {
    const N = 1e4
    const TRIES = 3
    const XSQ = 5.99 // quantile of chi-square dist. k=2, p=.05

    random.seed(Math.random() * 0x100000000)

    const _test = () => {
      const tries = []
      for (let attempt = 0; attempt < TRIES; ++attempt) {
        const bins = new Uint32Array(3)
        for (let i = 0; i < N; ++i) {
          const tmp = random.item(
            random.weighted([
              { w: 1, v: 0 },
              { w: 1, v: 1 },
              { w: 1, v: 2 },
            ]),
          )
          expect(tmp).toBeLessThan(bins.length)
          ++bins[tmp]
        }
        const xsq = bins.reduce((a, v) => {
          const e = N / bins.length
          return a + Math.pow(v - e, 2) / e
        }, 0)
        /*
         * XSQ = scipy.stats.chi2.isf(.05, 2)
         * if xsq > XSQ, the result is biased at 95% significance
         */
        if (xsq < XSQ) {
          console.log(`Expected x^2 to be < ${XSQ}, got ${xsq} on attempt #${attempt + 1}`)
          return true
        }
        tries.push(xsq)
      }
      // assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": " + tries)
      return false
    }

    expect(_test()).toBe(true)
  })

  test("choose(flat) with unequal distribution", () => {
    const N = 1e4
    const TRIES = 3
    const XSQ = 5.99 // quantile of chi-square dist. k=2, p=.05

    random.seed(Math.random() * 0x100000000)

    const _test = () => {
      const tries = []
      for (let attempt = 0; attempt < TRIES; ++attempt) {
        const bins = new Uint32Array(3)
        for (let i = 0; i < N; ++i) {
          const tmp = random.choose(
            [
              [1, 0],
              [2, 1],
              [1, 2],
            ],
            true,
          )
          expect(tmp).toBeLessThan(bins.length)
          ++bins[tmp]
        }
        const xsq =
          Math.pow(bins[0] - N / 4, 2) / (N / 4) +
          Math.pow(bins[1] - N / 2, 2) / (N / 2) +
          Math.pow(bins[2] - N / 4, 2) / (N / 4)
        /*
         * XSQ = scipy.stats.chi2.isf(.05, 2)
         * if xsq > XSQ, the result is biased at 95% significance
         */
        if (xsq < XSQ) {
          console.log(`Expected x^2 to be < ${XSQ}, got ${xsq} on attempt #${attempt + 1}`)
          return true
        }
        tries.push(xsq)
      }
      // assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": " + tries)
      return false
    }

    expect(_test()).toBe(true)
  })

  test("weighted() with unequal distribution", () => {
    const N = 1e4
    const TRIES = 3
    const XSQ = 5.99 // quantile of chi-square dist. k=2, p=.05

    random.seed(Math.random() * 0x100000000)

    const _test = () => {
      const tries = []
      for (let attempt = 0; attempt < TRIES; ++attempt) {
        const bins = new Uint32Array(3)
        for (let i = 0; i < N; ++i) {
          const tmp = random.item(
            random.weighted([
              { w: 1, v: 0 },
              { w: 2, v: 1 },
              { w: 1, v: 2 },
            ]),
          )
          expect(tmp).toBeLessThan(bins.length)
          ++bins[tmp]
        }
        const xsq =
          Math.pow(bins[0] - N / 4, 2) / (N / 4) +
          Math.pow(bins[1] - N / 2, 2) / (N / 2) +
          Math.pow(bins[2] - N / 4, 2) / (N / 4)
        /*
         * XSQ = scipy.stats.chi2.isf(.05, 2)
         * if xsq > XSQ, the result is biased at 95% significance
         */
        if (xsq < XSQ) {
          console.log(`Expected x^2 to be < ${XSQ}, got ${xsq} on attempt #${attempt + 1}`)
          return true
        }
        tries.push(xsq)
      }
      // assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": " + tries)
      return false
    }

    expect(_test()).toBe(true)
  })

  test("weighted() equal distribution with types not picked", () => {
    const N = 1e4
    const TRIES = 3
    const XSQ = 5.99 // quantile of chi-square dist. k=2, p=.05
    const v1 = 1
    const v2 = [12]
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const v3 = () => {}

    random.seed(Math.random() * 0x100000000)
    const _test = () => {
      const tries = []
      for (let attempt = 0; attempt < TRIES; ++attempt) {
        const bins = new Uint32Array(3)
        for (let i = 0; i < N; ++i) {
          let tmp: number | number[] | (() => undefined) = random.item(
            random.weighted([
              { w: 1, v: v1 },
              { w: 1, v: v2 },
              { w: 1, v: v3 },
            ]),
          )
          if (tmp === v1) {
            tmp = 0
          } else if (tmp === v2) {
            tmp = 1
          } else if (tmp === v3) {
            tmp = 2
          } else {
            throw new Error(`Unexpected random.weighted() result: ${tmp}`)
          }
          ++bins[tmp]
        }
        const xsq = bins.reduce((a, v) => {
          const e = N / bins.length
          return a + Math.pow(v - e, 2) / e
        }, 0)
        /*
         * XSQ = scipy.stats.chi2.isf(.05, 2)
         * if xsq > XSQ, the result is biased at 95% significance
         */
        if (xsq < XSQ) {
          console.log(`Expected x^2 to be < ${XSQ}, got ${xsq} on attempt #${attempt + 1}`)
          return true
        }
        tries.push(xsq)
      }
      // assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": "+ tries);
      return false
    }
    expect(_test()).toBe(true)
  })

  test("choose() with unequal distribution and pick", () => {
    const N = 1e4
    const TRIES = 3
    const XSQ = 5.99 // quantile of chi-square dist. k=2, p=.05

    random.seed(Math.random() * 0x100000000)

    const _test = () => {
      const tries = []
      for (let attempt = 0; attempt < TRIES; ++attempt) {
        const bins = new Uint32Array(3)
        for (let i = 0; i < N; ++i) {
          const tmp = random.choose([
            [1, 0],
            [2, [1, 2]],
            [1, () => 2],
          ])
          expect(tmp).toBeGreaterThanOrEqual(0)
          expect(tmp).toBeLessThan(bins.length)
          ++bins[tmp]
        }
        const xsq =
          Math.pow(bins[0] - N / 4, 2) / (N / 4) +
          Math.pow(bins[1] - N / 4, 2) / (N / 4) +
          Math.pow(bins[2] - N / 2, 2) / (N / 2)
        /*
         * XSQ = scipy.stats.chi2.isf(.05, 2)
         * if xsq > XSQ, the result is biased at 95% significance
         */
        if (xsq < XSQ) {
          console.log(`Expected x^2 to be < ${XSQ}, got ${xsq} on attempt #${attempt + 1}`)
          return true
        }
        tries.push(xsq)
      }
      // assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": "+ tries);
      return false
    }
    expect(_test()).toBe(true)
  })

  test("use() distribution", () => {
    const N = 1e4
    const TRIES = 3
    const XSQ = 3.84 // quantile of chi-square dist. k=1, p=.05

    random.seed(Math.random() * 0x100000000)

    const _test = () => {
      const tries = []
      for (let attempt = 0; attempt < TRIES; ++attempt) {
        const bins = new Uint32Array(2)
        for (let i = 0; i < N; ++i) {
          const rnd = Math.random()
          let use = random.use(rnd)
          if (use === rnd) {
            use = 1
          } else if (use === "") {
            use = 0
          } else {
            throw new Error(`Unexpected random.use() result: ${use}`)
          }
          ++bins[use]
        }
        const xsq = bins.reduce((a, v) => {
          const e = N / bins.length
          return a + Math.pow(v - e, 2) / e
        }, 0)
        /*
         * XSQ = scipy.stats.chi2.isf(.05, 1)
         * if xsq > XSQ, the result is biased at 95% significance
         */
        if (xsq < XSQ) {
          console.log(`Expected x^2 to be < ${XSQ}, got ${xsq} on attempt #${attempt + 1}`)
          return true
        }
        tries.push(xsq)
      }
      // assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": "+ tries);
      return false
    }
    expect(_test()).toBe(true)
  })

  test("shuffle() distribution", () => {
    const N = 1e4
    const M = 10
    const TRIES = 3
    const XSQ = 123.23 // quantile of chi-square dist. k=M*M-1, p=.05
    // XXX: shouldn't k be M! ?

    random.seed(Math.random() * 0x100000000)

    const _test = () => {
      const tries = []
      for (let attempt = 0; attempt < TRIES; ++attempt) {
        const bins = new Uint32Array(M * M)
        for (let i = 0; i < N; ++i) {
          const array = []
          for (let j = 0; j < M; ++j) array.push(j)
          random.shuffle(array)
          for (let j = 0; j < M; ++j) ++bins[j * M + array[j]]
        }
        const xsq = bins.reduce((a, v) => {
          const e = N / M
          return a + Math.pow(v - e, 2) / e
        }, 0)
        /*
         * XSQ = scipy.stats.chi2.isf(.05, 99)
         * if xsq > XSQ, the result is biased at 95% significance
         */
        if (xsq < XSQ) {
          console.log(`Expected x^2 to be < ${XSQ}, got ${xsq} on attempt #${attempt + 1}`)
          return true
        }
        tries.push(xsq)
      }
      // assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": "+ tries);
      return false
    }

    expect(_test()).toBe(true)
  })

  test("shuffled() distribution", () => {
    const N = 1e4
    const M = 10
    const TRIES = 3
    const XSQ = 123.23 // quantile of chi-square dist. k=M*M-1, p=.05
    // XXX: shouldn't k be M! ?

    random.seed(Math.random() * 0x100000000)

    const _test = () => {
      const tries = []
      for (let attempt = 0; attempt < TRIES; ++attempt) {
        const bins = new Uint32Array(M * M)
        const array_ref = []
        for (let j = 0; j < M; ++j) {
          array_ref.push(j)
        }
        for (let i = 0; i < N; ++i) {
          const array = random.shuffled(array_ref)
          for (let j = 0; j < M; ++j) {
            ++bins[j * M + array[j]]
            expect(array_ref[j]).toEqual(j)
          }
          const xsq = bins.reduce((a, v) => {
            const e = N / M
            return a + Math.pow(v - e, 2) / e
          }, 0)
          /*
           * XSQ = scipy.stats.chi2.isf(.05, 99)
           * if xsq > XSQ, the result is biased at 95% significance
           */
          if (xsq < XSQ) {
            console.log(`Expected x^2 to be < ${XSQ}, got ${xsq} on attempt #${attempt + 1}`)
            return true
          }
          tries.push(xsq)
        }
      }
      // assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": "+ tries);
      return false
    }

    expect(_test()).toBe(true)
  })

  test.skip("subset() with equal distribution", () => {
    /*
     * This doesn't specify limit, so length distribution should be even,
     * and selections should be even within each length.
     */
    const N = 1e4
    const M = 3
    const TRIES = 3
    const B0_XSQ = 5.99
    const B1_XSQ = 15.51
    const B2_XSQ = 38.89
    const LEN_XSQ = 7.81 // quantile of chi-square dist. k=[2,8,26,3], p=.05

    random.seed(Math.random() * 0x100000000)

    const _test = () => {
      let bin0_xsq, bin1_xsq, bin2_xsq, length_xsq
      for (let attempt = 0; attempt < TRIES; ++attempt) {
        const bins = [new Uint32Array(3), new Uint32Array(9), new Uint32Array(27)]
        const lengths = new Uint32Array(M + 1)
        for (let i = 0; i < N; ++i) {
          const tmp = random.subset([0, [1, 1], () => 2])
          expect(tmp.length).toBeLessThanOrEqual(M)
          ++lengths[tmp.length]
          if (tmp.length) {
            ++bins[tmp.length - 1][
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              tmp.reduce((a, v) => a * 3 + v, 0)
            ]
          }
        }
        bin0_xsq = bins[0].reduce((a, v) => {
          const e = N / (M + 1) / Math.pow(M, 1)
          return a + Math.pow(v - e, 2) / e
        }, 0)
        bin1_xsq = bins[1].reduce((a, v) => {
          const e = N / (M + 1) / Math.pow(M, 2)
          return a + Math.pow(v - e, 2) / e
        }, 0)
        bin2_xsq = bins[2].reduce((a, v) => {
          const e = N / (M + 1) / Math.pow(M, 3)
          return a + Math.pow(v - e, 2) / e
        }, 0)
        length_xsq = lengths.reduce((a, v) => {
          const e = N / (M + 1)
          return a + Math.pow(v - e, 2) / e
        }, 0)
        /*
         * XSQ = scipy.stats.chi2.isf(.05, 2)
         * if xsq > XSQ, the result is biased at 95% significance
         */
        if (bin0_xsq < B0_XSQ && bin1_xsq < B1_XSQ && bin2_xsq < B2_XSQ && length_xsq < LEN_XSQ) {
          console.log(
            `Expected lengths x^2 to be < ${LEN_XSQ} got ${length_xsq}  on attempt #${attempt + 1}`,
          )
          console.log(
            `Expected length=1 x^2 to be < ${B0_XSQ} got ${bin0_xsq} on attempt # ${attempt + 1}`,
          )
          console.log(
            `Expected length=2 x^2 to be < ${B1_XSQ} got ${bin1_xsq} on attempt #${attempt + 1}`,
          )
          console.log(
            `Expected length=3 x^2 to be < ${B2_XSQ} got ${bin2_xsq} on attempt #${attempt + 1}`,
          )
          return true
        }
      }
      console.log(`Expected lengths x^2 to be < ${LEN_XSQ} got ${length_xsq}`)
      console.log(`Expected length=1 x^2 to be < ${B0_XSQ} got ${bin0_xsq}`)
      console.log(`Expected length=2 x^2 to be < ${B1_XSQ} got ${bin1_xsq}`)
      console.log(`Expected length=3 x^2 to be < ${B2_XSQ} got ${bin2_xsq}`)
      // assert.ok(false, "Failed in " + TRIES + " attempts to get xsq low enough");
      return false
    }

    expect(_test()).toBe(true)
  })

  test.skip("subset(limit) with equal distribution", () => {
    /*
     * limit is specified, so length should always == limit, and selections should be even
     */
    const N = 1e4
    const M = 3
    const TRIES = 3
    const B0_XSQ = 5.99
    const B1_XSQ = 15.51
    const B2_XSQ = 38.89
    const B3_XSQ = 101.88 // quantile of chi-square dist. k=[2,8,26,80], p=.05

    let bin0_xsq: number
    let bin1_xsq: number
    let bin2_xsq: number
    let bin3_xsq: number

    random.seed(Math.random() * 0x100000000)

    const _test = () => {
      for (let attempt = 0; attempt < 100; ++attempt) {
        expect(random.subset([1, 2, 3], 0).length).toBe(0)
      }
      for (let attempt = 0; attempt < TRIES; ++attempt) {
        const bins = [
          new Uint32Array(3),
          new Uint32Array(9),
          new Uint32Array(27),
          new Uint32Array(81),
        ]
        for (let i = 0; i < N; ++i) {
          let tmp = random.subset([0, 1, 2], 1)
          expect(tmp.length).toBe(1)

          ++bins[0][tmp.reduce((a, v) => a * 3 + v, 0)]
          tmp = random.subset([0, 1, 2], 2)
          expect(tmp.length).toBe(2)

          ++bins[1][tmp.reduce((a, v) => a * 3 + v, 0)]
          tmp = random.subset([0, 1, 2], 3)
          expect(tmp.length).toBe(3)

          ++bins[2][tmp.reduce((a, v) => a * 3 + v, 0)]
          tmp = random.subset([0, 1, 2], 4)
          expect(tmp.length).toBe(4)

          ++bins[3][tmp.reduce((a, v) => a * 3 + v, 0)]
        }
        bin0_xsq = bins[0].reduce((a, v) => {
          const e = N / Math.pow(M, 1)
          return a + Math.pow(v - e, 2) / e
        }, 0)
        bin1_xsq = bins[1].reduce((a, v) => {
          const e = N / Math.pow(M, 2)
          return a + Math.pow(v - e, 2) / e
        }, 0)
        bin2_xsq = bins[2].reduce((a, v) => {
          const e = N / Math.pow(M, 3)
          return a + Math.pow(v - e, 2) / e
        }, 0)
        bin3_xsq = bins[3].reduce((a, v) => {
          const e = N / Math.pow(M, 4)
          return a + Math.pow(v - e, 2) / e
        }, 0)
        /*
         * XSQ = scipy.stats.chi2.isf(.05, 2)
         * if xsq > XSQ, the result is biased at 95% significance
         */
        if (bin0_xsq < B0_XSQ && bin1_xsq < B1_XSQ && bin2_xsq < B2_XSQ && bin3_xsq < B3_XSQ) {
          // assert.ok(true, "Expected length=1 x^2 to be < " + B0_XSQ + ", got " + bin0_xsq + " on attempt #" + (attempt + 1));
          // assert.ok(true, "Expected length=2 x^2 to be < " + B1_XSQ + ", got " + bin1_xsq);
          // assert.ok(true, "Expected length=3 x^2 to be < " + B2_XSQ + ", got " + bin2_xsq);
          // assert.ok(true, "Expected length=4 x^2 to be < " + B3_XSQ + ", got " + bin3_xsq);
          return true
        }
      }
      console.log(`Expected length=1 x^2 to be < ${B0_XSQ} got ${bin0_xsq}`)
      console.log(`Expected length=2 x^2 to be < ${B1_XSQ} got ${bin1_xsq}`)
      console.log(`Expected length=3 x^2 to be < ${B2_XSQ} got ${bin2_xsq}`)
      console.log(`Expected length=4 x^2 to be < ${B3_XSQ} got ${bin3_xsq}`)
      // assert.ok(false, "Failed in " + TRIES + " attempts to get xsq low enough");
      return false
    }
    expect(_test()).toBe(true)
  })

  test("pop() distribution", () => {
    const N = 1e4
    const TRIES = 3
    const XSQ = 5.99 // quantile of chi-square dist. k=2, p=.05

    random.seed(Math.random() * 0x100000000)

    const _test = () => {
      const tries = []
      for (let attempt = 0; attempt < TRIES; ++attempt) {
        const bins = new Uint32Array(3)
        const orig = [99, 100, 101]
        for (let i = 0; i < N; ++i) {
          const arr = orig.slice()
          const tmp = random.pop(arr) - 99
          expect(tmp).toBeGreaterThanOrEqual(0)
          expect(tmp).toBeLessThan(bins.length)
          expect(arr.length).toBe(2)
          expect(
            arr.reduce((a, v) => {
              return a + v
            }, tmp),
          ).toBe(201)
          ++bins[tmp]
        }
        const xsq = bins.reduce((a, v) => {
          const e = N / bins.length
          return a + Math.pow(v - e, 2) / e
        }, 0)
        /*
         * XSQ = scipy.stats.chi2.isf(.05, 2)
         * if xsq > XSQ, the result is biased at 95% significance
         */
        if (xsq < XSQ) {
          console.log(`Expected x^2 to be < ${XSQ}, got ${xsq} on attempt #${attempt + 1}`)
          return true
        }
        tries.push(xsq)
      }
      // assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": "+ tries);
      return false
    }
    expect(_test()).toBe(true)
  })

  test("ludOneTo() distribution", () => {
    const N = 1e5
    const TRIES = 3
    const XSQ = 123.22 // quantile of chi-square dist. k=99, p=.05
    const dist = new Uint32Array(100)

    random.seed(Math.random() * 0x100000000)

    /* Build the ideal distribution for comparison
     * I thought this would be the PDF of the log-normal distribution, but I couldn't get mu & sigma figured out? */
    for (let i = 0; i < 100 * dist.length; ++i) {
      dist[Math.floor(Math.exp((i / (100 * dist.length)) * Math.log(dist.length)))] +=
        N / (dist.length * 100)
    }
    expect(dist[0]).toEqual(0)

    const _test = () => {
      const tries = []
      for (let attempt = 0; attempt < TRIES; ++attempt) {
        const bins = new Uint32Array(dist.length)
        let xsq = 0
        for (let i = 0; i < N; ++i) {
          const tmp = random.ludOneTo(bins.length) >>> 0
          expect(tmp).toBeLessThan(bins.length)
          ++bins[tmp]
        }
        expect(bins[0]).toEqual(0)

        for (let i = 1; i < bins.length; ++i) {
          xsq += Math.pow(bins[i] - dist[i], 2) / dist[i]
        }
        /*
         * XSQ = scipy.stats.chi2.isf(.05, 99)
         * if xsq > XSQ, the result is biased at 95% significance
         */
        if (xsq < XSQ) {
          console.log(`Expected x^2 to be < ${XSQ}, got ${xsq} on attempt #${attempt + 1}`)
          return true
        }
        tries.push(xsq)
      }
      // assert.ok(false, "Failed in " + TRIES + " attempts to get xsq lower than " + XSQ + ": "+ tries);
      return false
    }
    expect(_test()).toBe(true)
  })
})
