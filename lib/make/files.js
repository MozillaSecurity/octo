/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

make.files = {
  image: function () {
    return utils.common.quote(random.pick([
      'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=',
      'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
      'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=',
      'data:image/gif;base64,R0lGODlhAQABAAAAACw=',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVQYV2P4DwABAQEAWk1v8QAAAABJRU5ErkJggg==',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII='
      // Todo: load from filesystem randomly: 'media/images/*.{bmp|jpg|gif|png|webp}'
    ]))
  },
  video: function () {
    return utils.common.quote(random.pick([
      'media/video/video1.webm'
      // Todo: load from filesystem randomly: 'media/videos/*.{webm|ogv|mp4}'
    ]))
  },
  audio: function () {
    return utils.common.quote(random.pick([
      'media/audio/mono-uncompressed-8bit-8000hz.wav',
      'media/audio/mono-uncompressed-8bit-44100hz.wav',
      'media/audio/mono-uncompressed-32bit-8000hz.wav',
      'media/audio/mono-uncompressed-32bit-44100hz.wav'
      // Todo: load from filesystem randomly: 'media/videos/*.{wav|ogg|mp3}'
    ]))
  },
  webvtt: function () {
    return utils.common.quote(random.pick([
      // 'data:text/vtt,' + encodeURIComponent('WEBVTT\n\n00:00:00.000 --> 00:00:00.001\ntest');,
      'media/video/sample.vtt'
      // Todo: load from filesystem randomly: 'media/videos/*.{vtt}'
    ]))
  },
  file: function () {
    return random.pick([
      make.files.image,
      make.files.video,
      make.files.audio
    ])
  }
}
