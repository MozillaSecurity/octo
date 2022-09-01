/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { logger } from "../logging"
import { random } from "../random"

interface ContainerEntry {
  type: string
  name: string
}

/** Class for tracking objects. */
export class objects {
  /** Counter used for tracking number of created objects. */
  private counter: number
  /** Container for storing created objects. */
  private readonly container: { [id: string]: ContainerEntry[] }
  /** Create a new instance. */
  constructor() {
    this.counter = 0
    this.container = {}
  }

  /**
   * Add a new object.
   *
   * @param category - Type of object to be added.
   * @param member - Object instance to be added.
   */
  add(category: string, member: string): string {
    if (!member) {
      member = "o" + this.counter
    }
    if (!this.has(category)) {
      this.container[category] = []
    }
    this.container[category].push({ type: category, name: member })
    ++this.counter
    return this.container[category].slice(-1)[0].name
  }

  /**
   * Retrieve an object.
   *
   * @param category - Type of object to be retrieved.
   * @param last - Retrieve the most recently added object instance.
   */
  get(category: string, last: boolean): ContainerEntry {
    if (!(category in this.container)) {
      // return {type:null, name:null};
      logger.traceback()
      throw new Error(`${category} is not available.`)
    }
    if (last) {
      return this.container[category].slice(-1)[0]
    }
    return random.item(this.container[category])
  }

  /**
   * Retrieve a object name.
   *
   * @param category - Type of object to be retrieved.
   * @param last - Retrieve the most recently added object instance.
   */
  pick(category: string, last: boolean): string {
    try {
      return this.get(category, last).name
    } catch (e) {
      logger.traceback()
      throw logger.JSError(`Error: pick('${category}') is undefined.`)
    }
  }

  /**
   * Remove objects matching the supplied name.
   *
   * @param objectName - The name of the objects to remove.
   */
  pop(objectName: string): void {
    Object.keys(this.container).forEach((category) => {
      this.container[category].forEach((obj) => {
        if (obj.name === objectName) {
          this.container[category].splice(this.container[category].indexOf(obj), 1)
        }
      })
    })
  }

  /**
   * Enumerate list of categories currently being tracked.
   *
   * @param categoryNames - List of category names to filter on.
   */
  contains(categoryNames: string[]): null | string[] {
    const categories = categoryNames.filter((name) => this.has(name))
    return categories.length === 0 ? null : categories
  }

  /**
   * Return a list of objects matching the supplied category.
   *
   * @param category - Type of object to filter on.
   */
  show(category: string): ContainerEntry[] | { [p: string]: ContainerEntry[] } {
    return category in this.container ? this.container[category] : this.container
  }

  /**
   * Return the number of objects matching the supplied category.
   *
   * @param category - Type of object to count.
   */
  count(category: string): number {
    return category in this.container ? this.container[category].length : 0
  }

  /**
   * Indicates if the instance contains the supplied category.
   *
   * @param category - Type of object.
   */
  has(category: string): boolean {
    if (category in this.container) {
      this.check(category)
      return this.container[category].length > 0
    }
    return false
  }

  /** Returns an array of all objects that are not null or undefined. */
  valid(): string[] {
    const items: string[] = []
    Object.keys(this.container).forEach((category) => {
      this.check(category)
    })
    Object.keys(this.container).forEach((category) => {
      for (let i = 0; i < this.container[category].length; i++) {
        items.push(this.container[category][i].name)
      }
    })
    return items
  }

  /**
   * Remove objects matching category that are undefined or null.
   *
   * @param category - The category to check.
   */
  check(category: string): void {
    this.container[category].forEach((object) => {
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
