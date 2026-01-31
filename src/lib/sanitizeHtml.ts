const ALLOWED_TAGS = new Set([
  'a',
  'abbr',
  'b',
  'blockquote',
  'br',
  'code',
  'div',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'i',
  'img',
  'li',
  'ol',
  'p',
  'pre',
  'small',
  'span',
  'strong',
  'sub',
  'sup',
  'table',
  'tbody',
  'td',
  'th',
  'thead',
  'tr',
  'u',
  'ul',
  // Embeds
  'iframe',
])

const GLOBAL_ALLOWED_ATTRS = new Set(['class', 'id', 'title', 'aria-label'])

const TAG_ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'target', 'rel']),
  img: new Set(['src', 'alt', 'width', 'height', 'loading', 'referrerpolicy']),
  iframe: new Set([
    'src',
    'width',
    'height',
    'title',
    'allow',
    'allowfullscreen',
    'loading',
    'referrerpolicy',
    'sandbox',
    'frameborder',
  ]),
  table: new Set(['cellpadding', 'cellspacing']),
  td: new Set(['colspan', 'rowspan']),
  th: new Set(['colspan', 'rowspan', 'scope']),
}

const DISALLOWED_TAGS = new Set([
  'script',
  'style',
  'link',
  'meta',
  'object',
  'embed',
  'base',
  'form',
  'input',
  'button',
  'textarea',
  'select',
  'option',
])

function isSafeUrl(raw: string, kind: 'href' | 'src'): boolean {
  const value = raw.trim()
  if (!value) return false

  // Allow page anchors
  if (kind === 'href' && value.startsWith('#')) return true

  // Allow common safe schemes
  try {
    const url = new URL(value, typeof window !== 'undefined' ? window.location.origin : 'https://example.com')
    const protocol = url.protocol.toLowerCase()

    if (protocol === 'http:' || protocol === 'https:') return true
    if (kind === 'href' && (protocol === 'mailto:' || protocol === 'tel:')) return true

    // Allow images as data URLs (optional but useful for editors)
    if (kind === 'src' && protocol === 'data:' && value.startsWith('data:image/')) return true

    return false
  } catch {
    return false
  }
}

function isSafeIframeSrc(raw: string): boolean {
  try {
    const url = new URL(raw, typeof window !== 'undefined' ? window.location.origin : 'https://example.com')
    const host = url.hostname.toLowerCase()
    const path = url.pathname

    // YouTube embeds
    if (host === 'www.youtube.com' && path.startsWith('/embed/')) return true
    if (host === 'youtube.com' && path.startsWith('/embed/')) return true

    // Vimeo embeds
    if (host === 'player.vimeo.com' && path.startsWith('/video/')) return true

    return false
  } catch {
    return false
  }
}

/**
 * Extracts Google Drive file ID from various URL formats.
 * Supports: /file/d/FILE_ID/view, /open?id=FILE_ID, /thumbnail?id=FILE_ID
 */
function getGoogleDriveFileId(raw: string): string | null {
  const value = raw.trim()
  if (!value) return null
  try {
    const url = new URL(value, 'https://example.com')
    const host = url.hostname.toLowerCase()
    if (host !== 'drive.google.com') return null
    const path = url.pathname
    const search = url.searchParams
    // /file/d/FILE_ID/view
    const fileMatch = path.match(/^\/file\/d\/([a-zA-Z0-9_-]+)(?:\/view)?\/?$/i)
    if (fileMatch) return fileMatch[1]
    // /open?id=FILE_ID or /thumbnail?id=FILE_ID
    const id = search.get('id')
    if (id && /^[a-zA-Z0-9_-]+$/.test(id)) return id
    return null
  } catch {
    return null
  }
}

/**
 * Converts Google Drive sharing URLs to thumbnail URL that works in <img src>.
 * Since 2024, uc?export=view returns 403; thumbnail endpoint works for embedding.
 * Format: https://drive.google.com/thumbnail?id=FILE_ID&sz=w1000
 */
export function toDirectGoogleDriveImageUrl(raw: string): string | null {
  const fileId = getGoogleDriveFileId(raw)
  if (!fileId) return null
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`
}

/**
 * Replaces Google Drive view URLs in img src with thumbnail URLs so images display in editors.
 * Use when loading lesson content into the admin Rich Text Editor.
 */
export function transformGoogleDriveImageUrlsInHtml(html: string): string {
  if (!html || typeof document === 'undefined' || typeof DOMParser === 'undefined') return html
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    doc.querySelectorAll('img[src]').forEach((img) => {
      const src = img.getAttribute('src')
      if (src) {
        const direct = toDirectGoogleDriveImageUrl(src)
        if (direct) img.setAttribute('src', direct)
      }
    })
    return doc.body.innerHTML
  } catch {
    return html
  }
}

function unwrapElement(el: Element) {
  const parent = el.parentNode
  if (!parent) return
  while (el.firstChild) parent.insertBefore(el.firstChild, el)
  parent.removeChild(el)
}

function sanitizeAttributes(el: Element) {
  const tag = el.tagName.toLowerCase()
  const allowedForTag = TAG_ALLOWED_ATTRS[tag] ?? new Set<string>()

  for (const attr of Array.from(el.attributes)) {
    const name = attr.name.toLowerCase()
    const value = attr.value

    // Strip event handlers
    if (name.startsWith('on')) {
      el.removeAttribute(attr.name)
      continue
    }

    const isAllowed = GLOBAL_ALLOWED_ATTRS.has(name) || allowedForTag.has(name)
    if (!isAllowed) {
      el.removeAttribute(attr.name)
      continue
    }

    if (name === 'href' && !isSafeUrl(value, 'href')) {
      el.removeAttribute(attr.name)
      continue
    }

    if (name === 'src') {
      if (tag === 'iframe') {
        if (!isSafeIframeSrc(value)) {
          // Remove entire iframe if src isn't whitelisted
          el.remove()
          return
        }
      } else if (tag === 'img') {
        if (!isSafeUrl(value, 'src')) {
          el.removeAttribute(attr.name)
          continue
        }
        // Convert Google Drive view URLs to direct image URLs so the image displays
        const directUrl = toDirectGoogleDriveImageUrl(value)
        if (directUrl) el.setAttribute('src', directUrl)
      } else if (!isSafeUrl(value, 'src')) {
        el.removeAttribute(attr.name)
        continue
      }
    }
  }

  // Harden links
  if (tag === 'a' && el.getAttribute('href')) {
    el.setAttribute('target', '_blank')
    el.setAttribute('rel', 'noopener noreferrer')
  }

  // Make iframes less likely to overflow
  if (tag === 'iframe' && el.getAttribute('src')) {
    el.setAttribute('loading', el.getAttribute('loading') ?? 'lazy')
    el.setAttribute('referrerpolicy', el.getAttribute('referrerpolicy') ?? 'strict-origin-when-cross-origin')
  }
}

export function sanitizeHtml(input: string): string {
  if (!input) return ''

  // Server-side / non-DOM fallback: at least strip scripts.
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return input.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(input, 'text/html')

  const all = Array.from(doc.body.querySelectorAll('*'))
  for (const el of all) {
    const tag = el.tagName.toLowerCase()

    if (DISALLOWED_TAGS.has(tag)) {
      el.remove()
      continue
    }

    if (!ALLOWED_TAGS.has(tag)) {
      // Preserve readable content by unwrapping unknown tags.
      unwrapElement(el)
      continue
    }

    sanitizeAttributes(el)
  }

  return doc.body.innerHTML
}

export function looksLikeHtml(value: string): boolean {
  // Basic heuristic: any HTML tag present.
  return /<\/?[a-z][\s\S]*>/i.test(value)
}


