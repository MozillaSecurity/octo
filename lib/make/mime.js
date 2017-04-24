/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

make.mime = {
  types: function () {
    return random.pick([
      make.mime.standard,
      make.mime.xml,
      make.mime.image,
      make.mime.media,
      make.mime.form
    ]);
  },
  
  standard: function () {
    return random.pick([
      "text/html",
      "text/html; charset=utf-8",
      "text/plain",
      "text/css",
      "text/javascript",
      "foo/bar",
      "application/octet-stream",
      "application/x-shockwave-flash",
      "application/x-test",
    ]);
  },

  xml: function () {
    return random.pick([
      "application/xml",
      "text/xml",
      "application/xhtml+xml",
      "image/svg+xml",
      "application/vnd.mozilla.xul+xml",
      "application/rss+xml",
      "application/rdf+xml",
      "application/xslt+xml",
    ]);
  },

  image: function () {
    return random.pick([
      "image/jpeg",
      "image/gif",
      "image/png",
      "image/mng",
      "image/*",
    ]);
  },

  media: function () {
    return random.pick([
      "audio/mpeg",
      "audio/ogg",
      "audio/ogg; codecs=vorbis",
      "video/ogg",
      "video/ogg; codecs=\"theora, vorbis\"",
      "video/mp4",
      "video/mp4; codecs=\"avc1.42E01E, mp4a.40.2\"",
    ]);
  },

  form: function () {
    return random.pick([
      "application/x-www-form-urlencoded",
      "multipart/form-data",
      "text/plain"
    ]);
  },
};
