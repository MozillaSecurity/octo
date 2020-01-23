/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-env jest */
import MersenneTwister from 'mersenne-twister'

describe('MersenneTwister', () => {
  test('uniform distribution', () => {
    const N = Math.pow(2, 18)
    const TRIES = 10
    const XSQ = 293.25 // quantile of chi-square dist. k=255, p=.05

    const mt = new MersenneTwister()
    mt.init_seed(Math.random() * 0x100000000)

    const _test = () => {
      const tries = []
      for (let attempt = 0; attempt < TRIES; ++attempt) {
        const data = new Uint32Array(N)
        let sh
        for (let i = 0; i < data.length; ++i) {
          data[i] = mt.random_int()
        }
        for (sh = 0; sh <= 24; ++sh) {
          const bins = new Uint32Array(256)
          for (const b of data) {
            ++bins[(b >>> sh) & 0xff]
          }
          const xsq = bins.reduce((a, v) => {
            const e = N / bins.length
            return a + Math.pow(v - e, 2) / e
          }, 0)
          /*
          * XSQ = scipy.stats.chi2.isf(.05, 255)
          * if xsq > XSQ, the result is biased at 95% significance
          */
          if (xsq < XSQ) {
            console.log(`Expected x^2 to be < ${XSQ}, got ${xsq} on attempt #${attempt + 1}`)
            return true
          }
          tries.push(xsq)
        }
        if (sh === 25) {
          return
        }
      }
      return false
    }

    expect(_test()).toBe(true)
  })

  test('float distribution', () => {
    const N = Math.pow(2, 18)
    const TRIES = 3
    const XSQ = 564.7 // quantile of chi-square dist. k=511, p=.05

    const mt = new MersenneTwister()
    mt.init_seed(Math.random() * 0x100000000)

    const _test = () => {
      const tries = []
      for (let attempt = 0; attempt < TRIES; ++attempt) {
        const bins = new Uint32Array(512)
        for (let i = 0; i < N; ++i) {
          const tmp = (mt.random_long() * bins.length) >>> 0
          if (tmp >= bins.length) {
            throw new Error('random.float() >= 1.0')
          }
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
})
