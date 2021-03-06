/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const make = require('../make')
const random = require('../random')

class html extends make {
  static tag () {
    return random.item(['a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdi', 'bdo', 'bgsound', 'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'command', 'content', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'foo', 'footer', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'image', 'img', 'input', 'ins', 'isindex', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'listing', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meta', 'meter', 'multicol', 'nav', 'nobr', 'noembed', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'plaintext', 'pre', 'progress', 'q', 'rb', 'rp', 'rt', 'rtc', 'ruby', 's', 'samp', 'script', 'section', 'select', 'shadow', 'slot', 'small', 'source', 'spacer', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr', 'xmp'])
  }

  static attribute () {
    return random.item(['accept', 'accept-charset', 'accesskey', 'action', 'align', 'alt', 'async', 'autocomplete', 'autofocus', 'autoplay', 'autosave', 'bgcolor', 'border', 'buffered', 'challenge', 'charset', 'checked', 'cite', 'class', 'code', 'codebase', 'color', 'cols', 'colspan', 'content', 'contenteditable', 'contextmenu', 'controls', 'coords', 'crossorigin', 'data', 'data-*', 'datetime', 'default', 'defer', 'dir', 'dirname', 'disabled', 'download', 'draggable', 'dropzone', 'enctype', 'for', 'form', 'formaction', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'http-equiv', 'icon', 'id', 'integrity', 'ismap', 'itemprop', 'keytype', 'kind', 'label', 'lang', 'language', 'list', 'loop', 'low', 'manifest', 'max', 'maxlength', 'minlength', 'media', 'method', 'min', 'multiple', 'muted', 'name', 'novalidate', 'open', 'optimum', 'pattern', 'ping', 'placeholder', 'poster', 'preload', 'radiogroup', 'readonly', 'rel', 'required', 'reversed', 'rows', 'rowspan', 'sandbox', 'scope', 'scoped', 'seamless', 'selected', 'shape', 'size', 'sizes', 'slot', 'span', 'spellcheck', 'src', 'srcdoc', 'srclang', 'srcset', 'start', 'step', 'style', 'summary', 'tabindex', 'target', 'title', 'type', 'usemap', 'value', 'width'])
  }

  static interfaceName () {
    return random.pick(['HTMLBRElement', 'HTMLTableSectionElement', 'HTMLDataListElement', 'HTMLTableElement', 'HTMLOListElement', 'HTMLFontElement', 'HTMLMapElement', 'HTMLButtonElement', 'HTMLFrameSetElement', 'HTMLDataElement', 'HTMLOptGroupElement', 'HTMLAnchorElement', 'HTMLLinkElement', 'HTMLObjectElement', 'HTMLHeadElement', 'HTMLProgressElement', 'HTMLFrameElement', 'HTMLTimeElement', 'HTMLTableCaptionElement', 'HTMLDivElement', 'HTMLDListElement', 'HTMLBodyElement', 'HTMLImageElement', 'HTMLTableRowElement', 'HTMLScriptElement', 'HTMLInputElement', 'HTMLMeterElement', 'HTMLFieldSetElement', 'HTMLHtmlElement', 'HTMLStyleElement', 'HTMLDetailsElement', 'HTMLTrackElement', 'HTMLBaseElement', 'HTMLTableColElement', 'HTMLSourceElement', 'HTMLPictureElement', 'HTMLSelectElement', 'HTMLLegendElement', 'HTMLHRElement', 'HTMLModElement', 'HTMLTemplateElement', 'HTMLAreaElement', 'HTMLFormElement', 'HTMLEmbedElement', 'HTMLSpanElement', 'HTMLParagraphElement', 'HTMLIFrameElement', 'HTMLTableCellElement', 'HTMLElement', 'HTMLMenuElement', 'HTMLTextAreaElement', 'HTMLHeadingElement', 'HTMLCanvasElement', 'HTMLOutputElement', 'HTMLQuoteElement', 'HTMLOptionElement', 'HTMLLIElement', 'HTMLAudioElement', 'HTMLMenuItemElement', 'HTMLParamElement', 'HTMLUListElement', 'HTMLLabelElement', 'HTMLDirectoryElement', 'HTMLTitleElement', 'HTMLPreElement', 'HTMLMetaElement', 'HTMLVideoElement'])
  }

  static className () {
    return random.item(['class_1', 'class_2', 'class_3', 'class_4'])
  }
}

module.exports = html
