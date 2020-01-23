/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-disable camelcase */
/* eslint-disable new-cap */
/* eslint-env jest */

import { tracker } from '../index'

// Initialize rng
import { random } from '../../random'
random.init()

describe('Tracker', () => {
  test('init', () => {
    expect(() => {
      const t = new tracker() /* eslint-disable-line no-unused-vars, @typescript-eslint/no-unused-vars */
    }).not.toThrow()
  })

  test('add new prefix', () => {
    const t = new tracker()
    for (let i = 0; i < 20; i++) {
      const id = t.add('foo')
      expect(id).toBe(`foo_${i}`)
    }
  })

  test('get random value', () => {
    const t = new tracker()
    for (let i = 0; i < 9; i++) {
      t.add('foo')
    }

    const id = t.get('foo')
    expect(id).toMatch(/foo_[0-9]/)
  })

  test('get uninitialized value', () => {
    const t = new tracker()
    const id = t.add('foo')
    expect(id).toBe(`foo_0`)
  })

  test('check length', () => {
    const t = new tracker()
    expect(t.length('foo')).toBe(0)

    for (let i = 0; i < 9; i++) {
      t.add('foo')
    }

    expect(t.length('foo')).toBe(9)
  })
})
