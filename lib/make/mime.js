/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const random = require('../random')

class mime {
  static any () {
    return random.pick([
      mime.standard,
      mime.xml,
      mime.image,
      mime.media,
      mime.form
    ])
  }

  static standard () {
    return random.pick([
      'text/html',
      'text/html; charset=utf-8',
      'text/plain',
      'text/css',
      'text/javascript',
      'foo/bar',
      'application/octet-stream',
      'application/x-shockwave-flash',
      'application/x-test'
    ])
  }

  static xml () {
    return random.pick([
      'application/xml',
      'text/xml',
      'application/xhtml+xml',
      'image/svg+xml',
      'application/vnd.mozilla.xul+xml',
      'application/rss+xml',
      'application/rdf+xml',
      'application/xslt+xml'
    ])
  }

  static image () {
    return random.pick([
      'image/jpeg',
      'image/gif',
      'image/png',
      'image/mng',
      'image/*'
    ])
  }

  static media () {
    return random.pick([
      'audio/mpeg',
      'audio/ogg',
      'audio/ogg; codecs=vorbis',
      'video/ogg',
      'video/ogg; codecs="theora, vorbis"',
      'video/mp4',
      'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
    ])
  }

  static form () {
    return random.pick([
      'application/x-www-form-urlencoded',
      'multipart/form-data',
      'text/plain'
    ])
  }
}

module.exports = mime
