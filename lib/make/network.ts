/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { make } from "../make"
import { random } from "../random"

/** Class for generating networking related values. */
export class network {
  /** Generate a ufrag value. */
  static ufrag(): string {
    return "f5fda439"
  }

  /** Generate a random session description protocol. */
  static sdp(): string {
    return [
      "v=0",
      "o=Mozilla-SIPUA 23597 0 IN IP4 0.0.0.0",
      "s=SIP Call",
      "t=0 0",
      `a=ice-ufrag:${this.ufrag()}`,
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
    ].join("\n")
  }

  /** Generate a random ICE candidate. */
  static IceCandidate(): string {
    // https://tools.ietf.org/html/rfc5245#section-15
    // candidate=
    const foundation = random.pick([0, 1, make.numbers.any])
    const compId = random.pick([0, 1, make.numbers.any])
    const transport = random.item(["UDP", "TCP", "SCTP"])
    const ext = random.chance() ? `/${random.item(["DTLS", "DTLS-SRTP"])}` : ""
    const priority = make.numbers.any()
    const host = network.goodHostnames()
    const port = random.pick([56187, make.numbers.any])

    // Candidate types
    const canType = `typ ${random.item(["host", "srflx", "prflx", "relay"])}`
    const relAddr = random.chance()
      ? `raddr ${network.goodHostnames()} rport ${random.pick([56187, make.numbers.any])}`
      : ""

    return [foundation, compId, transport, ext, priority, host, port, canType, relAddr].join(" ")
  }

  /**
   * Generate a random media stream identification tag.
   *
   * {@link https://datatracker.ietf.org/doc/html/rfc3264}.
   */
  static SdpMid(): string {
    // m=
    const type = random.item(["application", "video", "audio"])
    const port = make.numbers.any()
    const proto = random.item(["RTP/AVP", "RTP/SAVPF", "RTP/SAVP", "SCTP/DTLS"])
    const unknown = make.numbers.any()
    return `${type} ${port} ${proto} ${unknown}`
  }

  /**
   * Generate a random TURN URL.
   *
   * {@link https://tools.ietf.org/html/rfc7065#section-3.1}.
   */
  static Turn(): string {
    const scheme = network.PeerConnectionProtocols()
    const host = network.hostname()
    const port = random.chance() ? `:${make.numbers.any()}` : ""
    const path = random.chance() ? `/${make.text.any()}` : ""
    const proto = random.pick(["udp", "tcp", make.text.any])
    return `${scheme}:${host}${port}${path}${proto}`
  }

  /** Return a list of peer connection protocols. */
  static PeerConnectionProtocols(): string[] {
    return ["turn", "turns", "stun", "stuns"]
  }

  /** Generate a random IPv4 Address. */
  static randomIPv4(): string {
    const octets = []
    for (let i = 0; i < 4; i++) {
      octets.push(random.number(255))
    }

    return octets.join(".")
  }

  /** Generate a random IPv6 Address. */
  static randomIPv6(): string {
    const parts: string[] = []

    for (let i = 0; i < 8; i++) {
      parts.push(random.hex(4))
    }

    return parts.join(":")
  }

  /** Generate a random ICE address. */
  static iceServer(): string {
    return random.item(["stun:23.21.150.121"])
  }

  /** Generate a random DTMF value. */
  static dtmf(): string {
    let count = make.numbers.tiny()
    const values: string[] = []
    while (count--) {
      values.push(
        random.item([
          "*",
          "#",
          "A",
          "B",
          "C",
          "D",
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
        ]),
      )
    }

    return values.join("")
  }

  /** Generate a random hostname that should be valid in all environments. */
  static goodHostnames(): string {
    const hostnames = ["localhost", "0.0.0.0", "127.0.0.1", "[::1]"]

    switch (random.number(10)) {
      case 0: {
        const username = random.chance(10) ? make.text.any() : "admin"
        return `${username}@${random.item(hostnames)}`
      }
      case 1: {
        const password = random.chance(10) ? make.text.any() : "pass"
        return `:${password}@${random.item(hostnames)}`
      }
      case 2: {
        const username = random.chance(10) ? make.text.any() : "admin"
        const password = random.chance(10) ? make.text.any() : "pass"
        return `${username}:${password}@${random.item(hostnames)}`
      }
      default: {
        return random.item(hostnames)
      }
    }
  }

  /** Generate malformed hostnames. */
  static badHostnames(): string {
    return random.item([
      "google.org",
      "[::192.9.5.5]:42",
      "2001:db8:85a3::8a2e:370",
      "2001:db8:85a3:0:0:8a2e:370",
      "::ffff:192.0.2.1",
      "0000:0000:0000:0000:0000:0000:0000:0001",
      "::192.0.2.128",
      "::ffff:192.0.2.128",
      "2001:db8::1:2",
      "2001:db8::1:1:1:1:1",
    ])
  }

  /** Generate a random hostname. */
  static hostname(): string {
    return random.choose([
      [10, network.goodHostnames],
      [1, [network.randomIPv4, network.randomIPv6, network.badHostnames]],
    ])
  }

  /** Generate a random port number. */
  static port(): number {
    return random.item([21, 23, 80, 443, 9310])
  }

  /** Generate a random hash value. */
  static hash(): string {
    return random.pick(["", "#", "#main-content", () => `#${make.text.any()}`])
  }

  /** Generate a random path. */
  static path(): string {
    return random.pick(["/", "/index.html", () => `/${make.text.any()}`])
  }

  /** Generate a random protocol handler. */
  static protocol(): string {
    return random.item([
      "chrome",
      "file",
      "ftp",
      "http",
      "https",
      "resource",
      "telnet",
      "ws",
      "wss",
    ])
  }

  /** Generate a random search string. */
  static search(): string {
    return random.choose([
      [1, ["", "?"]],
      [3, () => `?${make.text.any()}`],
      [3, () => `?${make.text.any()}#`],
      [3, () => `?${make.text.any()}#${make.text.any()}`],
      [3, () => `?${make.text.any()}=${make.text.any()}`],
    ])
  }

  /**
   * Generate a random bitmask.
   * @param list - Array of bitmask values.
   */
  static randomBitmask(list: string[]): string {
    if (list.length <= 1) {
      return list.join("")
    }
    const max = random.range(2, list.length)
    let mask = random.pick(list)
    for (let i = 1; i < max; i++) {
      mask += `|${random.pick(list)}`
    }
    return mask
  }

  /** Generate a random header. */
  static header(): string {
    return random.item([
      "Accept",
      "Accept-Additions",
      "Accept-Charset",
      "Accept-Datetime",
      "Accept-Encoding",
      "Accept-Features",
      "Accept-Language",
      "Accept-Patch",
      "Accept-Post",
      "Accept-Ranges",
      "Age",
      "A-IM",
      "Allow",
      "ALPN",
      "Also-Control",
      "Alternate-Recipient",
      "Alternates",
      "Alt-Svc",
      "Alt-Used",
      "Apply-To-Redirect-Ref",
      "Approved",
      "ARC-Authentication-Results",
      "Archive",
      "Archived-At",
      "ARC-Message-Signature",
      "ARC-Seal",
      "Article-Names",
      "Article-Updates",
      "Authentication-Control",
      "Authentication-Info",
      "Authentication-Results",
      "Authorization",
      "Autoforwarded",
      "Autosubmitted",
      "Auto-Submitted",
      "Base",
      "Bcc",
      "Body",
      "Cache-Control",
      "CalDAV-Timezones",
      "Cal-Managed-ID",
      "Cancel-Key",
      "Cancel-Lock",
      "Cc",
      "CDN-Loop",
      "Cert-Not-After",
      "Cert-Not-Before",
      "C-Ext",
      "Close",
      "C-Man",
      "Comments",
      "Connection",
      "Content-Alternative",
      "Content-Base",
      "Content-Description",
      "Content-Disposition",
      "Content-Duration",
      "Content-Encoding",
      "Content-features",
      "Content-ID",
      "Content-Identifier",
      "Content-Language",
      "Content-Length",
      "Content-Location",
      "Content-MD5",
      "Content-Range",
      "Content-Return",
      "Content-Script-Type",
      "Content-Style-Type",
      "Content-Transfer-Encoding",
      "Content-Translation-Type",
      "Content-Type",
      "Content-Version",
      "Control",
      "Conversion",
      "Conversion-With-Loss",
      "Cookie",
      "Cookie2",
      "C-Opt",
      "C-PEP",
      "C-PEP-Info",
      "DASL",
      "Date",
      "Date-Received",
      "DAV",
      "Default-Style",
      "Deferred-Delivery",
      "Delivery-Date",
      "Delta-Base",
      "Depth",
      "Derived-From",
      "Destination",
      "Differential-ID",
      "Digest",
      "Discarded-X400-IPMS-Extensions",
      "Discarded-X400-MTS-Extensions",
      "Disclose-Recipients",
      "Disposition-Notification-Options",
      "Disposition-Notification-To",
      "Distribution",
      "DKIM-Signature",
      "DL-Expansion-History",
      "Downgraded-Bcc",
      "Downgraded-Cc",
      "Downgraded-Disposition-Notification-To",
      "Downgraded-Final-Recipient",
      "Downgraded-From",
      "Downgraded-In-Reply-To",
      "Downgraded-Mail-From",
      "Downgraded-Message-Id",
      "Downgraded-Original-Recipient",
      "Downgraded-Rcpt-To",
      "Downgraded-References",
      "Downgraded-Reply-To",
      "Downgraded-Resent-Bcc",
      "Downgraded-Resent-Cc",
      "Downgraded-Resent-From",
      "Downgraded-Resent-Reply-To",
      "Downgraded-Resent-Sender",
      "Downgraded-Resent-To",
      "Downgraded-Return-Path",
      "Downgraded-Sender",
      "Downgraded-To",
      "Early-Data",
      "Encoding",
      "Encrypted",
      "ETag",
      "Expect",
      "Expect-CT",
      "Expires",
      "Expiry-Date",
      "Ext",
      "Followup-To",
      "Forwarded",
      "From",
      "Generate-Delivery-Report",
      "GetProfile",
      "Hobareg",
      "Host",
      "HTTP2-Settings",
      "If",
      "If-Match",
      "If-Modified-Since",
      "If-None-Match",
      "If-Range",
      "If-Schedule-Tag-Match",
      "If-Unmodified-Since",
      "IM",
      "Importance",
      "Include-Referred-Token-Binding-ID",
      "Incomplete-Copy",
      "Injection-Date",
      "Injection-Info",
      "In-Reply-To",
      "Keep-Alive",
      "Keywords",
      "Label",
      "Language",
      "Last-Modified",
      "Latest-Delivery-Time",
      "Lines",
      "Link",
      "List-Archive",
      "List-Help",
      "List-ID",
      "List-Owner",
      "List-Post",
      "List-Subscribe",
      "List-Unsubscribe",
      "List-Unsubscribe-Post",
      "Location",
      "Lock-Token",
      "Man",
      "Max-Forwards",
      "Memento-Datetime",
      "Message-Context",
      "Message-ID",
      "Message-Type",
      "Meter",
      "MIME-Version",
      "MMHS-Acp127-Message-Identifier",
      "MMHS-Codress-Message-Indicator",
      "MMHS-Copy-Precedence",
      "MMHS-Exempted-Address",
      "MMHS-Extended-Authorisation-Info",
      "MMHS-Handling-Instructions",
      "MMHS-Message-Instructions",
      "MMHS-Message-Type",
      "MMHS-Originator-PLAD",
      "MMHS-Originator-Reference",
      "MMHS-Other-Recipients-Indicator-CC",
      "MMHS-Other-Recipients-Indicator-To",
      "MMHS-Primary-Precedence",
      "MMHS-Subject-Indicator-Codes",
      "MT-Priority",
      "Negotiate",
      "Newsgroups",
      "NNTP-Posting-Date",
      "NNTP-Posting-Host",
      "Obsoletes",
      "OData-EntityId",
      "OData-Isolation",
      "OData-MaxVersion",
      "OData-Version",
      "Opt",
      "Optional-WWW-Authenticate",
      "Ordering-Type",
      "Organization",
      "Origin",
      "Original-Encoded-Information-Types",
      "Original-From",
      "Original-Message-ID",
      "Original-Recipient",
      "Original-Sender",
      "Original-Subject",
      "Originator-Return-Address",
      "OSCORE",
      "Overwrite",
      "P3P",
      "Path",
      "PEP",
      "Pep-Info",
      "PICS-Label",
      "Position",
      "Posting-Version",
      "Pragma",
      "Prefer",
      "Preference-Applied",
      "Prevent-NonDelivery-Report",
      "Priority",
      "ProfileObject",
      "Protocol",
      "Protocol-Info",
      "Protocol-Query",
      "Protocol-Request",
      "Proxy-Authenticate",
      "Proxy-Authentication-Info",
      "Proxy-Authorization",
      "Proxy-Features",
      "Proxy-Instruction",
      "Public",
      "Public-Key-Pins",
      "Public-Key-Pins-Report-Only",
      "Range",
      "Received",
      "Received-SPF",
      "Redirect-Ref",
      "References",
      "Referer",
      "Relay-Version",
      "Replay-Nonce",
      "Reply-By",
      "Reply-To",
      "Require-Recipient-Valid-Since",
      "Resent-Bcc",
      "Resent-Cc",
      "Resent-Date",
      "Resent-From",
      "Resent-Message-ID",
      "Resent-Reply-To",
      "Resent-Sender",
      "Resent-To",
      "Retry-After",
      "Return-Path",
      "Safe",
      "Schedule-Reply",
      "Schedule-Tag",
      "Sec-Token-Binding",
      "Security-Scheme",
      "Sec-WebSocket-Accept",
      "Sec-WebSocket-Extensions",
      "Sec-WebSocket-Key",
      "Sec-WebSocket-Protocol",
      "Sec-WebSocket-Version",
      "See-Also",
      "Sender",
      "Sensitivity",
      "Server",
      "Set-Cookie",
      "Set-Cookie2",
      "SetProfile",
      "SLUG",
      "SoapAction",
      "Solicitation",
      "Status-URI",
      "Strict-Transport-Security",
      "Subject",
      "Summary",
      "Sunset",
      "Supersedes",
      "Surrogate-Capability",
      "Surrogate-Control",
      "TCN",
      "TE",
      "Timeout",
      "TLS-Report-Domain",
      "TLS-Report-Submitter",
      "TLS-Required",
      "To",
      "Topic",
      "Trailer",
      "Transfer-Encoding",
      "TTL",
      "Upgrade",
      "Urgency",
      "URI",
      "User-Agent",
      "Variant-Vary",
      "Vary",
      "VBR-Info",
      "Via",
      "Want-Digest",
      "Warning",
      "WWW-Authenticate",
      "X400-Content-Identifier",
      "X400-Content-Return",
      "X400-Content-Type",
      "X400-MTS-Identifier",
      "X400-Originator",
      "X400-Received",
      "X400-Recipients",
      "X400-Trace",
      "X-Content-Type-Options",
      "X-Frame-Options",
      "Xref",
    ])
  }

  /** Generate a random request method. */
  static requestMethod(): string {
    return random.item(["GET", "HEAD", "POST", "PUT", "DELETE", "CONNECT", "OPTIONS", "TRACE"])
  }
}
