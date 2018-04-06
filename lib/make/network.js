/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const make = require('../make')
const random = require('../random')
const utils = require('../utils')

class network extends make {
  static sdp () {
    // session description protocol template
    return [
      'v=0',
      'o=Mozilla-SIPUA 23597 0 IN IP4 0.0.0.0',
      's=SIP Call',
      't=0 0',
      'a=ice-ufrag:f5fda439',
      'a=ice-pwd:d0df8e2904bdbd29587966e797655970',
      'a=fingerprint:sha-256 DF:69:78:20:8D:2E:08:CE:49:82:A3:11:79:1D:BF:B5:49:49:2D:32:82:2F:0D:88:84:A7:C6:63:23:63:A9:0F',
      'm=audio 52757 RTP/SAVPF 109 0 8 101',
      'c=IN IP4 192.168.129.33',
      'a=rtpmap:109 opus/48000/2',
      'a=ptime:20',
      'a=rtpmap:0 PCMU/8000',
      'a=rtpmap:8 PCMA/8000',
      'a=rtpmap:101 telephone-event/8000',
      'a=fmtp:101 0-15',
      'a=sendrecv',
      'a=candidate:0 1 UDP 2113601791 192.168.129.33 52757 typ host',
      'a=candidate:0 2 UDP 2113601790 192.168.129.33 59738 typ host',
      'm=video 63901 RTP/SAVPF 120',
      'c=IN IP4 192.168.129.33',
      'a=rtpmap:120 VP8/90000',
      'a=sendrecv',
      'a=candidate:0 1 UDP 2113601791 192.168.129.33 63901 typ host',
      'a=candidate:0 2 UDP 2113601790 192.168.129.33 54165 typ host',
      'm=application 65080 SCTP/DTLS 5000',
      'c=IN IP4 192.168.129.33',
      'a=fmtp:5000 protocol=webrtc-datachannel;streams=16',
      'a=sendrecv',
      'a=candidate:0 1 UDP 2113601791 192.168.129.33 65080 typ host',
      'a=candidate:0 2 UDP 2113601790 192.168.129.33 62658 typ host'
    ].join('\n')
  }

  static IceCandidate () {
    // https://tools.ietf.org/html/rfc5245#section-15
    // candidate=
    return utils.block.block([
      random.pick([0, 1, make.number.any]),
      ' ',
      random.pick([0, 1, make.number.any]),
      ' ',
      random.pick(['UDP', 'TCP', 'SCTP']),
      random.pick(['', '/' + random.pick(['DTLS', 'DTLS-SRTP'])]),
      ' ',
      random.pick([make.number.any]),
      ' ',
      random.pick([network.goodHostnames]),
      ' ',
      random.pick([56187, make.number.any]),
      ' ',
      'type',
      ' ',
      random.pick([
        'host',
        utils.block.block([
          random.pick(['srflx', 'prflx', 'relay']),
          ' ',
          random.pick(['raddr']),
          ' ',
          random.pick([network.goodHostnames]),
          ' ',
          random.pick(['rport']),
          random.use([utils.block.block([' ', make.number.any])])
        ])
      ])
    ])
  }

  static SdpMid () {
    // m=
    return utils.block.block([
      random.pick(['application', 'video', 'audio']),
      ' ',
      make.number.any,
      ' ',
      random.pick(['RTP/AVP', 'RTP/SAVPF', 'RTP/SAVP', 'SCTP/DTLS']),
      ' ',
      make.number.any
    ])
  }

  static Turn () {
    // https://tools.ietf.org/html/rfc7065#section-3.1
    return utils.block.block([
      // scheme
      random.pick(network.PeerConnectionProtocols),
      ':',
      // turn-host
      random.pick([
        network.any,
        network.hostname
      ]),
      // turn-port
      random.use([utils.block.block([':', make.number.any])]),
      random.use([utils.block.block(['/', make.text.any])]),
      '?',
      random.pick(['transport']),
      '=',
      random.pick(['udp', 'tcp', make.text.any])
    ])
  }

  static PeerConnectionProtocols () {
    return ['turn', 'turns', 'stun', 'stuns']
  }

  static randomIPv4 () {
    return random.pick([random.number(255), make.number.any]) + '.' +
      random.pick([random.number(255), make.number.any]) + '.' +
      random.pick([random.number(255), make.number.any]) + '.' +
      random.pick([random.number(255), make.number.any])
  }

  static randomIPv6 () {
    let parts = []

    for (let i = 0; i < 8; i++) {
      parts.push(random.hex(4))
    }

    return parts.join(':')
  }

  static iceServer () {
    return random.pick([
      'stun:23.21.150.121'
    ])
  }

  static dtmf () {
    return random.subset([
      '*', '#',
      'A', 'B', 'C', 'D',
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
    ], make.number.range()).join('')
  }

  static goodHostnames () {
    return [
      '0.0.0.0',
      '127.0.0.1:8080'
    ]
  }

  static badHostnames () {
    return [
      'google.org:8080',
      '::1',
      '[::192.9.5.5]:42',
      '2001:db8:85a3::8a2e:370:3478',
      '2001:db8:85a3:0:0:8a2e:370:3478',
      '::ffff:192.0.2.1',
      '0000:0000:0000:0000:0000:0000:0000:0001',
      '::192.0.2.128',
      '::ffff:192.0.2.128',
      '2001:db8::1:2',
      '2001:db8::1:1:1:1:1'
    ]
  }

  static hostname () {
    return random.pick([
      network.randomIPv4,
      network.randomIPv6,
      network.goodHostnames,
      network.badHostnames
    ])
  }

  static port () {
    return random.pick([80, 443, 21, 23, 9310])
  }

  static hash () {
    return random.pick([
      '',
      '#',
      '#main-content',
      () => '#' + make.text.any()
    ])
  }

  static path () {
    return random.pick([
      '',
      '/',
      '/index.html',
      () => '/' + make.text.any()
    ])
  }

  static protocol () {
    return random.pick([
      'http',
      'https',
      'ftp',
      'telnet',
      'chrome',
      'resource'
    ]) + ':'
  }

  static search () {
    return random.pick([
      '',
      '?',
      '?foo=bar',
      () => '?' + make.text.any()
    ])
  }

  static randomBitmask (list) {
    if (list.length <= 1) {
      return list.join('')
    }
    let max = random.range(2, list.length)
    let mask = random.pick(list)
    for (let i = 1; i < max; i++) {
      mask += '|' + random.pick(list)
    }
    return mask
  }
}

module.exports = network
