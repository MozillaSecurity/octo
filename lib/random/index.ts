/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import MersenneTwister from "mersenne-twister"

export type PRNGSeedType = number | number[] | MersenneTwister

/** A MersenneTwister based PRNG with a number of useful utility functions. */
export class Random {
  /** Singleton instance. */
  protected static instance: Random
  /** The mersenne twister instance. */
  protected prng: MersenneTwister

  /** Reference to the MersenneTwister instance. */
  protected constructor() {
    this.prng = new MersenneTwister()
  }

  /** Return the singleton instance. */
  public static getInstance(): Random {
    if (!this.instance) {
      this.instance = new Random()
    }
    return this.instance
  }

  /** Return a random Boolean value. */
  bool(): boolean {
    return this.item([true, false])
  }

  /**
   * Returns a boolean result based on limit.
   * @param limit - Maximum value.
   */
  chance(limit: number = 2): boolean {
    return this.number(limit) === 1
  }

  /**
   * Return an item from an array of arrays where the first index in each sub-array denotes the
   * weight.
   * @param list - Array of arrays.
   * @param flat - Indicates whether we should iterate over the arrays recursively.
   */
  choose(list: any[], flat = false): any {
    const expanded: any[] = []
    list.forEach(([weight, value]) => {
      for (let w = 0; w < weight; w++) {
        expanded.push(value)
      }
    })

    if (flat) {
      return this.item(expanded)
    }

    return this.pick(expanded)
  }

  /** Returns a float in [0, 1) (uniform distribution). */
  float(): number {
    return this.prng.random_long()
  }

  /**
   * Return a random hex string.
   * @param len - Length of string to generate.
   */
  hex(len: number): string {
    const val = this.number(Math.pow(2, len * 4)).toString(16)
    return "0".repeat(len - val.length) + val
  }

  /**
   * Returns a random index from a list.
   * @param list - List to choose from.
   */
  item<T>(list: T[]): T {
    if (!list.length) {
      throw new Error("Cannot return random item from an empty list!")
    }
    return list[this.number(list.length)]
  }

  /**
   * Returns a random key of a provided object.
   * @param obj - Source object.
   */
  key(obj: Record<string, any>): string {
    const keys = Object.keys(obj)
    if (!keys.length) {
      throw new Error("Cannot return a random key from an empty object!")
    }

    return this.item(Object.keys(obj))
  }

  /**
   * Returns a float in [1, limit). The logarithm has uniform distribution.
   * @param limit - Maximum value.
   */
  ludOneTo(limit: number): number {
    return Math.exp(this.float() * Math.log(limit))
  }

  /**
   * Returns an integer in [0, limit) (uniform distribution).
   * @param limit - Maximum number.
   * @param factor - Number of iterations to perform (reduces max).
   */
  number(limit = 0xffffffff, factor = 1): number {
    const x = (0x100000000 / limit) >>> 0
    const y = (x * limit) >>> 0
    let r
    do {
      r = this.prng.random_int()
    } while (y && r >= y) // eslint-disable-line no-unmodified-loop-condition

    if (--factor) {
      const v = (r / x) >>> 0
      return this.number(v, factor)
    }

    return (r / x) >>> 0
  }

  /**
   * Recursively iterate over array until non-array item identified. If item is a function, evaluate
   * it with no args.
   * @param obj - Source object.
   */
  pick(obj: any): any {
    if (typeof obj === "function") {
      return obj()
    } else if (Array.isArray(obj)) {
      return this.pick(this.item(obj))
    }

    return obj
  }

  /**
   * Removes and returns a random item from an array.
   * @param arr - Source array to pop from.
   */
  pop<T>(arr: T[]): T {
    const i = this.number(arr.length)
    const obj = arr[i]
    arr.splice(i, 1)

    return obj
  }

  /**
   * Returns an integer in [start, limit) (uniform distribution).
   * @param start - Minimum value.
   * @param limit - Maximum value.
   * @param factor - Reduce possibility of maximum by factor.
   */
  range(start: number, limit: number, factor = 1): number {
    return this.number(limit - start + 1, factor) + start
  }

  /**
   * Seed the PRNG.
   * @param seed - The seed to use.
   */
  seed(seed: PRNGSeedType): void {
    if (typeof seed === "number" || Array.isArray(seed)) {
      this.prng = new MersenneTwister(seed)
    } else {
      this.prng = seed
    }
  }

  /**
   * Return a shuffled array.
   * @param arr - Array to shuffle.
   */
  shuffle(arr: any[]): void {
    for (let i = 0; i < arr.length; i++) {
      const p = this.number(i + 1)
      const t = arr[i]
      arr[i] = arr[p]
      arr[p] = t
    }
  }

  /**
   * Return a shuffled copy of an array.
   * @param arr - Source Array to shuffle.
   */
  shuffled<T>(arr: T[]): T[] {
    const newArray = arr.slice()
    this.shuffle(newArray)
    return newArray
  }

  /**
   * Return a subset of the supplied array.
   * @param list - List to be parsed.
   * @param limit - Number of elements to be returned.
   */
  subset<T>(list: T[], limit?: number): T[] {
    const start = Math.min(1, list.length)
    limit =
      typeof limit !== "number" ? this.range(start, list.length) : Math.min(limit, list.length)

    const temp = list.slice()
    const result: T[] = []
    for (let i = 0; i < limit; i++) {
      result.push(this.pop(temp))
    }

    return result
  }

  /**
   * Returns either the supplied object or an empty string.
   * @param obj - The object to consider.
   */
  use(obj: any): typeof obj | string {
    return this.bool() ? obj : ""
  }

  /**
   * Return a flattened list of weighted values.
   * @param list - List of weighted values.
   */
  weighted(list: { w: number; v: any }[]): any[] {
    const expanded: any[] = []
    list.forEach((item) => {
      for (let i = 0; i < item.w; i++) {
        expanded.push(item.v)
      }
    })

    return expanded
  }
}

export const random = Random.getInstance()
