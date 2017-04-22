/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

make.mime = {
  type: function () {
    return random.pick([
      "text/html",
      "text/plain",
      "text/css",
      "text/javascript",
      "image/jpeg",
      "image/gif",
      "image/png",
      "application/rss+xml",
      "application/vnd.mozilla.xul+xml",
      "application/xhtml+xml",
      "application/octet-stream",
      "application/x-shockwave-flash",
      "application/x-test",
      "audio/mpeg",
      "audio/ogg",
      "audio/ogg; codecs=vorbis",
      "video/ogg",
      'video/ogg; codecs="theora,vorbis"',
      "video/mp4",
      'video/mp4; codecs="avc1.42E01E,mp4a.40.2"'
    ]);
  }
};
