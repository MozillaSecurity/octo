/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-env jest */

import { datatypes } from '../datatypes'
import { random } from '../../../random'

beforeAll(() => {
  random.init()
})

describe('ranged datatypes', () => {
  const tests = [
    'angle',
    'dimension',
    'frequency',
    'integer',
    'length',
    'number',
    'percentage',
    'resolution',
    'time'
  ]

  test.each(tests)('datatypes.%s(min, max)', (name) => {
    const min = 1
    const max = 100
    // @ts-ignore
    const value = datatypes[name](min, max)
    const match = value.match('^\\d+')
    expect(match).not.toBe(null)
    if (match !== null) {
      const num = parseInt(match[0])
      expect(num).toBeGreaterThanOrEqual(min)
      expect(num).toBeLessThanOrEqual(max)
    }
  })
})
