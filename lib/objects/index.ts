/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { random } from '../random'
import { logger } from '../logging'

interface ContainerEntry {
  type: string;
  name: string;
}

export class objects {
  private counter: number
  private readonly container: { [id: string]: ContainerEntry[] }
  constructor () {
    this.counter = 0
    this.container = {}
  }

  add (category: string, member: string) {
    if (!member) {
      member = 'o' + this.counter
    }
    if (!this.has(category)) {
      this.container[category] = []
    }
    this.container[category].push({ type: category, name: member })
    ++this.counter
    return this.container[category].slice(-1)[0].name
  }

  get (category: string, last: boolean) {
    if (!(category in this.container)) {
      // return {type:null, name:null};
      logger.traceback()
      throw new Error(`${category} is not available.`)
    }
    if (last) {
      return this.container[category].slice(-1)[0]
    }
    return random.pick(this.container[category])
  }

  pick (category: string, last: boolean) {
    try {
      return this.get(category, last).name
    } catch (e) {
      logger.traceback()
      throw logger.JSError(`Error: pick('${category}') is undefined.`)
    }
  }

  pop (objectName: string) {
    Object.keys(this.container).forEach(category => {
      this.container[category].forEach(obj => {
        if (obj.name === objectName) {
          this.container[category].splice(this.container[category].indexOf(obj), 1)
        }
      })
    })
  }

  contains (categoryNames: string[]) {
    const categories = categoryNames.filter(name => this.has(name))
    return (categories.length === 0) ? null : categories
  }

  show (category: string) {
    return (category in this.container) ? this.container[category] : this.container
  }

  count (category: string) {
    return (category in this.container) ? this.container[category].length : 0
  }

  has (category: string) {
    if (category in this.container) {
      this.check(category)
      return this.container[category].length > 0
    }
    return false
  }

  valid () {
    const items: string[] = []
    Object.keys(this.container).forEach(category => {
      this.check(category)
    })
    Object.keys(this.container).forEach(category => {
      for (let i = 0; i < this.container[category].length; i++) {
        items.push(this.container[category][i].name)
      }
    })
    return items
  }

  check (category: string) {
    this.container[category].forEach(object => {
      try {
        const x = /* frame.contentWindow. */ eval(object.name) // eslint-disable-line no-eval
        if (x === undefined || x === null) {
          this.pop(object.name)
        }
      } catch (e) {
        this.pop(object.name)
      }
    })
  }
}
