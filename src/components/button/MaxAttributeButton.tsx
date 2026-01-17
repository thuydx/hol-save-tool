import {CButton} from '@coreui/react'

type MaxAttributeButtonProps = {
  label: string
  onClick: () => Promise<void> | void
}

/**
 * max all attribute button
 * @param label
 * @param onClick
 * @usage
 * <MaxAttributeButton
 *   label={t.member?.batch?.maxAll ?? 'Max All'}
 *   onClick={async () => {
 *     await repo.batchUpdate(m =>
 *       maxAllAttributes(m, columns),
 *     )
 *     forceReload()
 *   }}
 * />
 */
export function MaxAttributeButton({
                                     label,
                                     onClick,
                                   }: MaxAttributeButtonProps) {
  return (
    <CButton
      color="warning"
      className="w-200"
      onClick={onClick}
    >
      {label}
    </CButton>
  )
}
