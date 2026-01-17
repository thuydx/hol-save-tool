import React from 'react'

/**
 * Configuration for highlighted tokens {{token}}
 */
export type HighlightConfig = {
  /** Text to render instead of {{token}} */
  text: string
  /** Optional inline style */
  style?: React.CSSProperties
  /** Optional className (recommended for theming) */
  className?: string
}
/**
 * Highlight map: token -> config
 *
 * Example:
 * {
 *   right: { text: 'bên phải', style: { color: '#51cc8a', fontWeight: 600 } },
 *   left:  { text: 'bên trái', className: 'text-warning fw-bold' }
 * }
 */
export type HighlightMap = Record<string, HighlightConfig>

/**
 * ============================================================
 * renderI18nWithHighlight
 * ============================================================
 *
 * Render i18n content safely with support for:
 *
 * - {{token}}            → highlight (custom style / class)
 * - **bold**             → <strong>
 * - _italic_             → <em>
 * - __underline__        → underline
 * - ~~strikeline~~       → line-through
 * - \n / \\n             → newline (<br />)
 * - "- item"             → Bullet list
 * - "1. item"            → Numbered list:
 *
 * ❌ No dangerouslySetInnerHTML
 * ✅ Safe from XSS
 * ✅ Compatible with existing JSX-based GuideLine
 *
 * ❌ No dangerouslySetInnerHTML
 * ✅ Safe from XSS
 * ✅ Works with old JSX-based GuideLine usage
 *
 * IMPORTANT:
 * - Newline (\n) MUST be inside capture group in split regex,
 *   otherwise JavaScript split() will DROP it.
 *
 * ------------------------------------------------------------
 * Usage example:
 *
 * renderI18nWithHighlight(
 *   "Chọn **{{right}}** để _thêm_ vào kho.\nChọn __{{left}}__ để ~~loại~~ khỏi kho.",
 *   {
 *     right: {
 *       text: 'bên phải',
 *       style: { color: '#51cc8a', fontWeight: 600 }
 *     },
 *     left: {
 *       text: 'bên trái',
 *       className: 'text-warning fw-bold'
 *     }
 *   }
 * )
 * ------------------------------------------------------------
 */
/* =========================================================
 * Main renderer
 * ========================================================= */
export function renderI18nWithHighlight(
  content: string,
  highlights: HighlightMap = {}
): React.ReactNode {
  const normalized = content.replace(/\\n/g, '\n')
  return <>{parseBlocks(normalized, highlights)}</>
}

function renderInline(
  text: string,
  highlights: HighlightMap
): React.ReactNode[] {
  const parts = text.split(
    /(\{\{.*?\}\}|\*\*.*?\*\*|__.*?__|~~.*?~~|_.*?_)/g
  )

  return parts.map((part, index) => {
    if (!part) return null

    // ===== FORMATTED TOKEN =====
    const formatted = renderFormattedToken(
      part,
      highlights,
      index
    )
    if (formatted) return formatted

    return <span key={index}>{part}</span>
  })
}

/* =========================================================
 * Format + token handler
 * ========================================================= */

function renderFormattedToken(
  part: string,
  highlights: HighlightMap,
  key: number
): React.ReactNode | null {
  const rules: Array<{
    regex: RegExp
    wrap: (node: React.ReactNode) => React.ReactNode
  }> = [
    {
      regex: /^\*\*(.+)\*\*$/,
      wrap: node => <strong>{node}</strong>,
    },
    {
      regex: /^__(.+)__$/,
      wrap: node => (
        <span style={{ textDecoration: 'underline' }}>
          {node}
        </span>
      ),
    },
    {
      regex: /^~~(.+)~~$/,
      wrap: node => (
        <span style={{ textDecoration: 'line-through' }}>
          {node}
        </span>
      ),
    },
    {
      regex: /^_(.+)_$/,
      wrap: node => <em>{node}</em>,
    },
  ]

  for (const rule of rules) {
    const match = part.match(rule.regex)
    if (!match) continue

    const inner = match[1]

    // inner is {{token}}
    const tokenMatch = inner.match(/^\{\{(.+?)\}\}$/)
    if (tokenMatch) {
      const token = tokenMatch[1]
      const config = highlights[token]

      const node = config ? (
        <span
          style={config.style}
          className={config.className}
        >
          {config.text}
        </span>
      ) : (
        inner
      )

      return <React.Fragment key={key}>{rule.wrap(node)}</React.Fragment>
    }

    return <React.Fragment key={key}>{rule.wrap(inner)}</React.Fragment>
  }

  // ===== PURE {{token}} =====
  const pureToken = part.match(/^\{\{(.+?)\}\}$/)
  if (pureToken) {
    const token = pureToken[1]
    const config = highlights[token]

    if (!config) return <span key={key}>{part}</span>

    return (
      <span
        key={key}
        style={config.style}
        className={config.className}
      >
        {config.text}
      </span>
    )
  }

  return null
}

function parseBlocks(
  content: string,
  highlights: HighlightMap
): React.ReactNode[] {
  const blocks: React.ReactNode[] = []

  const regex = /\[\[(ul|ol)]]([\s\S]*?)\[\[\/\1]]/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(content))) {
    const [full, type, inner] = match

    // text before list
    if (match.index > lastIndex) {
      blocks.push(
        <React.Fragment key={lastIndex}>
          {renderText(content.slice(lastIndex, match.index), highlights)}
        </React.Fragment>
      )
    }

    const items = inner
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean)
      .map(l => l.replace(/^(-|\d+\.)\s*/, ''))

    blocks.push(
      type === 'ul' ? (
        <ul key={match.index}>
          {items.map((item, i) => (
            <li key={i}>{renderInline(item, highlights)}</li>
          ))}
        </ul>
      ) : (
        <ol key={match.index}>
          {items.map((item, i) => (
            <li key={i}>{renderInline(item, highlights)}</li>
          ))}
        </ol>
      )
    )

    lastIndex = match.index + full.length
  }

  // remaining text
  if (lastIndex < content.length) {
    blocks.push(
      <React.Fragment key={lastIndex}>
        {renderText(content.slice(lastIndex), highlights)}
      </React.Fragment>
    )
  }

  return blocks
}

/* =========================================================
 * Helpers
 * ========================================================= */

function isBullet(line: string) {
  return /^- /.test(line)
}

function isNumbered(line: string) {
  return /^\d+\. /.test(line)
}

function renderText(
  text: string,
  highlights: HighlightMap
): React.ReactNode {
  return text.split('\n').map((line, i, arr) => (
    <React.Fragment key={i}>
      {renderInline(line, highlights)}
      {i < arr.length - 1 && <br />}
    </React.Fragment>
  ))
}



