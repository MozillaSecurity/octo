/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-env jest */

import { calc, datatypes, expandRange } from '../datatypes'
import { random } from '../../../random'

beforeAll(() => {
  random.init()
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('calc()', () => {
  test('multiplication', () => {
    const mockGenerator = jest.fn(() => '')
    jest.spyOn(random, 'item').mockReturnValueOnce('*')
    jest.spyOn(random, 'shuffled').mockReturnValueOnce(['1px', '1'])
    const value = calc(mockGenerator)
    expect(value).toEqual('calc(1px * 1)')
  })

  test('division', () => {
    const mockGenerator = jest.fn(() => '1px')
    jest.spyOn(random, 'item').mockReturnValueOnce('/')
    jest.spyOn(datatypes, 'number').mockReturnValueOnce('1')
    const value = calc(mockGenerator)
    expect(value).toEqual('calc(1px / 1)')
  })

  test.each([
    ['addition', '+'],
    ['subtraction', '-']
  ])('%s', (type, op) => {
    const mockGenerator = jest.fn(() => '1')
    jest.spyOn(random, 'item').mockReturnValueOnce(op)
    jest.spyOn(datatypes, 'number').mockReturnValue('1')
    const value = calc(mockGenerator)
    expect(value).toEqual(`calc(1 ${op} 1)`)
  })
})

describe('expandRange()', () => {
  test.each([
    ['infinity', [null, null], [-2147483648, 0x7fffffff]],
    ['positive-infinity', [0, null], [0, 0xffffffff]],
    ['negative-infinity', [null, 0], [-2147483648, 0]],
    ['clamped', [0, 1], [0, 1]]
  ])('%s', (_, opts, expected) => {
    const value = expandRange(opts[0], opts[1])
    expect(value).toEqual(expected)
  })
})

describe('ranged datatypes', () => {
  describe.each([
    'angle',
    'dimension',
    'frequency',
    'integer',
    'length',
    'number',
    'percentage',
    'resolution',
    'time'
  ] as const)('%s', (name) => {
    test.each([
      ['positive', 0, null],
      ['negative', null, 0]
    ])('ranges (%s)', (type, min, max) => {
      const raw = datatypes[name]({
        min,
        max
      })
      const value = parseInt(raw)
      if (type === 'positive') {
        expect(value).toBeGreaterThanOrEqual(0)
      } else {
        expect(value).toBeLessThanOrEqual(0)
      }
    })

    test('using calc values', () => {
      jest.spyOn(random, 'chance').mockReturnValueOnce(true)
      const value = datatypes[name]()
      expect(value).toMatch(/calc\(.*?\)/)
    })
  })
})
