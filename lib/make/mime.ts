/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { random } from "../random"

export class mime {
  static any(): string {
    return random.pick([mime.standard, mime.xml, mime.image, mime.media, mime.form])
  }

  static standard(): string {
    return random.item([
      "text/html",
      "text/html; charset=utf-8",
      "text/plain",
      "text/css",
      "text/javascript",
      "foo/bar",
      "application/octet-stream",
      "application/x-shockwave-flash",
      "application/x-test",
    ])
  }

  static xml(): string {
    return random.item([
      "application/xml",
      "text/xml",
      "application/xhtml+xml",
      "image/svg+xml",
      "application/vnd.mozilla.xul+xml",
      "application/rss+xml",
      "application/rdf+xml",
      "application/xslt+xml",
    ])
  }

  static image(): string {
    return random.item(["image/jpeg", "image/gif", "image/png", "image/mng", "image/*"])
  }

  static media(): string {
    return random.item([
      "audio/ogg",
      "audio/webm",
      "video/webm",
      "video/webm; codecs=vp8",
      "video/webm; codecs=vp8.0",
    ])
  }

  static form(): string {
    return random.item(["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"])
  }
}
