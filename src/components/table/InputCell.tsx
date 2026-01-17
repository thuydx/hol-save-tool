type InputCellProps<T> = {
  value: T
  type?: 'text' | 'number'
  onChange?: (value: T) => void
  onBlur?: (value: T) => void
  disabled?: boolean
}

export function InputCell<T>({
                               value,
                               type,
                               onChange,
                               onBlur,
                               disabled = false,
                             }: InputCellProps<T>) {
  return (
    <input
      type={type ?? 'text'}
      value={value as any}
      disabled={disabled}
      onChange={e => onChange?.(e.target.value as any)}
      onBlur={e => onBlur?.(e.target.value as any)}
      style={{width: '100%'}}
    />
  )
}
