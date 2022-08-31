/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { random } from "../random"

/** Class for generating various alignment values. */
export class alignment {
  /** Generate a random horizontal alignment value. */
  static horizontal(): string {
    return random.item(["left", "right", "justify", "center"])
  }

  /** Generate a random vertical alignment value. */
  static vertical(): string {
    return random.item(["top", "bottom", "middle", "baseline"])
  }

  /** Generate a random horizontal or vertical alignment value. */
  static any(): string {
    return random.pick([this.horizontal, this.vertical])
  }
}
