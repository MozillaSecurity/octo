/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { make } from "../make"
import { random } from "../random"

/** Class for generating random URI values. */
export class uri {
  /** Generate a random URI that is known to cause issues. */
  static problematic(): string {
    return random.item([
      "aim:yaz", // Often triggers an 'external protocol request' dialog
      "foop:yaz", // Often triggers an unknown protocol
      "about:memory", // Content is not allowed to link or load
      "ws://localhost/", // WebSocket protocol
    ])
  }

  /** Generate a random URI that should be valid in all environments. */
  static standard(): string {
    return random.item([
      "about:blank",
      "about:srcdoc",
      "about:mozilla",
      "about:rights",
      "data:text/html,",
      "data:image/png,",
      "data:",
      "javascript:5555",
      `javascript:"QQQQ${String.fromCharCode(0)}UUUU"`,
      "http://a.invalid/",
      "http://localhost:6/",
      "https://localhost:6/",
      "ftp://localhost:6/",
      "http://localhost:25/",
      "http://username:password@localhost",
      "http://:password@localhost",
    ])
  }

  /** Generate a random namespaceURI. */
  static namespace(): string {
    return random.item([
      "http://www.w3.org/1999/xhtml",
      "http://www.w3.org/2000/svg",
      "http://www.w3.org/1998/Math/MathML",
    ])
  }

  /** Generate a random URI. */
  static any(): string {
    if (random.chance(20)) {
      return uri.problematic()
    } else {
      if (random.chance(4)) {
        // Return a standard URI
        return uri.standard()
      }

      // Base URL requires a minimum of protocol and hostname
      let url = `${make.network.protocol()}://${make.network.hostname()}$`
      const extensions = [make.network.path, make.network.hash, make.network.search]

      for (let i = 0; i < random.number(extensions.length); i++) {
        url += extensions[i]()
      }

      return url
    }
  }
}
