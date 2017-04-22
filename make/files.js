make.files = {
  image: function () {
    return utils.quote(random.pick([
      "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=",
      "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
      "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=",
      "data:image/gif;base64,R0lGODlhAQABAAAAACw=",
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVQYV2P4DwABAQEAWk1v8QAAAABJRU5ErkJggg==",
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=",
      "media/images/image1.jpg",
      "media/images/image3.jpg"
    ]));
  },
  video: function () {
    return utils.quote(random.pick([
      "media/video/video1.webm",
      "media/video/video2.webm"
    ]));
  },
  audio: function () {
    return utils.quote(random.pick([
      "media/audio/mono-uncompressed-8bit-8000hz.wav",
      "media/audio/mono-uncompressed-8bit-44100hz.wav",
      "media/audio/mono-uncompressed-32bit-8000hz.wav",
      "media/audio/mono-uncompressed-32bit-44100hz.wav"
    ]));
  },
  webvtt: function () {
    return utils.quote(random.pick([
      //'data:text/vtt,' + encodeURIComponent('WEBVTT\n\n00:00:00.000 --> 00:00:00.001\ntest');,
      "media/video/sample.vtt"
    ]));
  },
  file: function () {
    return random.pick([
      make.files.image,
      make.files.video,
      make.files.audio
    ]);
  },
};
