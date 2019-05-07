/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-disable camelcase */
/* eslint-env jest */

const Prototypes = require('../prototypes')

beforeAll(() => {
  Prototypes.enable()
})

describe('Prototypes', () => {
  describe('enable()', () => {
    test('defines all polyfills', () => {
      expect(typeof [].has).toBe('function')
      expect(typeof [].extend).toBe('function')
      expect(typeof Object.isObject).toBe('function')
      expect(typeof ''.insert).toBe('function')
    })
  })

  describe('Array.has()', () => {
    test('simple test', () => {
      const arr = [1, 2, 3, 'abc']
      expect(arr.has('abc')).toBe(true)
      expect(arr.has('xyz')).toBe(false)
    })
  })

  describe('Array.extend()', () => {
    test('simple test', () => {
      const arr1 = [1, 2, 3]
      const arr2 = ['a', 'b', 'c']
      arr1.extend(arr2)
      expect(arr1.length).toBe(6)
      expect(arr1).toEqual(expect.arrayContaining(arr2))
    })
  })

  describe('String.insert()', () => {
    test('simple test', () => {
      const str = 'foobar'
      expect(str.insert('123', 3)).toBe('foo123bar')
    })
  })

  describe('Object.isObject()', () => {
    test('simple test', () => {
      expect(Object.isObject({})).toBe(true)
      expect(Object.isObject('foobar')).toBe(false)
      expect(Object.isObject(null)).toBe(false)
      expect(Object.isObject(undefined)).toBe(false)
      expect(Object.isObject(123)).toBe(false)
      expect(Object.isObject(new Date())).toBe(false)
    })
  })
})
