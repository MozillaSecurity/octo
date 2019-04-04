/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-disable camelcase */
/* eslint-env jest */

const Tracker = require('../index')

// Initialize rng
const random = require('../../random')
random.init()

describe('Tracker', () => {
  test('init', () => {
    expect(() => {
      const tracker = new Tracker() /* eslint-disable-line no-unused-vars */
    }).not.toThrow()
  })

  test('add new prefix', () => {
    const tracker = new Tracker()
    for (let i = 0; i < 20; i++) {
      const id = tracker.add('foo')
      expect(id).toBe(`foo_${i}`)
    }
  })

  test('get random value', () => {
    const tracker = new Tracker()
    for (let i = 0; i < 9; i++) {
      tracker.add('foo')
    }

    const id = tracker.get('foo')
    expect(id).toMatch(/foo_[0-9]/)
  })

  test('get uninitialized value', () => {
    const tracker = new Tracker()
    const id = tracker.add('foo')
    expect(id).toBe(`foo_0`)
  })
})
