/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-env jest */

import { calc, datatypes } from '../datatypes'
import { random } from '../../../random'

beforeAll(() => {
  random.init()
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('ranged datatypes', () => {
  const keys = [
    'angle',
    'dimension',
    'frequency',
    'integer',
    'length',
    'number',
    'percentage',
    'resolution',
    'time'
  ] as const
  describe.each(keys)('%s', (name) => {
    test('using predefined ranges', () => {
      const min = 1
      const max = 100
      const value = datatypes[name]({ min, max })
      const match = value.match('^\\d+')
      expect(match).not.toBe(null)
      if (match !== null) {
        const num = parseInt(match[0])
        expect(num).toBeGreaterThanOrEqual(min)
        expect(num).toBeLessThanOrEqual(max)
      }
    })

    test('using calc values', () => {
      jest.spyOn(random, 'chance').mockReturnValueOnce(true)
      const value = datatypes[name]()
      expect(value).toMatch(/calc\(.*?\)/)
    })
  })
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
