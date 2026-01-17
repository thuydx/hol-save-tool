import {useCallback} from 'react'

type UseBatchEditorOptions<T> = {
  /**
   * Batch update function
   * Ví dụ:
   *   updater = (row) => nextRow
   */
  batchUpdate: (updater: (row: T) => T) => Promise<void>

  /**
   * Callback sau khi batch xong
   * Thường là forceReload()
   */
  onDone?: () => void
}

export function useBatchEditor<T>({
                                    batchUpdate,
                                    onDone,
                                  }: UseBatchEditorOptions<T>) {
  const run = useCallback(
    async (updater: (row: T) => T) => {
      await batchUpdate(updater)
      onDone?.()
    },
    [batchUpdate, onDone],
  )

  return {
    run,
  }
}
