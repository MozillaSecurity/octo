/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

make.network = {
  sdp: function () {
    // session description protocol template
    return [
      "v=0",
      "o=Mozilla-SIPUA 23597 0 IN IP4 0.0.0.0",
      "s=SIP Call",
      "t=0 0",
      "a=ice-ufrag:f5fda439",
      "a=ice-pwd:d0df8e2904bdbd29587966e797655970",
      "a=fingerprint:sha-256 DF:69:78:20:8D:2E:08:CE:49:82:A3:11:79:1D:BF:B5:49:49:2D:32:82:2F:0D:88:84:A7:C6:63:23:63:A9:0F",
      "m=audio 52757 RTP/SAVPF 109 0 8 101",
      "c=IN IP4 192.168.129.33",
      "a=rtpmap:109 opus/48000/2",
      "a=ptime:20",
      "a=rtpmap:0 PCMU/8000",
      "a=rtpmap:8 PCMA/8000",
      "a=rtpmap:101 telephone-event/8000",
      "a=fmtp:101 0-15",
      "a=sendrecv",
      "a=candidate:0 1 UDP 2113601791 192.168.129.33 52757 typ host",
      "a=candidate:0 2 UDP 2113601790 192.168.129.33 59738 typ host",
      "m=video 63901 RTP/SAVPF 120",
      "c=IN IP4 192.168.129.33",
      "a=rtpmap:120 VP8/90000",
      "a=sendrecv",
      "a=candidate:0 1 UDP 2113601791 192.168.129.33 63901 typ host",
      "a=candidate:0 2 UDP 2113601790 192.168.129.33 54165 typ host",
      "m=application 65080 SCTP/DTLS 5000",
      "c=IN IP4 192.168.129.33",
      "a=fmtp:5000 protocol=webrtc-datachannel;streams=16",
      "a=sendrecv",
      "a=candidate:0 1 UDP 2113601791 192.168.129.33 65080 typ host",
      "a=candidate:0 2 UDP 2113601790 192.168.129.33 62658 typ host",
    ].join("\n");
  },
  PeerConnectionProtocols: function () {
    return ["turn", "turns", "stun", "stuns"];
  },
  randomIPv4: function () {
    return random.pick([random.number(255), make.numbers.any]) + "." +
      random.pick([random.number(255), make.numbers.any]) + "." +
      random.pick([random.number(255), make.numbers.any]) + "." +
      random.pick([random.number(255), make.numbers.any]);
  },
  randomIPv6: function () {
    return "[" + make.strings.stringFromBlocks([":", function () {
        return make.strings.digitsHex(random.range(1, 4));
      }]) + "]";
  },
  goodHostnames: function () {
    return [
      "0.0.0.0",
      "127.0.0.1:8080",
    ];
  },
  badHostnames: function () {
    return [
      "google.org:8080",
      "::1",
      "[::192.9.5.5]:42",
      "2001:db8:85a3::8a2e:370:3478",
      "2001:db8:85a3:0:0:8a2e:370:3478",
      "::ffff:192.0.2.1",
      "0000:0000:0000:0000:0000:0000:0000:0001",
      "::192.0.2.128",
      "::ffff:192.0.2.128",
      "2001:db8::1:2",
      "2001:db8::1:1:1:1:1"
    ];
  },
  randomBitmask: function (list) {
    if (list.length <= 1) {
      return list.join("");
    }
    let max = random.range(2, list.length);
    let mask = random.pick(list);
    for (let i = 1; i < max; i++) {
      mask += "|" + random.pick(list);
    }
    return mask;
  },
};
