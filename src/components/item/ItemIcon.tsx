'use client'

import React from 'react'
import {ICON_SETS} from './itemIconConfig'

type Props = {
  id: string          // itemId
  size?: number       // size hiển thị (default 32)
  iconSet?: 'item' | 'main' | string
}

export const ItemIcon: React.FC<Props> = ({
                                            id,
                                            size = 32,
                                            iconSet = 'item',
                                          }) => {
  const set = ICON_SETS[iconSet] ?? ICON_SETS.item
  const iconId = set.resolveId ? set.resolveId(id) : id
  const rect = set.atlas[iconId]

  if (!rect) return null

  const {x, y, w, h} = rect

  // scale để fit icon vào box vuông
  const scale = size / Math.max(w, h)

  return (
    <div style={{width: size, height: size, overflow: 'hidden'}}>
      {/* REAL ICON BOX */}
      <div
        style={{
          width: w,
          height: h,
          backgroundImage: `url(${set.image})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${set.spriteWidth}px ${set.spriteHeight}px`,
          backgroundPosition: `-${x}px -${y}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      />
    </div>
  )
}
