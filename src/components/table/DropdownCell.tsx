import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CTooltip,
} from '@coreui/react'
import React from 'react'

type DropdownCellProps = {
  value: number
  options: Record<number, string>

  /** legacy text mode */
  labels?: Record<string, string>

  /** custom render */
  renderValue?: (value: number) => React.ReactNode
  renderOption?: (value: number) => React.ReactNode

  /** ✅ NEW */
  hoverLabel?: string

  onChange: (value: number) => void
  maxWidth?: number
}

export function DropdownCell({
                               value,
                               options,
                               labels,
                               renderValue,
                               renderOption,
                               hoverLabel,
                               onChange,
                               maxWidth,
                             }: DropdownCellProps) {
  /* ===== selected value ===== */
  const valueNode = renderValue
    ? renderValue(value)
    : labels && options[value]
      ? labels[options[value]]
      : value

  /* ===== width calc (text mode only) ===== */
  let widthPx = maxWidth ?? 80

  if (!renderValue && labels) {
    const maxLabelLength = Math.max(
      ...Object.values(options).map(k => labels[k]?.length ?? 0),
      0,
    )
    const computedWidth = Math.max(60, maxLabelLength * 8 + 24)
    widthPx = maxWidth ? Math.min(computedWidth, maxWidth) : computedWidth
  }

  /* ===== wrap selected with tooltip if needed ===== */
  const toggleContent = hoverLabel ? (
    <CTooltip content={hoverLabel} placement="top">
      <span className="d-inline-flex align-items-center gap-2">
        {valueNode}
      </span>
    </CTooltip>
  ) : (
    <span className="d-inline-flex align-items-center gap-2">
      {valueNode}
    </span>
  )

  return (
    <CDropdown style={{ width: widthPx }}>
      <CDropdownToggle
        color="light"
        size="sm"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          textAlign: 'left',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
      >
        {toggleContent}
      </CDropdownToggle>

      <CDropdownMenu style={{ minWidth: widthPx }}>
        {Object.keys(options).map(k => {
          const v = Number(k)
          return (
            <CDropdownItem key={v} onClick={() => onChange(v)}>
              {renderOption
                ? renderOption(v)
                : labels?.[options[v]] ?? v}
            </CDropdownItem>
          )
        })}
      </CDropdownMenu>
    </CDropdown>
  )
}
